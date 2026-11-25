import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, alpha } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ThreeSixty, TouchApp } from "@mui/icons-material";
import { PC_LAYOUT } from "@/config/pcLayout";
import type { PCStatus, StationType } from "@/services/api";
import { tokens } from "@theme/theme";
import { Cuboid } from "./Cuboid";
import PSRoom3D from "./PSRoom3D";
import { ROOM } from "./sceneSizes";
import { STATUS_META, normalizePcNumber, reservationBadge, shortPcLabel, stationLabel, statusColor } from "./statusMeta";

/* ------------------------------------------------------------------ */
/* Scene constants (logical px, the whole scene is scaled to fit)      */
/* ------------------------------------------------------------------ */

const FLOOR_W = 900;
const FLOOR_H = 500;
const SLAB = 18; // floor thickness
const TILT = 56; // rotateX of the floor
const BASE_ROT = -24; // resting rotateZ
const MAX_ORBIT = 50; // how far the user can drag around

const DESK = { w: 84, d: 52, h: 20 };
const MONITOR = { w: 62, d: 5, h: 36, y: 8, lift: 6 };
const CHAIR = { w: 30, d: 24, h: 14, gap: 8 };

/* ------------------------------------------------------------------ */
/* One gaming station: desk + monitor + chair + glow + floating label   */
/* ------------------------------------------------------------------ */

interface StationProps {
  pc: PCStatus;
  x: number;
  y: number;
  rotation: number;
  active: boolean;
  labelScale: number;
  onSelect: (pcNumber: string) => void;
  onHover: (pcNumber: string | null) => void;
  wasDragging: () => boolean;
}

