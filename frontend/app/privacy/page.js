const config = require("../../../config");

export const metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${config.siteName}`,
};

export default function PrivacyPage() {
  return (
    <div className="prose max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <h2>Introduction</h2>
      <p>
        {config.siteName} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates{" "}
        {config.domain}. This page informs you of our policies regarding the
        collection, use, and disclosure of personal information when you use our
        website.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We may collect the following types of information:
      </p>
      <ul>
        <li>
          <strong>Usage Data:</strong> We may collect information about how you
          access and use the website, including your IP address, browser type,
          pages visited, and time spent on pages.
        </li>
        <li>
          <strong>Contact Information:</strong> If you contact us through our
          contact form, we collect your name and email address.
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use the collected information to:</p>
      <ul>
        <li>Provide and maintain our website</li>
        <li>Improve and personalize your experience</li>
        <li>Analyze usage patterns to improve our content</li>
        <li>Respond to your inquiries</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use cookies and similar tracking technologies to track activity on our
        website. You can instruct your browser to refuse all cookies or to
        indicate when a cookie is being sent.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        We may use third-party services such as Google Analytics to monitor and
        analyze the use of our website. These services may collect information
        about your use of our site.
      </p>

      <h2>Links to Other Sites</h2>
      <p>
        Our website may contain links to other sites that are not operated by us.
        We have no control over and assume no responsibility for the content or
        privacy policies of any third-party sites.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of
        any changes by posting the new Privacy Policy on this page.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please{" "}
        <a href="/contact" className="text-red-500 hover:underline">
          contact us
        </a>
        .
      </p>
    </div>
  );
}
