import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Article";
  const category = searchParams.get("category") || "";

  const config = {
    siteName: "pSEO Workshop",
    colors: { primary: "#ef4444", accent: "#f97316" },
  };

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Category badge */}
        {category && (
          <div
            style={{
              display: "flex",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                background: config.colors.primary,
                color: "white",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              {category}
            </span>
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? "42px" : "52px",
            fontWeight: "bold",
            lineHeight: 1.2,
            maxWidth: "900px",
            marginBottom: "30px",
          }}
        >
          {title}
        </div>

        {/* Site name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: config.colors.primary,
            }}
          />
          <span
            style={{
              fontSize: "22px",
              opacity: 0.8,
            }}
          >
            {config.siteName}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
