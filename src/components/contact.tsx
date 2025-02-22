import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PageHeader from "@/components/PageHeader";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Card
            elevation={3}
            sx={{
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              {children}
            </CardContent>
          </Card>
        </Box>
      )}
    </div>
  );
}

export default function Contact() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const linkStyle = {
    color: theme.palette.primary.main,
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontSize: "1.2rem",
    transition: "0.3s",
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  };

  return (
    <Box>
      <PageHeader
        title="Contact Me"
        subtitle="Feel free to reach out! Want to collaborate on a project? Have a question? Just want to chat? I'm open to opportunities and new connections!"
        icon={<ContactMailIcon sx={{ fontSize: 40 }} />}
      />

      <Box sx={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="contact tabs"
            centered
            sx={{
              "& .MuiTab-root": {
                fontSize: "1.1rem",
                textTransform: "none",
              },
            }}
          >
            <Tab icon={<EmailIcon />} label="Email" />
            <Tab icon={<LinkedInIcon />} label="LinkedIn" />
            <Tab icon={<GitHubIcon />} label="Github" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Box
            component="a"
            href="mailto:contact@ritvikgoyal.com"
            sx={linkStyle}
          >
            <EmailIcon /> contact@ritvikgoyal.com
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Box
            component="a"
            href="https://www.linkedin.com/in/ritvikgoyal1/"
            target="_blank"
            rel="noopener noreferrer"
            sx={linkStyle}
          >
            <LinkedInIcon /> Connect with me on my LinkedIn Profile
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Box
            component="a"
            href="https://www.github.com/RitvikGoyal1"
            target="_blank"
            rel="noopener noreferrer"
            sx={linkStyle}
          >
            <GitHubIcon /> Visit my GitHub Profile
          </Box>
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
