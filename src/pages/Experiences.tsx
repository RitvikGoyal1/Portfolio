import Timeline from "@/components/timeline";
import PageHeader from "@/components/PageHeader";
import TimelineIcon from "@mui/icons-material/Timeline";

function Experiences() {
  return (
    <>
      <PageHeader
        title="My Journey"
        subtitle="Key moments of my computer science journey year by year! 🚀"
        icon={<TimelineIcon sx={{ fontSize: 40 }} />}
      />
      <Timeline
        data={[
          {
            title: "Started",
            content: `<ul>
                          <li>➣ Discovered a passion for programming during 6th-7th grade.</li>
                          <li>➣ Learned Scratch through summer library workshops.</li>
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
                        <li>➣ Organizing and Judging at <a href="https://scrapyard.hackclub.com/toronto">Scrapyard Toronto</a>, an Hackathon by Hack Club, with anticipated 100+ Participants.</li>
                        <li>➣ Preparing for upcoming CCC.</li>
                      </ul>`,
          },
        ]}
      />
    </>
  );
}

export default Experiences;
