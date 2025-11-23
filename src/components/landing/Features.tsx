import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  SportsEsports,
  SportsBar,
  Weekend,
  Wifi,
  EmojiEvents,
  Groups,
  LocalCafe,
  Casino,
  SportsFootball,
  VideogameAsset,
  TableRestaurant,
  LocalActivity,
  LocationOn,
} from "@mui/icons-material";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <SportsEsports sx={{ fontSize: 60 }} />,
    title: "CS 1.6 LAN Area",
    description:
      "Classic Counter-Strike 1.6 on LAN for nostalgic battles with friends",
    color: "#00CED1",
  },
  {
    icon: <VideogameAsset sx={{ fontSize: 60 }} />,
    title: "Online Gaming Zone",
    description:
      "High-end PCs with RTX 5070, 32GB RAM, 244Hz monitors for CS2, Valorant & more",
    color: "#9B51E0",
  },
  {
    icon: <Weekend sx={{ fontSize: 60 }} />,
    title: "Private PS5 Rooms",
    description:
      "2 exclusive PS5 rooms for FIFA, Call of Duty & latest console games",
    color: "#FF6B9D",
  },
  {
    icon: <SportsBar sx={{ fontSize: 60 }} />,
    title: "Billiards Tables",
    description:
      "Professional pool tables for friendly matches and tournaments",
    color: "#00FF88",
  },
  {
    icon: <Casino sx={{ fontSize: 60 }} />,
    title: "Foosball",
    description: "Fast-paced table football action with your squad",
    color: "#FFD93D",
  },
  {
    icon: <TableRestaurant sx={{ fontSize: 60 }} />,
    title: "Chess & Chill Zone",
    description: "Relaxing area to play chess, socialize, and unwind",
    color: "#6C63FF",
  },
  {
    icon: <SportsFootball sx={{ fontSize: 60 }} />,
    title: "Big Screen Football",
    description:
      "Watch live football matches on our massive screen with friends",
    color: "#FF3D00",
  },
  {
    icon: <LocalCafe sx={{ fontSize: 60 }} />,
    title: "Coffee & Snacks",
    description: "Fresh coffee, energy drinks, chips, chocolate & gaming fuel",
    color: "#795548",
  },
  {
    icon: <Wifi sx={{ fontSize: 60 }} />,
    title: "Ultra-Fast Internet",
    description:
      "Fiber optic connection with ultra-low latency for competitive gaming",
    color: "#00CED1",
  },
  {
    icon: <Groups sx={{ fontSize: 60 }} />,
    title: "Squad Sessions",
    description: "Book stations for your full squad and dominate together",
    color: "#9B51E0",
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 60 }} />,
    title: "Tournaments",
    description: "Regular gaming competitions with awesome prizes",
    color: "#FFC107",
  },
  {
    icon: <LocalActivity sx={{ fontSize: 60 }} />,
    title: "Special Events",
    description: "LAN parties, viewing parties, and exclusive gaming events",
    color: "#E91E63",
  },
];

const Features: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Box
      id="features"
      sx={{
        py: { xs: 8, md: 12 },
        background:
          "linear-gradient(180deg, #0A1929 0%, #1a237e 50%, #0A1929 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2300CED1" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <Container maxWidth="lg" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Stack
            spacing={2}
            alignItems="center"
            textAlign="center"
            sx={{ mb: 8 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Orbitron",
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                background: "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 40px rgba(0,206,209,0.3)",
              }}
            >
              EPIC FEATURES
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#B2BAC2",
                maxWidth: "700px",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
              }}
            >
              Everything you need for the ultimate gaming experience
            </Typography>
          </Stack>
        </motion.div>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    background: "rgba(19, 47, 76, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-12px)",
                      border: `1px solid ${feature.color}`,
                      boxShadow: `0 20px 60px ${feature.color}40`,
                      "& .feature-icon": {
                        transform: "scale(1.2) rotate(5deg)",
                        color: feature.color,
                      },
                      "&::before": {
                        opacity: 1,
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at 50% 0%, ${feature.color}20 0%, transparent 70%)`,
                      opacity: 0,
                      transition: "opacity 0.4s ease",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    {/* Icon */}
                    <Box
                      className="feature-icon"
                      sx={{
                        color: "#00CED1",
                        mb: 3,
                        transition: "all 0.4s ease",
                      }}
                    >
                      {feature.icon}
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "Orbitron",
                        fontWeight: 700,
                        fontSize: "1.3rem",
                        mb: 2,
                        color: "#FFFFFF",
                      }}
                    >
                      {feature.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#B2BAC2",
                        lineHeight: 1.7,
                        fontSize: "1rem",
                      }}
                    >
                      {feature.description}
                    </Typography>

                    {/* Decorative Corner */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 40,
                        height: 40,
                        borderTop: `2px solid ${feature.color}30`,
                        borderRight: `2px solid ${feature.color}30`,
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Box
            sx={{
              mt: 10,
              p: 6,
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(0,206,209,0.1) 0%, rgba(155,81,224,0.1) 100%)",
              border: "2px solid",
              borderColor: "transparent",
              borderImage: "linear-gradient(135deg, #00CED1, #9B51E0) 1",
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Orbitron",
                fontWeight: 700,
                mb: 2,
                color: "#FFFFFF",
              }}
            >
              Ready to Experience Epic Gaming?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#B2BAC2",
                fontSize: "1.2rem",
                mb: 3,
              }}
            >
              Visit us today and discover why we're Lebanon's favorite gaming
              lounge!
            </Typography>
            <Box
              component="a"
              href="https://maps.google.com/?q=Sawfar+badghan+main+road+near+habibi+cut"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: "#00CED1",
                fontWeight: 600,
                fontSize: "1.25rem",
                fontFamily: "Rajdhani",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  color: "#9B51E0",
                  transform: "translateY(-2px)",
                  "& .location-icon": {
                    transform: "scale(1.2)",
                  },
                },
              }}
            >
              <LocationOn
                className="location-icon"
                sx={{
                  fontSize: 28,
                  transition: "transform 0.3s ease",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "inherit",
                }}
              >
                Sawfar, badghan, main road, near 'habibi cut'
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Features;
