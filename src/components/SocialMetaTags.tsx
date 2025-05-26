import React from "react";
import { Helmet } from "react-helmet-async";
import seoConfig from "../config/seoConfig";

interface SocialMetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  articleAuthor?: string;
  articleSection?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
}

const SocialMetaTags: React.FC<SocialMetaTagsProps> = ({
  title = seoConfig.site.title,
  description = seoConfig.site.description,
  image = seoConfig.site.image,
  url = seoConfig.site.url,
  type = "website",
  articleAuthor,
  articleSection,
  articlePublishedTime,
  articleModifiedTime,
  twitterCard = "summary_large_image",
}) => {
  const fullImageUrl = image?.startsWith("http")
    ? image
    : `${seoConfig.site.url}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={seoConfig.site.name} />
      <meta property="og:locale" content={seoConfig.site.locale} />

      {/* Article-specific Open Graph tags */}
      {articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}
      {articleSection && (
        <meta property="article:section" content={articleSection} />
      )}
      {articlePublishedTime && (
        <meta
          property="article:published_time"
          content={articlePublishedTime}
        />
      )}
      {articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:site" content={seoConfig.social.twitter} />
      <meta name="twitter:creator" content={seoConfig.social.twitter} />

      {/* Additional Meta Tags for Professional Portfolio */}
      <meta name="author" content={seoConfig.author.name} />
      <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <meta name="googlebot" content="index, follow" />

      {/* Professional Portfolio specific tags */}
      <meta name="portfolio:developer" content={seoConfig.author.name} />
      <meta
        name="portfolio:location"
        content={`${seoConfig.author.location.city}, ${seoConfig.author.location.country}`}
      />
      <meta
        name="portfolio:skills"
        content="React, TypeScript, JavaScript, Python, Node.js, Web Development, Mobile Development"
      />
      <meta name="portfolio:contact" content={seoConfig.author.email} />

      {/* Language and Region */}
      <meta httpEquiv="content-language" content={seoConfig.site.language} />
      <meta
        name="geo.region"
        content={`${seoConfig.author.location.country}-${seoConfig.author.location.region}`}
      />
      <meta name="geo.placename" content={seoConfig.author.location.city} />

      {/* Mobile Optimization */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
      />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/manifest.json" />

      {/* Performance and Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {/* Professional Contact Information */}
      <link rel="me" href={seoConfig.author.social.linkedin} />
      <link rel="me" href={seoConfig.author.social.github} />
      <link rel="me" href={`mailto:${seoConfig.author.email}`} />
    </Helmet>
  );
};

export default SocialMetaTags;
