import "./globals.css";
import { Inter, DM_Sans } from "next/font/google";

const config = require("../config");

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

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
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <header className="bg-white border-b border-brand-200">
          <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-display text-xl font-bold text-ink-950">
              {config.siteName}
            </a>
            <div className="flex gap-6 text-sm font-medium text-ink-500">
              <a href="/" className="hover:text-accent-600 transition-colors">
                Home
              </a>
              <a href="/privacy" className="hover:text-accent-600 transition-colors">
                Privacy
              </a>
              <a href="/contact" className="hover:text-accent-600 transition-colors">
                Contact
              </a>
            </div>
          </nav>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>

        <footer className="bg-ink-950 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-10 text-center">
            <p className="font-display font-bold text-white text-lg mb-1">
              {config.siteName}
            </p>
            <p className="text-ink-400 text-sm mb-6">
              {config.nicheDescription}
            </p>
            <div className="flex gap-6 justify-center text-sm text-ink-400">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/contact" className="hover:text-white transition-colors">
                Contact
              </a>
              <a href="/sitemap.xml" className="hover:text-white transition-colors">
                Sitemap
              </a>
            </div>
            <p className="mt-6 text-xs text-ink-600">
              &copy; {new Date().getFullYear()} {config.siteName}. All rights
              reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
