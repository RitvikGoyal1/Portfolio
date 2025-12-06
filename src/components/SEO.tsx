import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  siteName?: string;
  type?: string;
  structuredData?: object;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Ritvik Goyal - Expert Software Developer & Full-Stack Engineer in Toronto",
  description = "Ritvik Goyal is a highly skilled software developer and full-stack engineer based in Toronto, Canada. Specializing in React, TypeScript, Node.js, and modern web technologies. Available for freelance projects and full-time opportunities. Expert in building scalable web applications, mobile apps, and enterprise solutions.",
  keywords = "ritvik goyal, software developer toronto, full stack developer, react developer, typescript expert, web developer toronto, software engineer canada, frontend developer, backend developer, mobile app developer, freelance developer toronto, hire software developer, javascript expert, node.js developer, python developer",
  image = "https://placehold.co/512",
  url = "https://ritvikgoyal.com",
  siteName = "Ritvik Goyal - Software Developer Portfolio",
  type = "website",
  author = "Ritvik Goyal",
  publishedTime,
  modifiedTime,
  structuredData,
}) => {
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ritvik Goyal",
    url: "https://ritvikgoyal.com",
    image: image,
    sameAs: [
      "https://github.com/ritvikgoyal",
      "https://linkedin.com/in/ritvikgoyal",
      "https://twitter.com/ritvikgoyal",
    ],
    jobTitle: "Software Developer",
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "Ontario",
      addressCountry: "Canada",
    },
    description: description,
    knowsAbout: [
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Python",
      "Full Stack Development",
      "Web Development",
      "Mobile App Development",
      "Software Engineering",
    ],
  };

  const structuredDataToUse = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Title and Basic Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Advanced SEO Meta Tags */}
      <meta name="robots" content="index,follow" />
      <meta name="googlebot" content="index,follow" />
      <meta name="bingbot" content="index,follow" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="language" content="en" />
      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.placename" content="Toronto" />
      <meta name="geo.position" content="43.6532;-79.3832" />
      <meta name="ICBM" content="43.6532, -79.3832" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Ritvik Goyal - Software Developer"
      />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta
        name="twitter:image:alt"
        content="Ritvik Goyal - Software Developer"
      />
      <meta name="twitter:creator" content="@ritvikgoyal" />
      <meta name="twitter:site" content="@ritvikgoyal" />

      {/* Additional Meta Tags for Better SEO */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredDataToUse)}
      </script>

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://cdn.hack.pet" />

      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//cdn.hack.pet" />
    </Helmet>
  );
};

export default SEO;
