import {Container} from "@mui/material"; 
import HeroSection from "../components/HeroSection";
import Card from "../components/Card"
const items = ["About me 1", "About me 2", "About me 3", "About me 4", "About me 5"];
function Home() {
    return(
        <Container maxWidth="md">
            <HeroSection/>
            <div className="App">
            {items.map((item, i) => (
                <Card key={i} text={item} index={i} />
            ))}
    </div>

        </Container>
        
    );

}

export default Home;