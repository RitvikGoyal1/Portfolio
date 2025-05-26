import React from "react";
import { Helmet } from "react-helmet-async";

interface BlogPostSchemaProps {
  post: {
    title: string;
    description: string;
    content: string;
    url: string;
    imageUrl?: string;
    datePublished: string;
    dateModified?: string;
    tags?: string[];
    category?: string;
    readingTime?: number;
  };
  author?: {
    name: string;
    url: string;
    image?: string;
  };
}

const BlogPostSchema: React.FC<BlogPostSchemaProps> = ({
  post,
  author = {
    name: "Ritvik Goyal",
    url: "https://ritvikgoyal.com",
    image: "https://ritvikgoyal.com/profile-image.jpg",
  },
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    articleBody: post.content,
    url: post.url,
    image: post.imageUrl || "https://ritvikgoyal.com/default-blog-image.jpg",
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
      image: author.image,
    },
    publisher: {
      "@type": "Organization",
      name: "Ritvik Goyal",
      url: "https://ritvikgoyal.com",
      logo: {
        "@type": "ImageObject",
        url: "https://ritvikgoyal.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.url,
    },
    keywords:
      post.tags?.join(", ") ||
      "software development, web development, programming, technology",
    articleSection: post.category || "Technology",
    wordCount: post.content.split(" ").length,
    timeRequired: `PT${post.readingTime || Math.ceil(post.content.split(" ").length / 200)}M`,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    copyrightHolder: {
      "@type": "Person",
      name: author.name,
    },
    copyrightYear: new Date(post.datePublished).getFullYear(),
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};

// FAQ Schema for common developer questions
interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};

export default BlogPostSchema;
