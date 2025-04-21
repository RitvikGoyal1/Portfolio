import Contact from "../components/contact";
import PageHeader from "../components/PageHeader";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ThemedBackground from "../components/ThemedBackground";
import SEO from "@/components/SEO";

function ContactPage() {
  return (
    <ThemedBackground>
      <SEO
        title="Contact Me - Ritvik Goyal"
        description="Get in touch with Ritvik Goyal. Reach out via email or connect on LinkedIn for collaborations, questions, or just to chat about software development."
      />
      <PageHeader
        title="Contact Me"
        subtitle="Feel free to reach out! Whether you want to collaborate on a project, have a question about my work, or just want to connect, I'm open to opportunities and new connections!"
        icon={<ContactMailIcon sx={{ fontSize: 40 }} />}
      />
      <main>
        <Contact />
      </main>
    </ThemedBackground>
  );
}

export default ContactPage;
