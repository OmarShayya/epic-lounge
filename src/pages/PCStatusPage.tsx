import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  SportsEsports,
  CheckCircle,
  Cancel,
  Build,
  Refresh,
} from "@mui/icons-material";
import PCGrid3D from "@/components/gaming/PCGrid3D";
import { Button } from "@mui/material";
import { menuApi, PCStats, PCStatus } from "../services/api";

const PCStatusPage: React.FC = () => {
  const [pcs, setPcs] = useState<PCStatus[]>([]);
  const [stats, setStats] = useState<PCStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchPCStatus = async () => {
    try {
      setLoading(true);
      const data = await menuApi.getPCStatus();
      setPcs(data.pcs);
      setStats(data.stats);
      setError(null);
    } catch (err) {
      setError("Failed to load PC status. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPCStatus();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPCStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A1929 0%, #1a237e 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#00CED1" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Alert severity="error" sx={{ fontSize: "1.1rem" }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A1929 0%, #1a237e 100%)",
        py: { xs: 2, md: 8 },
      }}
    >
      {/* Animated Background Grid */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, #00CED1 2px, #00CED1 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, #9B51E0 2px, #9B51E0 4px)
          `,
          backgroundSize: "100px 100px",
          animation: "gridMove 20s linear infinite",
          "@keyframes gridMove": {
            "0%": { transform: "translate(0, 0)" },
            "100%": { transform: "translate(100px, 100px)" },
          },
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={{ xs: 3, md: 6 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: "center", mb: { xs: 2, md: 4 } }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 2,
                  mb: { xs: 1, md: 2 },
                }}
              >
                <SportsEsports
                  sx={{
                    fontSize: { xs: 40, md: 60 },
                    color: "#00CED1",
                    filter: "drop-shadow(0 0 20px rgba(0,206,209,0.8))",
                  }}
                />
              </Box>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "Orbitron",
                  fontWeight: 900,
                  background:
                    "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: { xs: 1, md: 2 },
                  fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem" },
                }}
              >
                PC AVAILABILITY
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#B2BAC2",
                  fontWeight: 400,
                  mb: { xs: 2, md: 3 },
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
                  px: 2,
                }}
              >
                Real-time status of our gaming stations
              </Typography>

              {/* Refresh Button */}
              {isMobile ? (
                <IconButton
                  onClick={fetchPCStatus}
                  sx={{
                    color: "#00CED1",
                    border: "2px solid #00CED1",
                    "&:hover": {
                      color: "#9B51E0",
                      borderColor: "#9B51E0",
                      background: "rgba(155,81,224,0.1)",
                    },
                  }}
                >
                  <Refresh />
                </IconButton>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchPCStatus}
                  sx={{
                    borderColor: "#00CED1",
                    color: "#00CED1",
                    fontFamily: "Orbitron",
                    "&:hover": {
                      borderColor: "#9B51E0",
                      color: "#9B51E0",
                      background: "rgba(155,81,224,0.1)",
                    },
                  }}
                >
                  Refresh Status
                </Button>
              )}
            </Box>
          </motion.div>

          {/* Stats Cards */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(0,206,209,0.2) 0%, rgba(0,206,209,0.05) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid rgba(0,206,209,0.3)",
                      boxShadow: "0 8px 32px rgba(0,206,209,0.2)",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        <CheckCircle
                          sx={{
                            fontSize: { xs: 30, sm: 35, md: 40 },
                            color: "#00CED1",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: "Orbitron",
                          fontWeight: 900,
                          color: "#00CED1",
                          fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                          textAlign: "center",
                        }}
                      >
                        {stats.available}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#B2BAC2",
                          textAlign: "center",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Available
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(255,64,129,0.2) 0%, rgba(255,64,129,0.05) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid rgba(255,64,129,0.3)",
                      boxShadow: "0 8px 32px rgba(255,64,129,0.2)",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        <Cancel
                          sx={{
                            fontSize: { xs: 30, sm: 35, md: 40 },
                            color: "#FF4081",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: "Orbitron",
                          fontWeight: 900,
                          color: "#FF4081",
                          fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                          textAlign: "center",
                        }}
                      >
                        {stats.occupied}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#B2BAC2",
                          textAlign: "center",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Occupied
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(255,167,38,0.2) 0%, rgba(255,167,38,0.05) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid rgba(255,167,38,0.3)",
                      boxShadow: "0 8px 32px rgba(255,167,38,0.2)",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        <Build
                          sx={{
                            fontSize: { xs: 30, sm: 35, md: 40 },
                            color: "#FFA726",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: "Orbitron",
                          fontWeight: 900,
                          color: "#FFA726",
                          fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                          textAlign: "center",
                        }}
                      >
                        {stats.maintenance}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#B2BAC2",
                          textAlign: "center",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Maintenance
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(155,81,224,0.2) 0%, rgba(155,81,224,0.05) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid rgba(155,81,224,0.3)",
                      boxShadow: "0 8px 32px rgba(155,81,224,0.2)",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        <SportsEsports
                          sx={{
                            fontSize: { xs: 30, sm: 35, md: 40 },
                            color: "#9B51E0",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: "Orbitron",
                          fontWeight: 900,
                          color: "#9B51E0",
                          fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                          textAlign: "center",
                        }}
                      >
                        {stats.total}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#B2BAC2",
                          textAlign: "center",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Total PCs
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* 3D PC Grid Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <PCGrid3D pcs={pcs} />
          </motion.div>

          {/* PC List View - Mobile Friendly */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Box sx={{ mt: { xs: 2, md: 4 } }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Orbitron",
                  fontWeight: 700,
                  color: "#00CED1",
                  mb: { xs: 2, md: 3 },
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.75rem" },
                }}
              >
                All Stations
              </Typography>
              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {pcs.map((pc) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={pc.pcNumber}>
                    <Card
                      sx={{
                        background: "rgba(10,25,41,0.6)",
                        backdropFilter: "blur(10px)",
                        border: `2px solid ${
                          pc.status === "available"
                            ? "#00CED1"
                            : pc.status === "occupied"
                            ? "#FF4081"
                            : "#FFA726"
                        }`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: `0 8px 32px ${
                            pc.status === "available"
                              ? "rgba(0,206,209,0.4)"
                              : pc.status === "occupied"
                              ? "rgba(255,64,129,0.4)"
                              : "rgba(255,167,38,0.4)"
                          }`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "Orbitron",
                            fontWeight: 700,
                            color:
                              pc.status === "available"
                                ? "#00CED1"
                                : pc.status === "occupied"
                                ? "#FF4081"
                                : "#FFA726",
                            mb: 1,
                            fontSize: {
                              xs: "1rem",
                              sm: "1.15rem",
                              md: "1.25rem",
                            },
                          }}
                        >
                          {pc.name}
                        </Typography>
                        <Chip
                          label={pc.status.toUpperCase()}
                          size="small"
                          sx={{
                            background:
                              pc.status === "available"
                                ? "rgba(0,206,209,0.2)"
                                : pc.status === "occupied"
                                ? "rgba(255,64,129,0.2)"
                                : "rgba(255,167,38,0.2)",
                            color:
                              pc.status === "available"
                                ? "#00CED1"
                                : pc.status === "occupied"
                                ? "#FF4081"
                                : "#FFA726",
                            fontFamily: "Orbitron",
                            fontWeight: 600,
                            fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          }}
                        />
                        {pc.location && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#B2BAC2",
                              display: "block",
                              mt: 1,
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                            }}
                          >
                            {pc.location}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default PCStatusPage;
