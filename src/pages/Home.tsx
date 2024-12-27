import {Container} from "@mui/material"; 
import HeroSection from "../components/HeroSection";
import Card from "../components/Card"
const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
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