const Station: React.FC<StationProps> = React.memo(
  ({ pc, x, y, rotation, active, labelScale, onSelect, onHover, wasDragging }) => {
    const color = statusColor(pc.status);
    const occupied = pc.status === "occupied";
    const pulse = occupied ? "pcPulse 1.8s ease-in-out infinite" : undefined;
    const labelZ = DESK.h + MONITOR.lift + MONITOR.h + 24;

    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={`${pc.name}: ${STATUS_META[pc.status]?.label ?? pc.status}`}
        onPointerEnter={(e) => e.pointerType === "mouse" && onHover(pc.pcNumber)}
        onPointerLeave={(e) => e.pointerType === "mouse" && onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          if (!wasDragging()) onSelect(pc.pcNumber);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(pc.pcNumber);
          }
        }}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: 0,
          height: 0,
          transformStyle: "preserve-3d",
          outline: "none",
          pointerEvents: "auto",
          cursor: "pointer",
        }}
      >
        {/* Desk group (can be rotated per layout) */}
        <div
          style={{
            position: "absolute",
            left: -DESK.w / 2,
            top: -DESK.d / 2,
            width: DESK.w,
            height: DESK.d + CHAIR.gap + CHAIR.d,
            transformStyle: "preserve-3d",
            transform: `rotateZ(${rotation}deg) translateZ(${active ? 10 : 0}px)`,
            transition: "transform .4s cubic-bezier(.22,1,.36,1)",
          }}
        >
          {/* Status glow pooled on the floor */}
          <div
            style={{
              position: "absolute",
              left: -26,
              top: -22,
              width: DESK.w + 52,
              height: DESK.d + 44,
              borderRadius: "50%",
              background: `radial-gradient(closest-side, ${alpha(color, active ? 0.75 : 0.5)}, transparent)`,
              transform: "translateZ(1px)",
              animation: pulse,
              pointerEvents: "none",
            }}
          />

          {/* Desk */}
          <Cuboid
            x={0}
            y={0}
            w={DESK.w}
            d={DESK.d}
            h={DESK.h}
            top="#18181f"
            front="#0e0e13"
            side="#0a0a0e"
            topStyle={{
              borderRadius: 3,
              boxShadow: active
                ? `inset 0 0 0 2px #fff, 0 0 26px ${alpha(color, 0.8)}`
                : `inset 0 0 0 1px ${alpha(color, 0.45)}`,
            }}
            frontStyle={{ boxShadow: `inset 0 -3px 0 ${color}` }}
          >
            {/* keyboard + mouse */}
            <div
              style={{
                position: "absolute",
                left: DESK.w / 2 - 20,
                bottom: 8,
                width: 34,
                height: 9,
                borderRadius: 2,
                background: "rgba(255,255,255,0.09)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: DESK.w / 2 + 18,
                bottom: 9,
                width: 6,
                height: 8,
                borderRadius: 3,
                background: "rgba(255,255,255,0.12)",
              }}
            />
          </Cuboid>

          {/* Monitor stand + monitor */}
          <Cuboid
            x={DESK.w / 2 - 4}
            y={MONITOR.y}
            z={DESK.h}
            w={8}
            d={6}
            h={MONITOR.lift}
            top="#222"
            front="#1a1a1f"
            side="#141418"
          />
          <Cuboid
            x={(DESK.w - MONITOR.w) / 2}
            y={MONITOR.y}
            z={DESK.h + MONITOR.lift}
            w={MONITOR.w}
            d={MONITOR.d}
            h={MONITOR.h}
            top="#1c1c22"
            side="#121217"
            back="#121217"
            front={`linear-gradient(180deg, ${alpha(color, 0.95)} 0%, ${alpha(color, 0.55)} 100%)`}
            frontStyle={{
              border: "2px solid #08080b",
              borderRadius: 3,
              boxShadow: `0 0 ${active ? 34 : 22}px ${alpha(color, 0.75)}`,
              animation: pulse,
            }}
          />

          {/* Chair */}
          <Cuboid
            x={(DESK.w - CHAIR.w) / 2}
            y={DESK.d + CHAIR.gap}
            w={CHAIR.w}
            d={CHAIR.d}
            h={CHAIR.h}
            top="#1d1d25"
            front="#121218"
            side="#0e0e13"
            topStyle={{ borderRadius: 6 }}
          />
          <Cuboid
            x={(DESK.w - CHAIR.w) / 2}
            y={DESK.d + CHAIR.gap + CHAIR.d - 5}
            z={CHAIR.h}
            w={CHAIR.w}
            d={5}
            h={22}
            top="#23232c"
            front="#16161d"
            side="#101015"
            back={alpha(color, 0.35)}
          />
        </div>

        {/* Floating label that always faces the camera */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transformStyle: "preserve-3d",
            transform: `translateZ(${labelZ + (active ? 10 : 0)}px) rotateZ(calc(var(--rot) * -1)) rotateX(calc(var(--tilt) * -1))`,
            transition: "transform .4s cubic-bezier(.22,1,.36,1)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              transform: `translate(-50%, -100%) scale(${labelScale})`,
              transformOrigin: "50% 100%",
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 8px",
              borderRadius: 999,
              background: active ? "#fff" : "rgba(8,8,11,0.88)",
              border: `1px solid ${active ? "#fff" : alpha(color, 0.6)}`,
              color: active ? "#000" : "#fff",
              fontFamily: tokens.fontDisplay,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              boxShadow: `0 4px 18px rgba(0,0,0,0.6)`,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
            {shortPcLabel(pc.pcNumber)}
          </div>
        </div>
      </div>
    );
  }
);
Station.displayName = "Station";

/* ------------------------------------------------------------------ */
/* Floor map                                                           */
/* ------------------------------------------------------------------ */

interface PCGrid3DProps {
  pcs: PCStatus[];
  /** "pc" draws the PC floor; "playstation" draws the private PS5 rooms. */
  variant?: StationType;
  selectedId: string | null;
  /** Called with the tapped station (opens booking), or null when the empty floor is tapped. */
  onSelect: (pcNumber: string | null) => void;
}

/** Lays PS5 rooms out in one row (up to 3) or two rows, and scales them to fit the floor. */
const placeRooms = (rooms: PCStatus[]) => {
  const n = rooms.length;
  const rows = n <= 3 ? 1 : 2;
  const cols = Math.max(1, Math.ceil(n / rows));
  const scale = Math.min(1.35, (FLOOR_W / cols - 36) / ROOM.w, (FLOOR_H / rows - 44) / ROOM.d);
  return rooms.map((pc, i) => {
    const row = Math.floor(i / cols);
    const inRow = Math.min(cols, n - row * cols);
    return {
      pc,
      x: (((i % cols) + 0.5) / inRow) * 100,
      y: rows === 1 ? 50 : row === 0 ? 27 : 74,
      rotation: 0,
      scale,
    };
  });
};

