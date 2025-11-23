import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, useTheme, alpha, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { PC_LAYOUT } from "@/config/pcLayout";
import { PCStatus } from "@/services/api";

interface PCGrid3DProps {
  pcs: PCStatus[];
}

const PCGrid3D: React.FC<PCGrid3DProps> = ({ pcs }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPC, setHoveredPC] = useState<string | null>(null);
  const [clickedPC, setClickedPC] = useState<PCStatus | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const pcStatusMap = new Map<string, PCStatus>();
  pcs.forEach((pc) => {
    pcStatusMap.set(pc.pcNumber, pc);
    if (!pc.pcNumber.toUpperCase().startsWith("PC")) {
      pcStatusMap.set(`PC${pc.pcNumber}`, pc);
    }
    if (pc.pcNumber.toUpperCase().startsWith("PC")) {
      pcStatusMap.set(pc.pcNumber.substring(2), pc);
    }
  });

  const getPCStatus = (pcNumber: string): PCStatus | undefined => {
    let status = pcStatusMap.get(pcNumber);
    if (status) return status;

    status = pcStatusMap.get(`PC${pcNumber}`);
    if (status) return status;

    if (pcNumber.toUpperCase().startsWith("PC")) {
      status = pcStatusMap.get(pcNumber.substring(2));
      if (status) return status;
    }

    return undefined;
  };

  const drawMonitor = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
    glowColor: string,
    isHovered: boolean,
    rotation: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    const scale = isHovered ? 1.1 : 1;
    ctx.scale(scale, scale);

    const screenWidth = size * 1.2;
    const screenHeight = size * 0.8;
    const depth = size * 0.15;
    const baseHeight = size * 0.2;

    ctx.shadowBlur = isHovered ? 30 : 20;
    ctx.shadowColor = glowColor;

    ctx.fillStyle = alpha("#1a1a1a", 0.9);
    ctx.beginPath();
    ctx.ellipse(
      0,
      screenHeight / 2 + baseHeight,
      size * 0.4,
      size * 0.15,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = alpha("#2a2a2a", 0.9);
    ctx.fillRect(-size * 0.08, screenHeight / 2, size * 0.16, baseHeight);

    ctx.fillStyle = alpha("#1a1a1a", 0.8);
    ctx.beginPath();
    ctx.moveTo(-screenWidth / 2 - depth, -screenHeight / 2);
    ctx.lineTo(-screenWidth / 2, -screenHeight / 2 - depth);
    ctx.lineTo(screenWidth / 2, -screenHeight / 2 - depth);
    ctx.lineTo(screenWidth / 2 + depth, -screenHeight / 2);
    ctx.lineTo(screenWidth / 2 + depth, screenHeight / 2);
    ctx.lineTo(screenWidth / 2, screenHeight / 2 - depth);
    ctx.lineTo(-screenWidth / 2, screenHeight / 2 - depth);
    ctx.lineTo(-screenWidth / 2 - depth, screenHeight / 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = alpha("#0a0a0a", 0.95);
    ctx.beginPath();
    const radius = size * 0.08;
    ctx.roundRect(
      -screenWidth / 2,
      -screenHeight / 2,
      screenWidth,
      screenHeight,
      radius
    );
    ctx.fill();

    const gradient = ctx.createLinearGradient(
      -screenWidth / 2,
      -screenHeight / 2,
      screenWidth / 2,
      screenHeight / 2
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, alpha(color, 0.7));

    ctx.fillStyle = gradient;
    const screenPadding = size * 0.12;
    ctx.beginPath();
    ctx.roundRect(
      -screenWidth / 2 + screenPadding,
      -screenHeight / 2 + screenPadding,
      screenWidth - screenPadding * 2,
      screenHeight - screenPadding * 2,
      radius * 0.5
    );
    ctx.fill();

    const shine = ctx.createLinearGradient(
      -screenWidth / 2,
      -screenHeight / 2,
      -screenWidth / 4,
      -screenHeight / 4
    );
    shine.addColorStop(0, "rgba(255,255,255,0.3)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.roundRect(
      -screenWidth / 2 + screenPadding,
      -screenHeight / 2 + screenPadding,
      screenWidth * 0.3,
      screenHeight * 0.3,
      radius * 0.5
    );
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    let animationId: number;
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = alpha("#00CED1", 0.3);
      ctx.lineWidth = isMobile ? 2 : 3;
      ctx.beginPath();
      ctx.roundRect(
        canvas.width * 0.05,
        canvas.height * 0.05,
        canvas.width * 0.9,
        canvas.height * 0.9,
        20
      );
      ctx.stroke();

      const size = isSmallMobile ? 30 : isMobile ? 40 : 60;

      PC_LAYOUT.forEach((layout) => {
        const pcStatus = getPCStatus(layout.pcNumber);
        if (!pcStatus) return;

        const x = (canvas.width * layout.x) / 100;
        const y = (canvas.height * layout.y) / 100;

        let color = "#00CED1";
        let glowColor = "rgba(0,206,209,0.8)";

        if (pcStatus.status === "occupied") {
          color = "#FF4081";
          glowColor = "rgba(255,64,129,0.8)";
        } else if (pcStatus.status === "maintenance") {
          color = "#FFA726";
          glowColor = "rgba(255,167,38,0.8)";
        }

        const isHovered = hoveredPC === pcStatus.pcNumber;

        drawMonitor(
          ctx,
          x,
          y,
          size,
          color,
          glowColor,
          isHovered,
          layout.rotation
        );

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((layout.rotation * Math.PI) / 180);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#0A1929";
        ctx.font = `bold ${isMobile ? 10 : 14}px Orbitron`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pcStatus.pcNumber, 0, 0);
        ctx.restore();

        if (pcStatus.status === "occupied") {
          const pulse = Math.sin(Date.now() / 500) * 0.3 + 0.7;
          ctx.strokeStyle = color;
          ctx.lineWidth = isMobile ? 2 : 3;
          ctx.globalAlpha = pulse;
          ctx.beginPath();
          ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let foundPC: string | null = null;
      const size = isSmallMobile ? 30 : isMobile ? 40 : 60;

      PC_LAYOUT.forEach((layout) => {
        const x = (canvas.width * layout.x) / 100;
        const y = (canvas.height * layout.y) / 100;

        const distance = Math.sqrt(
          Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2)
        );

        if (distance < size) {
          const pcStatus = getPCStatus(layout.pcNumber);
          if (pcStatus) {
            foundPC = pcStatus.pcNumber;
          }
        }
      });

      setHoveredPC(foundPC);
      canvas.style.cursor = foundPC ? "pointer" : "default";
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const size = isSmallMobile ? 30 : isMobile ? 40 : 60;

      PC_LAYOUT.forEach((layout) => {
        const x = (canvas.width * layout.x) / 100;
        const y = (canvas.height * layout.y) / 100;

        const distance = Math.sqrt(
          Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2)
        );

        if (distance < size) {
          const pcStatus = getPCStatus(layout.pcNumber);
          if (pcStatus) {
            setClickedPC(pcStatus);
          }
        }
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", updateSize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [pcs, hoveredPC, pcStatusMap, isMobile, isSmallMobile]);

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "400px", sm: "500px", md: "600px" },
          borderRadius: 3,
          overflow: "hidden",
          background: alpha(theme.palette.background.paper, 0.3),
          backdropFilter: "blur(10px)",
          border: `2px solid ${alpha("#00CED1", 0.2)}`,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 10, md: 20 },
            right: { xs: 10, md: 20 },
            background: alpha("#0A1929", 0.9),
            backdropFilter: "blur(10px)",
            p: { xs: 1, sm: 1.5, md: 2 },
            borderRadius: 2,
            border: `1px solid ${alpha("#00CED1", 0.3)}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1, md: 1.5 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, md: 1.5 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 16, sm: 20, md: 24 },
                  height: { xs: 16, sm: 20, md: 24 },
                  borderRadius: 1,
                  background: "#00CED1",
                  boxShadow: "0 0 15px rgba(0,206,209,0.8)",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#B2BAC2",
                  fontFamily: "Orbitron",
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                }}
              >
                Available
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, md: 1.5 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 16, sm: 20, md: 24 },
                  height: { xs: 16, sm: 20, md: 24 },
                  borderRadius: 1,
                  background: "#FF4081",
                  boxShadow: "0 0 15px rgba(255,64,129,0.8)",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#B2BAC2",
                  fontFamily: "Orbitron",
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                }}
              >
                Occupied
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, md: 1.5 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 16, sm: 20, md: 24 },
                  height: { xs: 16, sm: 20, md: 24 },
                  borderRadius: 1,
                  background: "#FFA726",
                  boxShadow: "0 0 15px rgba(255,167,38,0.8)",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#B2BAC2",
                  fontFamily: "Orbitron",
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                }}
              >
                Maintenance
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <AnimatePresence>
        {clickedPC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box
              onClick={() => setClickedPC(null)}
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Box
                  sx={{
                    background:
                      "linear-gradient(135deg, #0A1929 0%, #132F4C 100%)",
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    border: `2px solid ${
                      clickedPC.status === "available"
                        ? "#00CED1"
                        : clickedPC.status === "occupied"
                        ? "#FF4081"
                        : "#FFA726"
                    }`,
                    boxShadow: `0 20px 60px ${
                      clickedPC.status === "available"
                        ? "rgba(0,206,209,0.4)"
                        : clickedPC.status === "occupied"
                        ? "rgba(255,64,129,0.4)"
                        : "rgba(255,167,38,0.4)"
                    }`,
                    minWidth: { xs: 280, sm: 300 },
                    mx: 2,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "Orbitron",
                      fontWeight: 900,
                      color:
                        clickedPC.status === "available"
                          ? "#00CED1"
                          : clickedPC.status === "occupied"
                          ? "#FF4081"
                          : "#FFA726",
                      mb: 2,
                      fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                  >
                    {clickedPC.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#B2BAC2",
                      mb: 1,
                      fontSize: { xs: "1rem", md: "1.25rem" },
                    }}
                  >
                    Status:{" "}
                    <Box
                      component="span"
                      sx={{
                        color:
                          clickedPC.status === "available"
                            ? "#00CED1"
                            : clickedPC.status === "occupied"
                            ? "#FF4081"
                            : "#FFA726",
                        fontFamily: "Orbitron",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {clickedPC.status}
                    </Box>
                  </Typography>
                  {clickedPC.location && (
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#B2BAC2",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      Location: {clickedPC.location}
                    </Typography>
                  )}
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default PCGrid3D;
