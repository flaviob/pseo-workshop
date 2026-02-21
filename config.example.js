// ============================================
// EXAMPLE CONFIG — Coffee Shops Niche
// ============================================
// Copy this file to config.js and customize it for your niche.
//
// This is a different niche example to show how the same
// framework works for any directory-style site.

module.exports = {
  // Site basics — pick a brandable name for your niche
  siteName: "BestCoffeeShops",
  domain: "bestcoffeeshops.com",
  niche: "coffee shops",
  nicheDescription: "A directory of the best coffee shops for remote workers and coffee lovers",

  // Primary modifiers — the main variable that generates your pages.
  // For location-based niches, these are usually cities.
  // For product niches, these could be categories ("under $50", "for beginners").
  primaryModifiers: [
    "New York",
    "London",
    "Paris",
    "Melbourne",
    "Portland",
    "Seattle",
    "Tokyo",
    "Amsterdam",
  ],

  // Secondary modifiers — add depth and long-tail pages.
  // Think: what filters would someone use when searching?
  secondaryModifiers: [
    "for remote work",
    "with fast wifi",
    "with outdoor seating",
    "open late",
    "with specialty beans",
  ],

  // Which content types to generate (set to false to skip any)
  contentTypes: {
    directoryItem: true,   // Individual reviews (e.g. "Blue Bottle Coffee Review")
    listicle: true,        // Roundups (e.g. "Best Coffee Shops in Portland")
    comparison: true,      // Versus (e.g. "Blue Bottle vs Stumptown")
    blog: true,            // Guides (e.g. "How to Find Great Coffee Shops While Traveling")
  },

  // Specific items in your niche to review individually.
  // For coffee shops, these are well-known chains or standout independents.
  directoryItems: [
    "Blue Bottle Coffee",
    "Stumptown Coffee Roasters",
    "Intelligentsia Coffee",
    "La Colombe",
    "Verve Coffee Roasters",
  ],

  // Blog topics — educational content that supports your directory pages.
  // These attract top-of-funnel traffic and link to your main pages.
  blogTopics: [
    "How to Find the Best Coffee Shops for Remote Work",
    "Coffee Shop Etiquette for Laptop Workers",
    "Single Origin vs Blend: A Beginner's Guide",
    "The Rise of Specialty Coffee Shops",
    "How to Support Your Local Coffee Shop",
  ],

  // Design — pick two colors that fit your niche's vibe.
  // primary: main brand color, accent: highlights and CTAs.
  colors: {
    primary: "#78350f",    // warm brown
    accent: "#d97706",     // amber
  },

  // Analytics — add your GA4 measurement ID after launch
  analytics: {
    gaId: "",
  },
};
