import Timeline from "@/components/timeline";

function Experiences() {
    return(
        <Timeline data={[
            {
            title: 'Started the Journey',
            content: 'First programming course.',}
          ,{
            title: '2022',
            content: 'Built a website and participated in a hackathon.'}
            ,{
              title: '2023',
              content: 'Participated in multiple competitive coding competitons.'}
              ,{
                title: '2024',
                content: 'Volunteered as a Software Dev.'}]} />
    );
    
}

export default Experiences;