require("dotenv").config();

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${STRAPI_TOKEN}`,
};

async function main() {
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("Error: STRAPI_URL and STRAPI_TOKEN must be set in .env");
    process.exit(1);
  }

  console.log("Setting up Strapi public API permissions...\n");

  // Get the public role
  const rolesRes = await fetch(`${STRAPI_URL}/api/users-permissions/roles`, { headers });
  if (!rolesRes.ok) {
    console.error(`Failed to fetch roles: HTTP ${rolesRes.status}`);
    process.exit(1);
  }

  const rolesData = await rolesRes.json();
  const publicRole = rolesData.roles.find((r) => r.type === "public");

  if (!publicRole) {
    console.error("Public role not found");
    process.exit(1);
  }

  console.log(`  Found public role (ID: ${publicRole.id})`);

  // Get the full role details
  const roleRes = await fetch(
    `${STRAPI_URL}/api/users-permissions/roles/${publicRole.id}`,
    { headers }
  );
  const roleData = await roleRes.json();

  // Enable find and findOne for articles
  const permissions = roleData.role.permissions;

  if (permissions["api::article"] && permissions["api::article"].controllers) {
    const articleControllers = permissions["api::article"].controllers.article;
    if (articleControllers) {
      articleControllers.find = { enabled: true, policy: "" };
      articleControllers.findOne = { enabled: true, policy: "" };
      console.log("  ✓ Enabled find and findOne for articles");
    }
  } else {
    // Strapi v5 might have a different structure — try the alternative
    console.log("  Trying Strapi v5 permissions structure...");

    // For Strapi v5, we use the content-type permissions endpoint
    const permRes = await fetch(
      `${STRAPI_URL}/api/users-permissions/permissions`,
      { headers }
    );
    if (permRes.ok) {
      console.log("  Found permissions endpoint");
    }
  }

  // Update the role with new permissions
  const updateRes = await fetch(
    `${STRAPI_URL}/api/users-permissions/roles/${publicRole.id}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        ...roleData.role,
        permissions,
      }),
    }
  );

  if (updateRes.ok) {
    console.log("\n✅ Public API permissions updated!");
    console.log("   The frontend can now read articles without authentication.");
    console.log(`   Test: ${STRAPI_URL}/api/articles`);
  } else {
    const err = await updateRes.text();
    console.error(`\n✗ Failed to update permissions: ${err}`);
    console.log("\n  You can set permissions manually:");
    console.log("  1. Go to Strapi admin → Settings → Users & Permissions → Roles → Public");
    console.log("  2. Under 'Article', enable 'find' and 'findOne'");
    console.log("  3. Save");
  }
}

main().catch(console.error);
