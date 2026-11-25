import React from "react";
import { alpha } from "@mui/material";
import type { PCStatus } from "@/services/api";
import { tokens } from "@theme/theme";
import { Cuboid } from "./Cuboid";
import { ROOM } from "./sceneSizes";
import { STATUS_META, stationLabel, statusColor } from "./statusMeta";

/* ------------------------------------------------------------------ */
/* A private PS5 room: glass walls, wall-mounted TV, console and couch. */
/* Sizes are logical px; the whole room is scaled to fit the floor.     */
/* ------------------------------------------------------------------ */

const WALL = 8;
const BACK_H = 76;
const SIDE_H = 40;
const TV = { w: 136, d: 4, h: 64, z: 26 };
const TABLE = { w: 124, d: 24, h: 14 };
const COUCH = { w: 156, seatD: 40, seatH: 13, backD: 10, backH: 20, y: 138 };

interface PSRoomProps {
  pc: PCStatus;
  x: number;
  y: number;
  scale: number;
  active: boolean;
  labelScale: number;
  onSelect: (pcNumber: string) => void;
  onHover: (pcNumber: string | null) => void;
  wasDragging: () => boolean;
}

const PSRoom3D: React.FC<PSRoomProps> = React.memo(
  ({ pc, x, y, scale, active, labelScale, onSelect, onHover, wasDragging }) => {
    const color = statusColor(pc.status);
    const occupied = pc.status === "occupied";
    const pulse = occupied ? "pcPulse 1.8s ease-in-out infinite" : undefined;
    const tableX = (ROOM.w - TABLE.w) / 2;
    const couchX = (ROOM.w - COUCH.w) / 2;
    const glass = "linear-gradient(180deg, rgba(190,200,255,0.10), rgba(190,200,255,0.03))";

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
        <div
          style={{
            position: "absolute",
            left: -ROOM.w / 2,
            top: -ROOM.d / 2,
            width: ROOM.w,
            height: ROOM.d,
            transformStyle: "preserve-3d",
            transform: `scale3d(${scale}, ${scale}, ${scale}) translateZ(${active ? 10 : 0}px)`,
            transition: "transform .4s cubic-bezier(.22,1,.36,1)",
          }}
        >
          {/* Status glow pooled under the room */}
          <div
            style={{
              position: "absolute",
              left: -30,
              top: -26,
              width: ROOM.w + 60,
              height: ROOM.d + 52,
              borderRadius: "50%",
              background: `radial-gradient(closest-side, ${alpha(color, active ? 0.55 : 0.32)}, transparent)`,
              animation: pulse,
              pointerEvents: "none",
            }}
          />

          {/* Carpet */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 8,
              transform: "translateZ(1px)",
              background: `linear-gradient(160deg, ${alpha(color, 0.12)}, rgba(255,255,255,0.025) 60%),
                repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 14px), #0d0d13`,
              boxShadow: active ? `inset 0 0 0 2px #fff, 0 0 30px ${alpha(color, 0.6)}` : `inset 0 0 0 1px ${alpha(color, 0.4)}`,
            }}
          />
          {/* Rug between TV and couch */}
          <div
            style={{
              position: "absolute",
              left: ROOM.w / 2 - 78,
              top: 70,
              width: 156,
              height: 62,
              borderRadius: "50%",
              transform: "translateZ(2px)",
              background: `radial-gradient(closest-side, ${alpha(tokens.purple, 0.32)}, ${alpha(tokens.purple, 0.08)} 70%, transparent)`,
            }}
          />

          {/* Back wall with an LED strip along the top */}
          <Cuboid
            x={0}
            y={0}
            w={ROOM.w}
            d={WALL}
            h={BACK_H}
            top="#1d1d27"
            front="linear-gradient(180deg, #17171f, #0e0e14)"
            side="#0b0b10"
            frontStyle={{ boxShadow: `inset 0 3px 0 ${alpha(color, 0.9)}, inset 0 14px 22px -12px ${alpha(color, 0.45)}` }}
          />
          {/* Glass side walls */}
          <Cuboid
            x={0}
            y={0}
            w={WALL}
            d={ROOM.d}
            h={SIDE_H}
            top={alpha(color, 0.6)}
            front="#121219"
            side={glass}
            back="#121219"
          />
          <Cuboid
            x={ROOM.w - WALL}
            y={0}
            w={WALL}
            d={ROOM.d}
            h={SIDE_H}
            top={alpha(color, 0.6)}
            front="#121219"
            side={glass}
            back="#121219"
          />

          {/* TV mounted on the back wall */}
          <Cuboid
            x={(ROOM.w - TV.w) / 2}
            y={WALL}
            z={TV.z}
            w={TV.w}
            d={TV.d}
            h={TV.h}
            top="#111116"
            side="#0b0b0f"
            back="#0b0b0f"
            front={`radial-gradient(ellipse at 30% 25%, ${alpha("#fff", 0.35)}, transparent 45%),
              linear-gradient(135deg, ${alpha(color, 0.95)} 0%, ${alpha(color, 0.5)} 55%, ${alpha(tokens.purple, 0.75)} 100%)`}
            frontStyle={{
              border: "3px solid #050507",
              borderRadius: 3,
              boxShadow: `0 0 ${active ? 36 : 24}px ${alpha(color, 0.7)}`,
              animation: pulse,
            }}
          />

          {/* TV table + PS5 */}
          <Cuboid
            x={tableX}
            y={WALL + 2}
            w={TABLE.w}
            d={TABLE.d}
            h={TABLE.h}
            top="#1e1e28"
            front="#15151c"
            side="#101016"
            frontStyle={{ boxShadow: `inset 0 -2px 0 ${alpha(color, 0.6)}` }}
          />
          <Cuboid
            x={tableX + TABLE.w - 24}
            y={WALL + 5}
            z={TABLE.h}
            w={10}
            d={18}
            h={26}
            top="#f3f5f9"
            side="#dde1e9"
            front="linear-gradient(90deg, #f6f8fb 0 28%, #121218 28% 72%, #f6f8fb 72%)"
            frontStyle={{ borderRadius: "5px 5px 1px 1px", boxShadow: "0 0 10px rgba(80,160,255,0.55)" }}
          />

          {/* Couch facing the TV */}
          <Cuboid
            x={couchX}
            y={COUCH.y}
            w={COUCH.w}
            d={COUCH.seatD}
            h={COUCH.seatH}
            top="#2c2647"
            front="#221d39"
            side="#1b172e"
            topStyle={{ borderRadius: 5 }}
          >
            {/* cushion seams + two controllers */}
            <div style={{ position: "absolute", left: "33.3%", top: 4, bottom: 4, width: 1, background: "rgba(0,0,0,0.35)" }} />
            <div style={{ position: "absolute", left: "66.6%", top: 4, bottom: 4, width: 1, background: "rgba(0,0,0,0.35)" }} />
            <div style={{ position: "absolute", left: 30, top: 12, width: 16, height: 10, borderRadius: 5, background: "#f1f3f8" }} />
            <div style={{ position: "absolute", left: 104, top: 14, width: 16, height: 10, borderRadius: 5, background: "#15151b", boxShadow: `0 0 6px ${alpha(color, 0.8)}` }} />
          </Cuboid>
          <Cuboid
            x={couchX}
            y={COUCH.y + COUCH.seatD - 4}
            z={COUCH.seatH}
            w={COUCH.w}
            d={COUCH.backD}
            h={COUCH.backH}
            top="#352e56"
            front="#25203d"
            side="#1b172e"
            back="#2b2547"
          />
          <Cuboid x={couchX - 9} y={COUCH.y - 2} w={10} d={COUCH.seatD + 8} h={COUCH.seatH + 9} top="#352e56" front="#25203d" side="#1e1a33" />
          <Cuboid
            x={couchX + COUCH.w - 1}
            y={COUCH.y - 2}
            w={10}
            d={COUCH.seatD + 8}
            h={COUCH.seatH + 9}
            top="#352e56"
            front="#25203d"
            side="#1e1a33"
          />
        </div>

        {/* Floating label that always faces the camera */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transformStyle: "preserve-3d",
            transform: `translateZ(${(BACK_H + 34) * scale + (active ? 10 : 0)}px) rotateZ(calc(var(--rot) * -1)) rotateX(calc(var(--tilt) * -1))`,
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
              padding: "3px 9px",
              borderRadius: 999,
              background: active ? "#fff" : "rgba(8,8,11,0.88)",
              border: `1px solid ${active ? "#fff" : alpha(color, 0.6)}`,
              color: active ? "#000" : "#fff",
              fontFamily: tokens.fontDisplay,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 18px rgba(0,0,0,0.6)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
            {stationLabel(pc)}
          </div>
        </div>
      </div>
    );
  }
);
PSRoom3D.displayName = "PSRoom3D";

export default PSRoom3D;
