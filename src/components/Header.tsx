import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./Header.css";
import MaterialUISwitch from "./MaterialUISwitch";
import { Link } from "react-router-dom";

interface HeaderProps {
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ setDarkMode, darkMode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Home", path: "/" },
    { text: "Experiences", path: "/experiences" },
    { text: "Resume", path: "/resume" },
    { text: "Portfolio", path: "/portfolio" },
    { text: "Contact", path: "/contact" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} sx={{ justifyContent: "center", py: 1 }}>
            <Link to={item.path} className="mobile-link">
              {item.text}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "transparent", boxShadow: "none" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton
          color="inherit"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          className="menu menu-3"
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "flex" },
            justifyContent: "center",
          }}
        >
          <nav aria-label="Main Navigation">
            <ul>
              {menuItems.map((item) => (
                <li key={item.text}>
                  <Link
                    to={item.path}
                    aria-current={
                      location.pathname === item.path ? "page" : undefined
                    }
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Box>

        <MaterialUISwitch
          darkMode={darkMode}
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
          color="default"
          aria-label="Toggle dark mode"
          inputProps={{ "aria-label": "Dark mode toggle" }}
        />
      </Toolbar>

      <Drawer
        id="mobile-menu"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            backgroundColor: darkMode ? "#121212" : "#fff",
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
