import { Box } from "@mui/material";
import Contact from "../components/contact";
import PageHeader from "../components/PageHeader";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ThemedBackground from "../components/ThemedBackground";

function ContactPage() {
  return (
    <ThemedBackground>
      <PageHeader
        title="Contact Me"
        subtitle="Feel free to reach out! Want to collaborate on a project? Have a question? Just want to chat? I'm open to opportunities and new connections!"
        icon={<ContactMailIcon sx={{ fontSize: 40 }} />}
      />
      <Contact />
    </ThemedBackground>
  );
}

export default ContactPage;
