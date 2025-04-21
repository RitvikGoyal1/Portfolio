import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  siteName?: string; // Added siteName prop
}

const SEO: React.FC<SEOProps> = ({
  title = "Ritvik Goyal - Software Developer",
  description = "Explore the personal portfolio of Ritvik Goyal, a passionate software developer based in Toronto, specializing in creating modern web applications using React, TypeScript, and other cutting-edge technologies.", // Made default description longer
  keywords = "ritvik goyal, software developer, web developer, react, typescript, portfolio, toronto", // Added toronto
  image = "https://cdn.hack.pet/slackcdn/8dc629a933313d44753d58ee864bbee0.png",
  url = "https://ritvikgoyal.com",
  siteName = "Ritvik Goyal Portfolio",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
