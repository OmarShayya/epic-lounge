import { useEffect, useState, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

export const useCursorFollow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const trailPoints = useRef<TrailPoint[]>([]);
  const moveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafId = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const smoothMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Create canvas for trail
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9996";
    canvas.style.mixBlendMode = "screen";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    document.body.appendChild(canvas);
    canvasRef.current = canvas;
    ctxRef.current = ctx;

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    const drawTrail = () => {
      if (!ctxRef.current || !canvasRef.current) return;

      const ctx = ctxRef.current;
      const now = Date.now();

      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Remove old trail points (older than 400ms)
      trailPoints.current = trailPoints.current.filter(
        (point) => now - point.timestamp < 400
      );

      if (trailPoints.current.length < 2) {
        rafId.current = requestAnimationFrame(drawTrail);
        return;
      }

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Draw multiple layers with decreasing length and width for taper effect
      const numLayers = 8;

      for (let layer = 0; layer < numLayers; layer++) {
        // Each layer uses fewer points (creates taper)
        const layerProgress = (layer + 1) / numLayers;
        const pointsToUse = Math.floor(
          trailPoints.current.length * layerProgress
        );

        if (pointsToUse < 2) continue;

        // Start point for this layer (skip early points for shorter layers)
        const startIndex = trailPoints.current.length - pointsToUse;

        // Draw continuous path for this layer
        ctx.beginPath();
        ctx.moveTo(
          trailPoints.current[startIndex].x,
          trailPoints.current[startIndex].y
        );

        // Draw smooth curve through points
        for (let i = startIndex; i < trailPoints.current.length - 1; i++) {
          const point = trailPoints.current[i];
          const nextPoint = trailPoints.current[i + 1];

          // Calculate control point for smooth curve
          const xc = (point.x + nextPoint.x) / 2;
          const yc = (point.y + nextPoint.y) / 2;

          ctx.quadraticCurveTo(point.x, point.y, xc, yc);
        }

        // Draw to last point
        const lastPoint = trailPoints.current[trailPoints.current.length - 1];
        ctx.lineTo(lastPoint.x, lastPoint.y);

        // Width increases with each layer (creates thickness at head)
        const minWidth = 2;
        const maxWidth = 22;
        const width = minWidth + (maxWidth - minWidth) * layerProgress;

        // Opacity decreases for inner layers (softer appearance)
        const opacity = 0.15 + 0.55 * layerProgress;

        // Age-based fading
        const oldestPoint = trailPoints.current[startIndex];
        const age = (now - oldestPoint.timestamp) / 400;
        const ageFactor = Math.max(0, 1 - age);
        const finalOpacity = opacity * ageFactor;

        ctx.strokeStyle = `rgba(0, 206, 209, ${finalOpacity})`;
        ctx.lineWidth = width;

        // Add glow to outer layers
        if (layer >= numLayers - 2) {
          ctx.shadowBlur = 10 * layerProgress;
          ctx.shadowColor = `rgba(0, 206, 209, ${finalOpacity * 0.8})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
      }

      // Draw bright head at current position
      if (trailPoints.current.length > 0) {
        const head = trailPoints.current[trailPoints.current.length - 1];
        const headRadius = 8;

        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          head.x,
          head.y,
          0,
          head.x,
          head.y,
          headRadius * 2.5
        );
        glowGradient.addColorStop(0, "rgba(0, 255, 255, 0.9)");
        glowGradient.addColorStop(0.5, "rgba(0, 206, 209, 0.5)");
        glowGradient.addColorStop(1, "rgba(0, 206, 209, 0)");

        ctx.beginPath();
        ctx.arc(head.x, head.y, headRadius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.shadowBlur = 0;
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.arc(head.x, head.y, headRadius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 255, 1)";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(0, 206, 209, 1)";
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.restore();
      rafId.current = requestAnimationFrame(drawTrail);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Update smooth position for cursor elements
      smoothMousePos.current = { x, y };
      setMousePosition({ x, y });
      setIsVisible(true);
      setIsMoving(true);

      // Add point to trail with minimal distance for ultra-smooth curves
      const lastPoint = trailPoints.current[trailPoints.current.length - 1];
      if (
        !lastPoint ||
        Math.abs(lastPoint.x - x) > 0.5 ||
        Math.abs(lastPoint.y - y) > 0.5
      ) {
        trailPoints.current.push({
          x,
          y,
          timestamp: Date.now(),
        });
      }

      // Limit trail points (increased for better fast movement)
      if (trailPoints.current.length > 60) {
        trailPoints.current.shift();
      }

      // Clear and set new timeout
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }

      moveTimeout.current = setTimeout(() => {
        setIsMoving(false);
      }, 100);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsMoving(false);
      trailPoints.current = [];
    };

    // Start animation loop
    rafId.current = requestAnimationFrame(drawTrail);

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);

      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, []);

  return { mousePosition, isVisible, isMoving };
};
