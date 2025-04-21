import PageHeader from "../components/PageHeader";
import TimelineIcon from "@mui/icons-material/Timeline";
import Timeline from "@/components/timeline";
import ThemedBackground from "../components/ThemedBackground";
import SEO from "@/components/SEO";

function Experiences() {
  return (
    <ThemedBackground>
      <SEO
        title="My Experiences - Ritvik Goyal"
        description="Explore the key moments, projects, and milestones throughout my computer science journey, from early learning to current endeavors in software development."
      />
      <PageHeader
        title="My Journey"
        subtitle="A timeline highlighting the key moments, learning experiences, and projects throughout my computer science journey year by year! 🚀"
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
        />
      </main>
    </ThemedBackground>
  );
}

export default Experiences;
