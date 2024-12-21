import React from "react";
import {AppBar, Toolbar, Typography, Button, Box} from "@mui/material";
import "./Header.css";
import MaterialUISwitch from "./MaterialUISwitch";
interface HeaderProps {
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    darkMode: boolean;
}
const Header: React.FC<HeaderProps> = ({setDarkMode,darkMode}) => {
    return(
        <AppBar position="static" sx={{bgcolor:"transparent",boxShadow:"none"}}>
            <Toolbar sx={{display:"flex",justifyContent:"space-between", alignItems:"center"}}>
            
                <Box className="menu menu-3" sx={{flexGrow:1, display:"flex",justifyContent:"center"}} >
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/portfolio">Portfolio</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </Box>
                <MaterialUISwitch
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    color="default"
                />
            </Toolbar>
        </AppBar>
    );
};

export default Header;