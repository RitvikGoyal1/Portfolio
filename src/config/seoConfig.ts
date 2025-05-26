// SEO Configuration - Centralized settings for all SEO components
const seoConfig = {
  // Google Analytics
  googleAnalytics: {
    measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID || "G-XXXXXXXXXX",
    enableEnhancedEcommerce: true,
    enableUserTiming: true,
    enableDebugMode: process.env.NODE_ENV === "development",
  },

  // Site Information
  site: {
    name: "Ritvik Goyal",
    title: "Ritvik Goyal - Expert Software Developer & Full-Stack Engineer",
    description:
      "Professional portfolio showcasing expertise in React, TypeScript, Python, and modern web development. Based in Toronto, Canada.",
    url: "https://ritvikgoyal.com",
    logo: "https://ritvikgoyal.com/logo.png",
    favicon: "https://ritvikgoyal.com/favicon.ico",
    image: "https://ritvikgoyal.com/og-image.jpg",
    language: "en-US",
    locale: "en_US",
    timeZone: "America/Toronto",
  },

  // Author Information
  author: {
    name: "Ritvik Goyal",
    email: "contact@ritvikgoyal.com",
    url: "https://ritvikgoyal.com",
    image: "https://ritvikgoyal.com/profile-image.jpg",
    jobTitle: "Software Developer",
    company: "Freelance",
    location: {
      city: "Toronto",
      region: "Ontario",
      country: "Canada",
      postalCode: "M5V 3A8",
    },
    social: {
      linkedin: "https://www.linkedin.com/in/ritvikgoyal1/",
      github: "https://github.com/RitvikGoyal1",
      twitter: "https://twitter.com/ritvikgoyal",
      email: "mailto:contact@ritvikgoyal.com",
    },
  },

  // Business Information (for Local SEO)
  business: {
    name: "Ritvik Goyal - Software Development Services",
    type: "ProfessionalService",
    description:
      "Expert software development services including web applications, mobile apps, and AI solutions.",
    phone: "+1-647-XXX-XXXX", // Replace with actual phone
    email: "contact@ritvikgoyal.com",
    address: {
      streetAddress: "123 Tech Street", // Replace with actual address
      addressLocality: "Toronto",
      addressRegion: "Ontario",
      postalCode: "M5V 3A8",
      addressCountry: "Canada",
    },
    geo: {
      latitude: 43.6532,
      longitude: -79.3832,
    },
    hours: {
      monday: "09:00-17:00",
      tuesday: "09:00-17:00",
      wednesday: "09:00-17:00",
      thursday: "09:00-17:00",
      friday: "09:00-17:00",
      saturday: "Closed",
      sunday: "Closed",
    },
    services: [
      "Web Development",
      "Mobile App Development",
      "AI/ML Solutions",
      "Database Design",
      "API Development",
      "UI/UX Design",
      "Technical Consulting",
    ],
  },

  // Social Media
  social: {
    twitter: "@ritvikgoyal",
    linkedin: "ritvikgoyal1",
    github: "RitvikGoyal1",
  },

  // Performance Settings
  performance: {
    enableWebVitals: true,
    enableServiceWorker: process.env.NODE_ENV === "production",
    enableCriticalResourceHints: true,
    enableImageOptimization: true,
    webVitalsEndpoint: process.env.REACT_APP_WEBVITALS_ENDPOINT || null,
  },

  // Feature Flags
  features: {
    enableBlog: false, // Set to true when blog is implemented
    enablePortfolio: true,
    enableContact: true,
    enableResume: true,
    enableExperiences: true,
    enableSEOAudit: process.env.NODE_ENV === "development",
  },

  // Keywords by page
  keywords: {
    home: "ritvik goyal, software developer toronto, full stack developer, react developer, typescript expert, web developer canada, freelance developer, javascript expert, node.js developer, python developer",
    portfolio:
      "ritvik goyal portfolio, software development projects, web applications, mobile apps, react projects, AI projects, trading apps, python projects, full stack projects",
    contact:
      "hire ritvik goyal, software developer contact, freelance developer toronto, web development services, mobile app development, technical consulting",
    resume:
      "ritvik goyal resume, software developer cv, full stack engineer resume, react developer experience, toronto developer resume",
    experiences:
      "ritvik goyal experience, software development experience, web development portfolio, mobile development experience, AI projects experience",
  },
};

export default seoConfig;