const PCGrid3D: React.FC<PCGrid3DProps> = ({ pcs, variant = "pc", selectedId, onSelect }) => {
  const isRooms = variant === "playstation";
  const containerRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);
  const [compact, setCompact] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Orbit state lives in refs so dragging never re-renders React
  const orbit = useRef(0); // user drag offset (deg)
  const tiltOffset = useRef(0); // mouse parallax (deg)
  const drag = useRef<{ x: number; start: number; moved: boolean } | null>(null);
  const justDragged = useRef(false);

  /* Place PCs: configured layout first, then any unknown PCs in middle rows */
  const placed = useMemo(() => {
    if (isRooms) return placeRooms(pcs);
    const byKey = new Map(pcs.map((pc) => [normalizePcNumber(pc.pcNumber), pc]));
    const used = new Set<string>();
    const items: { pc: PCStatus; x: number; y: number; rotation: number }[] = [];

    PC_LAYOUT.forEach((slot) => {
      const key = normalizePcNumber(slot.pcNumber);
      const pc = byKey.get(key);
      if (pc && !used.has(key)) {
        used.add(key);
        items.push({ pc, x: slot.x, y: slot.y, rotation: slot.rotation });
      }
    });

    const extras = pcs.filter((pc) => !used.has(normalizePcNumber(pc.pcNumber)));
    const perRow = 6;
    extras.forEach((pc, i) => {
      const row = Math.floor(i / perRow);
      const inRow = Math.min(perRow, extras.length - row * perRow);
      items.push({
        pc,
        x: (((i % perRow) + 1) / (inRow + 1)) * 100,
        y: 38 + row * 18,
        rotation: 0,
      });
    });
    return items.map((item) => ({ ...item, scale: 1 }));
  }, [pcs, isRooms]);

  /* Fit the scene to the container */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.max(0.28, Math.min(1.05, width / 1060, height / 700)));
      setCompact(width < 600);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Animation loop: eases rotation towards target, adds a gentle idle sway */
  useEffect(() => {
    const floor = floorRef.current;
    const container = containerRef.current;
    if (!floor || !container) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let visible = true;
    let last = performance.now();
    let swayTime = 0;
    let rot = BASE_ROT;
    let tilt = TILT;

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (!drag.current && !reduceMotion) swayTime += dt;
      const sway = reduceMotion ? 0 : Math.sin(swayTime / 2800) * 6;
      const targetRot = BASE_ROT + orbit.current + sway;
      const targetTilt = TILT + tiltOffset.current;
      rot += (targetRot - rot) * 0.12;
      tilt += (targetTilt - tilt) * 0.1;
      floor.style.setProperty("--rot", `${rot.toFixed(3)}deg`);
      floor.style.setProperty("--tilt", `${tilt.toFixed(3)}deg`);
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(container);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, start: orbit.current, moved: false };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    if (e.pointerType === "mouse" && !drag.current) {
      const r = el.getBoundingClientRect();
      tiltOffset.current = ((e.clientY - r.top) / r.height - 0.5) * -8;
    }
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (!drag.current.moved && Math.abs(dx) > 6) {
      drag.current.moved = true;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    }
    if (drag.current.moved) {
      orbit.current = Math.max(-MAX_ORBIT, Math.min(MAX_ORBIT, drag.current.start + dx * 0.3));
    }
  };

  const endDrag = () => {
    justDragged.current = !!drag.current?.moved;
    drag.current = null;
    // Clear after the click that follows this pointerup has been handled
    window.setTimeout(() => (justDragged.current = false), 0);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") tiltOffset.current = 0;
  };

  const wasDragging = React.useCallback(() => justDragged.current, []);
  const handleSelect = React.useCallback((id: string) => onSelect(id), [onSelect]);
  const handleHover = React.useCallback((id: string | null) => setHoveredId(id), []);

  const activeId = hoveredId ?? selectedId;
  const activePc = placed.find((p) => p.pc.pcNumber === activeId)?.pc ?? null;
  const labelScale = Math.min(2.6, Math.max(1, 0.85 / scale));

  return (
    <Box
      ref={containerRef}
      data-cursor="Rotate"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={handlePointerLeave}
      onClick={() => {
        if (!justDragged.current) onSelect(null);
      }}
      sx={{
        position: "relative",
        height: { xs: 330, sm: 460, md: 600 },
        borderRadius: { xs: 4, md: 6 },
        border: `1px solid ${tokens.border}`,
        overflow: "hidden",
        touchAction: "pan-y",
        userSelect: "none",
        WebkitUserSelect: "none",
        perspective: "1500px",
        perspectiveOrigin: "50% 30%",
        background: `radial-gradient(ellipse 70% 60% at 50% 45%, ${alpha(tokens.cyan, 0.08)}, transparent 70%),
          radial-gradient(ellipse 50% 40% at 85% 100%, ${alpha(tokens.purple, 0.1)}, transparent 70%),
          #050507`,
        "@keyframes pcPulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.45 },
        },
      }}
    >
      {/* Scaler: keeps the logical scene size constant and fits it to the box */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: compact ? "55%" : "49%",
          width: FLOOR_W,
          height: FLOOR_H,
          marginLeft: -FLOOR_W / 2,
          marginTop: -FLOOR_H / 2,
          transform: `scale(${scale})`,
          transformStyle: "preserve-3d",
          // The flat scaler/floor planes must not swallow hits meant for the stations
          pointerEvents: "none",
        }}
      >
        <div
          ref={floorRef}
          style={
            {
              "--rot": `${BASE_ROT}deg`,
              "--tilt": `${TILT}deg`,
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
              transform: "rotateX(var(--tilt)) rotateZ(var(--rot))",
              borderRadius: 28,
              background: `
                linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px) 0 0 / 30px 30px,
                linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px) 0 0 / 30px 30px,
                radial-gradient(ellipse at 50% 50%, #121218 0%, #09090c 75%)`,
              boxShadow: `inset 0 0 0 1px ${alpha(tokens.cyan, 0.35)}, inset 0 0 80px ${alpha(tokens.cyan, 0.08)}`,
            } as React.CSSProperties
          }
        >
          {/* Slab edges (thickness below the floor) */}
          <div
            style={{
              position: "absolute",
              left: 14,
              top: FLOOR_H,
              width: FLOOR_W - 28,
              height: SLAB,
              transformOrigin: "top",
              transform: "rotateX(-90deg)",
              background: `linear-gradient(180deg, ${alpha(tokens.cyan, 0.35)}, #050507 70%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 14,
              top: -SLAB,
              width: FLOOR_W - 28,
              height: SLAB,
              transformOrigin: "bottom",
              transform: "rotateX(90deg)",
              background: "#050507",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -SLAB,
              top: 14,
              width: SLAB,
              height: FLOOR_H - 28,
              transformOrigin: "right",
              transform: "rotateY(90deg)",
              background: `linear-gradient(270deg, ${alpha(tokens.cyan, 0.25)}, #050507 70%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: FLOOR_W,
              top: 14,
              width: SLAB,
              height: FLOOR_H - 28,
              transformOrigin: "left",
              transform: "rotateY(-90deg)",
              background: `linear-gradient(90deg, ${alpha(tokens.cyan, 0.25)}, #050507 70%)`,
            }}
          />

          {/* Floor markings */}
          {!isRooms && (
            <div
              style={{
                position: "absolute",
                left: "8%",
                right: "8%",
                top: "50%",
                height: 0,
                borderTop: `2px dashed ${alpha(tokens.cyan, 0.18)}`,
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: isRooms ? "flex-end" : "center",
              justifyContent: "center",
              paddingBottom: isRooms ? 14 : 0,
              fontFamily: tokens.fontDisplay,
              fontWeight: 900,
              fontSize: isRooms ? 34 : 64,
              letterSpacing: "0.18em",
              color: isRooms ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.045)",
              pointerEvents: "none",
              transform: "translateY(-2px)",
            }}
          >
            {isRooms ? "PS5 ROOMS" : "EPIC LOUNGE"}
          </div>

          {placed.map(({ pc, x, y, rotation, scale: roomScale }) =>
            isRooms ? (
              <PSRoom3D
                key={pc.pcNumber}
                pc={pc}
                x={x}
                y={y}
                scale={roomScale}
                active={pc.pcNumber === activeId}
                labelScale={labelScale}
                onSelect={handleSelect}
                onHover={handleHover}
                wasDragging={wasDragging}
              />
            ) : (
              <Station
                key={pc.pcNumber}
                pc={pc}
                x={x}
                y={y}
                rotation={rotation}
                active={pc.pcNumber === activeId}
                labelScale={labelScale}
                onSelect={handleSelect}
                onHover={handleHover}
                wasDragging={wasDragging}
              />
            )
          )}
        </div>
      </div>

      {/* Legend */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 10, md: 16 },
          left: { xs: 10, md: 16 },
          display: "flex",
          gap: { xs: 0.5, md: 0.75 },
          flexWrap: "wrap",
          pointerEvents: "none",
        }}
      >
        {Object.values(STATUS_META).map((meta) => (
          <Box
            key={meta.label}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: { xs: 1, md: 1.25 },
              py: 0.5,
              borderRadius: 999,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${tokens.border}`,
              fontSize: { xs: "0.7rem", md: "0.78rem" },
              color: tokens.textMuted,
              fontWeight: 600,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: meta.color,
                boxShadow: `0 0 8px ${meta.color}`,
              }}
            />
            {meta.label}
          </Box>
        ))}
      </Box>

      {/* Hint */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 10, md: 16 },
          right: { xs: 10, md: 16 },
          display: { xs: "none", sm: "inline-flex" },
          alignItems: "center",
          gap: 0.75,
          color: tokens.textDim,
          fontSize: "0.78rem",
          fontWeight: 600,
          pointerEvents: "none",
        }}
      >
        <ThreeSixty sx={{ fontSize: 18 }} />
        Drag to rotate
      </Box>

      {/* Info panel */}
      <Box
        sx={{
          position: "absolute",
          left: { xs: 10, md: 16 },
          right: { xs: 10, md: "auto" },
          bottom: { xs: 10, md: 16 },
          pointerEvents: "none",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {activePc ? (
            <motion.div
              key={activePc.pcNumber}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.22 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  minWidth: { md: 280 },
                  px: 2,
                  py: 1.5,
                  borderRadius: 3,
                  background: "rgba(10,10,14,0.85)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${alpha(statusColor(activePc.status), 0.5)}`,
                  boxShadow: `0 10px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4)`,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: tokens.fontDisplay,
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    color: "#000",
                    background: statusColor(activePc.status),
                    boxShadow: `0 0 20px ${alpha(statusColor(activePc.status), 0.5)}`,
                  }}
                >
                  {stationLabel(activePc)}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: tokens.fontDisplay,
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      lineHeight: 1.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {activePc.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.82rem", color: tokens.textMuted, lineHeight: 1.4 }}>
                    <Box component="span" sx={{ color: statusColor(activePc.status), fontWeight: 700 }}>
                      {STATUS_META[activePc.status]?.label ?? activePc.status}
                    </Box>
                    {activePc.location ? ` · ${activePc.location}` : ""}
                  </Typography>
                  {reservationBadge(activePc) && (
                    <Typography sx={{ fontSize: "0.78rem", color: tokens.purpleBright, fontWeight: 600, lineHeight: 1.4 }}>
                      {reservationBadge(activePc)}
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: "0.76rem", color: tokens.cyan, fontWeight: 700, lineHeight: 1.5 }}>
                    {activePc.status === "maintenance" ? "Not bookable right now" : "Click to book a time →"}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 999,
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${tokens.border}`,
                  color: tokens.textMuted,
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                  fontWeight: 600,
                }}
              >
                <TouchApp sx={{ fontSize: 16 }} />
                <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                  Tap a {isRooms ? "room" : "PC"} to book · swipe to rotate
                </Box>
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Click any {isRooms ? "room" : "PC"} to book it
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default PCGrid3D;
