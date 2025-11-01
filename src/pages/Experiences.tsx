import PageHeader from "../components/PageHeader";
import TimelineIcon from "@mui/icons-material/Timeline";
import Timeline from "@/components/timeline";
import ThemedBackground from "../components/ThemedBackground";
import SEO from "@/components/SEO";
import LocalBusinessSEO from "../components/LocalBusinessSEO";
import PerformanceOptimization from "../components/PerformanceOptimization";

function Experiences() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Professional Experience - Ritvik Goyal",
    description:
      "Discover Ritvik Goyal's professional journey, education, and career milestones in software development. From early programming passion to professional internships and competitive achievements.",
    url: "https://ritvikgoyal.com/experiences",
    author: {
      "@type": "Person",
      name: "Ritvik Goyal",
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
          name: "Experiences",
          item: "https://ritvikgoyal.com/experiences",
        },
      ],
    },
  };
  return (
    <PerformanceOptimization>
      <ThemedBackground>
        <SEO
          title="Professional Experience & Journey - Ritvik Goyal | Software Developer Timeline"
          description="Explore Ritvik Goyal's professional journey and career timeline in software development. From early programming passion to competitive achievements, internships at Stem-E, hackathon victories, and educational milestones. Discover key moments that shaped an expert software developer in Toronto."
          keywords="ritvik goyal experience, software developer journey, programming timeline, stem-e internship, hackathon winner, TCS goIT competition, computer science education, software development career, coding competitions, toronto developer experience"
          url="https://ritvikgoyal.com/experiences"
          structuredData={structuredData}
        />
        <LocalBusinessSEO page="experiences" />
        <PageHeader
          title="My Journey"
          subtitle="A timeline highlighting the key moments, learning experiences, and projects throughout my computer science journey year by year!"
          icon={<TimelineIcon sx={{ fontSize: 40 }} />}
        />
        <main>
          <Timeline
            data={[
              {
                title: "Started",
                content: `<ul>
                        <li>➣ Discovered a passion for programming in grade school.</li>
                        <li>➣ Learned Scratch during summer workshops.</li>
                      </ul>`,
              },
              {
                title: "2022",
                content: `<ul>
                            <li>➣ Began learning Python and learnt a lot from my first computer science class in high school.</li>
                            <li>➣ Learnt web development and built my first website and a game using Pygame.</li>
                            <li>➣ <a href="https://www.itworldcanada.com/article/ontario-teen-lands-first-place-in-the-tcs-goit-monthly-competition-for-creating-an-app-to-reduce-e-waste/486760">Won TCS goIT Monthly Competition</a></li>
                          </ul>`,
              },
              {
                title: "2023",
                content: `<ul>
                            <li>➣ Competed in my first hackathon, AmberHacks, and built a project to help child trafficking victims.</li>
                            <li>➣ Started learning React and landed my first Software Developer internship at <a href="https://www.steme.org/">Stem-E</a>.</li>
                            <li>➣ Created a Java Swing game.</li>
                          </ul>`,
              },
              {
                title: "2024",
                content: `<ul>
                          <li>➣ Competed in four coding competitions: CCC, CALICO, M(IT)^2, and SLCC.</li>
                          <li>➣ Participated in my second Hackathon, IgnitionHacks.</li>
                        </ul>`,
              },
              {
                title: "2025 | Now!",
                content: `<ul>
                        <li>➣ Participated in my FTC competition with my school's robotics team.</li>
                        <li>➣ Organized <a href="https://scrapyard.hackclub.com/toronto">Scrapyard Toronto</a>, a Hackathon by Hack Club, with 100+ Participants. Secured over $25K in prizes and funding.</li>
                        <li>➣ Competed in CCC Senior and Genai Genesis.</li>
                        <li>➣ Organizing <a href="https://hackolympus.org">Hack Olympus</a>, with anticipated 150+ Participants.</li>
                        <li>➣ Got accepted into <a href="https://venturedglobal.org">VenturEd Fellowship</a></li>
                      </ul>`,
              },
            ]}
          />{" "}
        </main>
      </ThemedBackground>
    </PerformanceOptimization>
  );
}

export default Experiences;
