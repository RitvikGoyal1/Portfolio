import Contact from "../components/contact";
import PageHeader from "../components/PageHeader";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ThemedBackground from "../components/ThemedBackground";
import SEO from "@/components/SEO";
import LocalBusinessSEO from "../components/LocalBusinessSEO";
import PerformanceOptimization from "../components/PerformanceOptimization";

function ContactPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Ritvik Goyal - Software Developer",
    description:
      "Get in touch with Ritvik Goyal, expert software developer in Toronto. Available for freelance projects, collaborations, and full-time opportunities.",
    url: "https://ritvikgoyal.com/contact",
    author: {
      "@type": "Person",
      name: "Ritvik Goyal",
      email: "mailto:contact@ritvikgoyal.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Toronto",
        addressRegion: "Ontario",
        addressCountry: "Canada",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://ritvikgoyal.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: "https://ritvikgoyal.com/contact",
        },
      ],
    },
  };
  return (
    <PerformanceOptimization>
      <ThemedBackground>
        <SEO
          title="Contact Ritvik Goyal - Hire Expert Software Developer in Toronto"
          description="Get in touch with Ritvik Goyal, expert software developer and full-stack engineer in Toronto. Available for freelance projects, collaborations, consulting, and full-time opportunities. Specializing in React, TypeScript, Node.js, and modern web technologies."
          keywords="contact ritvik goyal, hire software developer toronto, freelance developer toronto, software development consulting, react developer for hire, full stack developer toronto, web developer contact, software engineer hire"
          url="https://ritvikgoyal.com/contact"
          structuredData={structuredData}
        />
        <LocalBusinessSEO page="contact" />
        <PageHeader
          title="Contact Me"
          subtitle="Feel free to reach out! Whether you want to collaborate on a project, have a question about my work, or just want to connect, I'm open to opportunities and new connections!"
          icon={<ContactMailIcon sx={{ fontSize: 40 }} />}
        />
        <main>
          <Contact />{" "}
        </main>
      </ThemedBackground>
    </PerformanceOptimization>
  );
}

export default ContactPage;
