import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { Box, type SxProps, type Theme } from "@mui/material";
import { tokens } from "@theme/theme";

interface TiltCardProps {
  children: React.ReactNode;
  /** Max rotation in degrees. */
  max?: number;
  /** Colour of the glare/glow that follows the pointer. */
  glow?: string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A card that tilts in 3D towards the pointer, with a soft light that follows it.
 * On touch devices it renders as a normal card.
 */
const TiltCard: React.FC<TiltCardProps> = ({ children, max = 10, glow = tokens.cyan, sx, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, ${glow}22, transparent 55%)`;

  const handleMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current || !canHover()) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <Box sx={{ perspective: "900px", height: "100%" }}>
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onClick={onClick}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", height: "100%" }}
      >
        <Box
          sx={{
            position: "relative",
            height: "100%",
            borderRadius: 4,
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            overflow: "hidden",
            transition: "border-color .3s ease",
            "&:hover": { borderColor: tokens.borderStrong },
            "&:hover .tilt-glare": { opacity: 1 },
            ...sx,
          }}
        >
          <motion.div
            className="tilt-glare"
            style={{
              background: glare,
              position: "absolute",
              inset: 0,
              opacity: 0,
              transition: "opacity .3s ease",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1, height: "100%", transform: "translateZ(30px)" }}>
            {children}
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default TiltCard;
