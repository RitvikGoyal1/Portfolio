import Timeline from "@/components/timeline";

function Experiences() {
  return (
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
                            <li>➣ Learnt web development; built my first website and a game using Pygame.</li>
                          </ul>`,
        },
        {
          title: "2023",
          content: `<ul>
                            <li>➣ Participated in an interschool hackathon</li>
                            <li>➣ Started learning React and landed my first Software Developer internship at Stem-E.</li>
                            <li>➣ Competed in my first hackathon, AmberHacks, and built a project to help child trafficking victims.</li>
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
                        <li>➣ Organizing and Judging at ScrapYard, an Hackathon by Hack Club, with anticipated 100+ Participants.</li>
                        <li>➣ Preparing for upcoming CCC.</li>
                      </ul>`,
        },
      ]}
    />
  );
}

export default Experiences;
