import React from "react";
import {Box,Typography,Button} from "@mui/material";
import {motion} from "framer-motion";
const Herosection: React.FC = () => {
    return(
        <>
        <center><motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <Typography variant="h2"> Welcome</Typography>
        </motion.div>
        </center><Box
            sx={{
                height: "90vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                bgcolor: "backgroud.default",
            }}
        >
                <Typography variant="h2" gutterBottom>
                    Hi, I am Ritvik Goyal!
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