import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close,
  Restaurant,
  Home,
  SportsEsports,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { label: "Home", path: "/", icon: <Home /> },
    { label: "Menu", path: "/menu", icon: <Restaurant /> },
    { label: "Gaming", path: "/gaming", icon: <SportsEsports /> },
  ];

  const drawer = (
    <Box
      sx={{
        width: 250,
        background: "linear-gradient(180deg, #0A1929 0%, #132F4C 100%)",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <IconButton onClick={handleDrawerToggle} sx={{ color: "#00CED1" }}>
          <Close />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
              sx={{
                py: 2,
                borderLeft:
                  location.pathname === item.path
                    ? "4px solid #00CED1"
                    : "4px solid transparent",
                "&:hover": {
                  background: "rgba(0,206,209,0.1)",
                },
              }}
            >
              <Box sx={{ color: "#00CED1", mr: 2 }}>{item.icon}</Box>
              <ListItemText
                primary={item.label}
                sx={{
                  "& .MuiTypography-root": {
                    fontFamily: "Orbitron",
                    fontWeight: 600,
                    color:
                      location.pathname === item.path ? "#00CED1" : "#B2BAC2",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "rgba(10, 25, 41, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,206,209,0.15)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Box
                onClick={() => navigate("/")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: 2,
                }}
              >
                <Box
                  component="img"
                  src="/logo.png"
                  alt="Epic Lounge"
                  sx={{
                    height: { xs: 50, md: 60 },
                    width: "auto",
                    filter: "drop-shadow(0 0 15px rgba(0,206,209,0.6))",
                    opacity: 0.95,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      filter: "drop-shadow(0 0 25px rgba(155,81,224,0.8))",
                      opacity: 1,
                    },
                  }}
                />
              </Box>
            </motion.div>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    fontFamily: "Orbitron",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color:
                      location.pathname === item.path ? "#00CED1" : "#B2BAC2",
                    borderBottom:
                      location.pathname === item.path
                        ? "2px solid #00CED1"
                        : "2px solid transparent",
                    borderRadius: 0,
                    px: 3,
                    py: 1.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#00CED1",
                      background: "rgba(0,206,209,0.1)",
                      borderBottom: "2px solid #00CED1",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              sx={{
                display: { xs: "block", md: "none" },
                color: "#00CED1",
              }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            background: "transparent",
            boxShadow: "none",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
