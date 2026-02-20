import "./globals.css";

const config = require("../config");

export const metadata = {
  title: {
    default: `${config.siteName} — Find the Best ${config.niche}`,
    template: `%s | ${config.siteName}`,
  },
  description: config.nicheDescription,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <header className="border-b border-gray-200">
          <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-gray-900">
              {config.siteName}
            </a>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="/" className="hover:text-gray-900">
                Home
              </a>
              <a href="/privacy" className="hover:text-gray-900">
                Privacy
              </a>
              <a href="/contact" className="hover:text-gray-900">
                Contact
              </a>
            </div>
          </nav>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>

        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} {config.siteName}. All rights
              reserved.
            </p>
            <div className="mt-2 flex gap-4 justify-center">
              <a href="/privacy" className="hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="/contact" className="hover:text-gray-700">
                Contact
              </a>
              <a href="/sitemap.xml" className="hover:text-gray-700">
                Sitemap
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
