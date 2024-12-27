import React, { useState, useEffect } from "react";
import {Box,Typography,Button} from "@mui/material";
import {motion} from "framer-motion";
const Herosection: React.FC = () => {
    const [text, setText] = useState("Welcome!");
    useEffect(() => {
        const interval = setInterval(() => {
            setText((prevText) => (prevText==="Welcome!"?"Bienvenu!":"Welcome!"));
        }, 2000);
        return () => clearInterval(interval);
        },[]);
    return(
        <>
        
        <center><motion.div
            key={text}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <Typography variant="h2" sx={{marginTop:"15%"}}> {text}</Typography>
        </motion.div>
        </center>
        
        <Box
            sx={{
                height: "90vh",
                display: "flex",
                flexDirection: "column",
                marginTop:"5%",
                alignItems: "center",
                textAlign: "center",
                bgcolor: "backgroud.default",
            }}
        >
                <Typography variant="h2" gutterBottom>
                    I am Ritvik Goyal!
                </Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    A passionate Software Developer in Toronto!
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    href="/portfolio"
                >
                    See My Work
                </Button>
            </Box></>
            
    );
};
export default Herosection;