import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { EmojiEvents, People, Schedule, Star } from "@mui/icons-material";

const stats = [
  {
    icon: <EmojiEvents sx={{ fontSize: 50 }} />,
    value: "50+",
    label: "Tournaments Hosted",
    color: "#FFD700",
  },
  {
    icon: <People sx={{ fontSize: 50 }} />,
    value: "5000+",
    label: "Happy Gamers",
    color: "#00CED1",
  },
  {
    icon: <Schedule sx={{ fontSize: 50 }} />,
    value: "24/7",
    label: "Gaming Sessions",
    color: "#9B51E0",
  },
  {
    icon: <Star sx={{ fontSize: 50 }} />,
    value: "4.9",
    label: "Average Rating",
    color: "#FF6B9D",
  },
];

const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background:
          "linear-gradient(180deg, #0A1929 0%, #132F4C 50%, #0A1929 100%)",
        position: "relative",
      }}
    >
      <Container maxWidth="lg" ref={ref}>
        <Grid container spacing={8} alignItems="center">
          {/* Left Side - Story */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Stack spacing={3}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "Orbitron",
                    fontWeight: 800,
                    fontSize: { xs: "2rem", md: "3rem" },
                    background:
                      "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ABOUT EPIC LOUNGE
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#B2BAC2",
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                  }}
                >
                  Welcome to{" "}
                  <strong style={{ color: "#00CED1" }}>Epic Lounge</strong> -
                  Lebanon's premier gaming destination where passion meets
                  performance. Founded by gamers, for gamers, we've created the
                  ultimate space where competitive esports meets casual fun.
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#B2BAC2",
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                  }}
                >
                  Whether you're grinding ranks in{" "}
                  <strong style={{ color: "#9B51E0" }}>CS2</strong>, reliving
                  nostalgia with{" "}
                  <strong style={{ color: "#9B51E0" }}>CS 1.6 LAN</strong>,
                  battling in <strong style={{ color: "#9B51E0" }}>FIFA</strong>{" "}
                  on our private PS5 rooms, or just chilling with friends over
                  billiards and coffee - we've got you covered.
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#B2BAC2",
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                  }}
                >
                  With state-of-the-art equipment, lightning-fast internet, and
                  a vibrant community, Epic Lounge isn't just a gaming center -
                  it's a<strong style={{ color: "#00CED1" }}> lifestyle</strong>
                  .
                </Typography>

                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    background:
                      "linear-gradient(135deg, rgba(0,206,209,0.1) 0%, rgba(155,81,224,0.1) 100%)",
                    borderLeft: "4px solid #00CED1",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Orbitron",
                      color: "#00CED1",
                      mb: 1,
                      fontWeight: 700,
                    }}
                  >
                    Our Mission
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#B2BAC2",
                      fontSize: "1rem",
                      lineHeight: 1.7,
                    }}
                  >
                    To provide the best gaming experience in Lebanon by
                    combining premium equipment, comfortable spaces, and an
                    awesome community. We believe gaming is more than just a
                    hobby - it's a way to connect, compete, and create memories.
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          </Grid>

          {/* Right Side - Stats */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid size={{ xs: 6 }} key={index}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          background: "rgba(19, 47, 76, 0.6)",
                          backdropFilter: "blur(10px)",
                          border: `1px solid ${stat.color}30`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-10px)",
                            border: `1px solid ${stat.color}`,
                            boxShadow: `0 15px 40px ${stat.color}40`,
                            "& .stat-icon": {
                              transform: "scale(1.2) rotate(10deg)",
                              color: stat.color,
                            },
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          <Box
                            className="stat-icon"
                            sx={{
                              color: `${stat.color}80`,
                              mb: 2,
                              transition: "all 0.3s ease",
                            }}
                          >
                            {stat.icon}
                          </Box>

                          <Typography
                            variant="h3"
                            sx={{
                              fontFamily: "Orbitron",
                              fontWeight: 900,
                              fontSize: "2.5rem",
                              color: stat.color,
                              mb: 1,
                              textShadow: `0 0 20px ${stat.color}50`,
                            }}
                          >
                            {stat.value}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#B2BAC2",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: 1,
                            }}
                          >
                            {stat.label}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              {/* Achievement Badges */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Box
                  sx={{
                    mt: 4,
                    p: 4,
                    background:
                      "linear-gradient(135deg, rgba(155,81,224,0.15) 0%, rgba(0,206,209,0.15) 100%)",
                    borderRadius: 3,
                    border: "1px solid rgba(155,81,224,0.3)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Orbitron",
                      fontWeight: 700,
                      mb: 2,
                      color: "#FFFFFF",
                    }}
                  >
                    🏆 Achievements
                  </Typography>
                  <Stack spacing={1.5}>
                    <Typography
                      sx={{
                        color: "#B2BAC2",
                        fontSize: "1rem",
                      }}
                    >
                      ✅ Voted Best Gaming Lounge 2024
                    </Typography>
                    <Typography
                      sx={{
                        color: "#B2BAC2",
                        fontSize: "1rem",
                      }}
                    >
                      ✅ Official Partner of Local Esports Teams
                    </Typography>
                    <Typography
                      sx={{
                        color: "#B2BAC2",
                        fontSize: "1rem",
                      }}
                    >
                      ✅ Host of Regional CS & FIFA Tournaments
                    </Typography>
                    <Typography
                      sx={{
                        color: "#B2BAC2",
                        fontSize: "1rem",
                      }}
                    >
                      ✅ 99% Customer Satisfaction Rate
                    </Typography>
                  </Stack>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
