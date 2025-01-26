import React from "react";
import {AppBar, Toolbar, Box} from "@mui/material";
import "./Header.css";
import MaterialUISwitch from "./MaterialUISwitch";
import { Link } from 'react-router-dom';
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
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/experiences">Experiences</Link></li>
                        <li><Link to="/portfolio">Portfolio</Link></li>
                        <li><Link to="/contact">Contact</Link></li>

                    </ul>
                </Box>
                <MaterialUISwitch
                    darkMode={darkMode}
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    color="default"
                    aria-label="Toggle dark mode"
                    inputProps={{ 'aria-label': 'Dark mode toggle' }}

                />
            </Toolbar>
        </AppBar>
    );
};

export default Header;