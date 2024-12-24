import {Container, Typography,Button} from "@mui/material"; 
import HeroSection from "../components/HeroSection";

function Home() {
    return(
        <Container maxWidth="md">
            <HeroSection/>
            <Typography variant="h2" gutterBottom>
                Hey, I'm Ritvik Goyal!
            </Typography>
            <Typography variant="h5" gutterBottom>
                Software Developer
            </Typography>
            <Button variant="contained" color="primary" href="/portfolio">
                View My Work
            </Button>
        </Container>
    );

}

export default Home;