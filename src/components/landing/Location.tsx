import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Directions,
} from "@mui/icons-material";
import { CONTACT_INFO, OPENING_HOURS } from "@utils/constants";

const Location: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleGetDirections = () => {
    window.open(
      "https://maps.google.com/?q=Sawfar+badghan+main+road+near+habibi+cut",
      "_blank"
    );
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: "#0A1929",
        position: "relative",
      }}
    >
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
              }}
            >
              VISIT US
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#B2BAC2",
                maxWidth: "700px",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
              }}
            >
              Find us in Sawfar, badghan
            </Typography>
          </Stack>
        </motion.div>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Stack spacing={3}>
                {/* Address */}
                <Card
                  sx={{
                    background: "rgba(19, 47, 76, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(0,206,209,0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      border: "1px solid rgba(0,206,209,0.8)",
                      boxShadow: "0 10px 30px rgba(0,206,209,0.3)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          color: "#00CED1",
                          mt: 0.5,
                        }}
                      >
                        <LocationOn sx={{ fontSize: 30 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "Orbitron",
                            fontWeight: 700,
                            color: "#00CED1",
                            mb: 1,
                          }}
                        >
                          Address
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#B2BAC2",
                            lineHeight: 1.7,
                          }}
                        >
                          {CONTACT_INFO.address}
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<Directions />}
                          onClick={handleGetDirections}
                          sx={{
                            mt: 2,
                            color: "#00CED1",
                            borderColor: "#00CED1",
                            "&:hover": {
                              borderColor: "#9B51E0",
                              color: "#9B51E0",
                              background: "rgba(155,81,224,0.1)",
                            },
                          }}
                        >
                          Get Directions
                        </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Phone */}
                <Card
                  sx={{
                    background: "rgba(19, 47, 76, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(155,81,224,0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      border: "1px solid rgba(155,81,224,0.8)",
                      boxShadow: "0 10px 30px rgba(155,81,224,0.3)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ color: "#9B51E0" }}>
                        <Phone sx={{ fontSize: 30 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "Orbitron",
                            fontWeight: 700,
                            color: "#9B51E0",
                            mb: 0.5,
                          }}
                        >
                          Call Us
                        </Typography>
                        <Typography
                          component="a"
                          href={`tel:${CONTACT_INFO.phone}`}
                          sx={{
                            color: "#B2BAC2",
                            fontSize: "1.1rem",
                            textDecoration: "none",
                            "&:hover": {
                              color: "#9B51E0",
                            },
                          }}
                        >
                          {CONTACT_INFO.phone}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card
                  sx={{
                    background: "rgba(19, 47, 76, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(0,255,136,0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      border: "1px solid rgba(0,255,136,0.8)",
                      boxShadow: "0 10px 30px rgba(0,255,136,0.3)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ color: "#00FF88" }}>
                        <Email sx={{ fontSize: 30 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "Orbitron",
                            fontWeight: 700,
                            color: "#00FF88",
                            mb: 0.5,
                          }}
                        >
                          Email
                        </Typography>
                        <Typography
                          component="a"
                          href={`mailto:${CONTACT_INFO.email}`}
                          sx={{
                            color: "#B2BAC2",
                            fontSize: "1.1rem",
                            textDecoration: "none",
                            "&:hover": {
                              color: "#00FF88",
                            },
                          }}
                        >
                          {CONTACT_INFO.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </motion.div>
          </Grid>

          {/* Opening Hours */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card
                sx={{
                  height: "100%",
                  background:
                    "linear-gradient(135deg, rgba(0,206,209,0.1) 0%, rgba(155,81,224,0.1) 100%)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid",
                  borderImage: "linear-gradient(135deg, #00CED1, #9B51E0) 1",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <AccessTime
                        sx={{
                          fontSize: 60,
                          color: "#00CED1",
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "Orbitron",
                          fontWeight: 700,
                          color: "#FFFFFF",
                          mb: 1,
                        }}
                      >
                        Opening Hours
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#B2BAC2",
                          fontSize: "1rem",
                        }}
                      >
                        We're open for your gaming pleasure!
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                      {OPENING_HOURS.map((schedule, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            mb: 2,
                            background: "rgba(19, 47, 76, 0.5)",
                            borderRadius: 2,
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#FFFFFF",
                              fontWeight: 600,
                              fontSize: "1.1rem",
                            }}
                          >
                            {schedule.day}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#00CED1",
                              fontWeight: 700,
                              fontSize: "1.1rem",
                              fontFamily: "Orbitron",
                            }}
                          >
                            {schedule.hours}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box
                      sx={{
                        mt: 3,
                        p: 3,
                        background: "rgba(0,206,209,0.1)",
                        borderRadius: 2,
                        border: "1px solid rgba(0,206,209,0.3)",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#00CED1",
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        🎮 Walk-ins Welcome!
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#B2BAC2",
                        }}
                      >
                        No reservation needed. Just show up and game!
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Location;
