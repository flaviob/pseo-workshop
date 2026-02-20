module.exports = {
  // ============================================
  // EDIT THIS FILE TO CONFIGURE YOUR PSEO SITE
  // ============================================

  // Site basics
  siteName: "BestCoworkingSpaces",
  domain: "bestcoworkingspaces.com",
  niche: "coworking spaces",
  nicheDescription: "A directory of the best coworking spaces around the world",

  // Primary modifiers — the main variable (cities, categories, etc.)
  // These generate your main pages: "Best coworking spaces in [modifier]"
  primaryModifiers: [
    "New York",
    "London",
    "Berlin",
    "Tokyo",
    "San Francisco",
    "Austin",
    "Lisbon",
    "Barcelona",
    "Amsterdam",
    "Toronto",
  ],

  // Secondary modifiers — subcategories or filters
  // These add depth: "Best coworking spaces for [modifier]"
  secondaryModifiers: [
    "for freelancers",
    "with meeting rooms",
    "for startups",
    "with private offices",
    "on a budget",
  ],

  // Which content types to generate
  contentTypes: {
    directoryItem: true,   // Individual reviews (e.g. "WeWork Review")
    listicle: true,        // Roundups (e.g. "Best Coworking Spaces in Berlin")
    comparison: true,      // Versus (e.g. "WeWork vs Regus")
    blog: true,            // Guides (e.g. "How to Choose a Coworking Space")
  },

  // Example items for directory entries (specific things to review)
  // These are the actual items in your niche
  directoryItems: [
    "WeWork",
    "Regus",
    "Spaces",
    "Industrious",
    "Convene",
  ],

  // Blog topic ideas (educational content)
  blogTopics: [
    "How to Choose the Right Coworking Space",
    "Remote Work Productivity Tips",
    "Coworking Space Etiquette Guide",
    "Benefits of Coworking vs Working from Home",
    "How to Network at a Coworking Space",
  ],

  // Design
  colors: {
    primary: "#ef4444",
    accent: "#f97316",
  },

  // Analytics (add your GA4 measurement ID)
  analytics: {
    gaId: "",
  },
};
