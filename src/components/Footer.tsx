import React from "react";
import {Box,Typography,Link} from "@mui/material";

const Footer: React.FC = () => {
    return (
        <Box sx={{bgcolor:"primary.mail",color:"white", p:2, mt:4, textAlign:"center"}}
        >
            <Typography variant="body2">
                © {new Date().getFullYear()} My Portfolio. All rights reserved.
            </Typography>
            <Typography variant="body2">
                <Link href="https://github.com/ritvikgoyal-1" color="inherit">
                    Github
                </Link>{" "}
                |{" "}
                <Link href="https://www.linkedin.com/in/ritvik-goyal/" color="inherit">
                    LinkedIn
                </Link>
            </Typography>
        </Box>
    );
};

export default Footer;