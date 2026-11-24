import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Pulls its child slightly towards the mouse pointer while hovered (desktop only). */
const Magnetic: React.FC<{ children: React.ReactNode; strength?: number; className?: string }> = ({
  children,
  strength = 0.3,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x, y, display: "inline-flex" }}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
