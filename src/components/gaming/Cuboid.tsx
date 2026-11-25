import React from "react";

/* ------------------------------------------------------------------ */
/* A box built from five faces (no bottom), in its parent's 3D space.   */
/* ------------------------------------------------------------------ */

export interface CuboidProps {
  x: number;
  y: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  top: string;
  front: string;
  side: string;
  back?: string;
  topStyle?: React.CSSProperties;
  frontStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

const face: React.CSSProperties = { position: "absolute", backfaceVisibility: "visible" };

export const Cuboid: React.FC<CuboidProps> = ({
  x,
  y,
  z = 0,
  w,
  d,
  h,
  top,
  front,
  side,
  back = side,
  topStyle,
  frontStyle,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: d,
      transformStyle: "preserve-3d",
      transform: `translateZ(${z}px)`,
    }}
  >
    {/* back */}
    <div
      style={{ ...face, left: 0, top: 0, width: w, height: h, background: back, transformOrigin: "top", transform: "rotateX(90deg)" }}
    />
    {/* left */}
    <div
      style={{ ...face, left: 0, top: 0, width: h, height: d, background: side, transformOrigin: "left", transform: "rotateY(-90deg)" }}
    />
    {/* right */}
    <div
      style={{ ...face, left: w - h, top: 0, width: h, height: d, background: side, transformOrigin: "right", transform: "rotateY(90deg)" }}
    />
    {/* front */}
    <div
      style={{
        ...face,
        left: 0,
        top: d - h,
        width: w,
        height: h,
        background: front,
        transformOrigin: "bottom",
        transform: "rotateX(-90deg)",
        ...frontStyle,
      }}
    />
    {/* top */}
    <div style={{ ...face, left: 0, top: 0, width: w, height: d, background: top, transform: `translateZ(${h}px)`, ...topStyle }}>
      {children}
    </div>
  </div>
);

export default Cuboid;
