import React, { useEffect, useRef } from "react";

const INTERACTIVE =
  'a, button, [role="button"], [role="tab"], label, select, summary, [data-cursor]';
const TEXT_INPUT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable="true"]';

/**
 * Lightweight custom cursor: a precise dot + a ring that eases behind it.
 *
 * - Only on devices with a real mouse (hover + fine pointer) and no reduced-motion preference.
 * - Never touches React state while moving: everything is transforms + classes on <html>,
 *   and the animation loop sleeps when the ring has caught up.
 * - Grows over interactive elements. Add `data-cursor="Label"` to show a word inside the ring.
 * - Also feeds --mx / --my CSS variables used by the page spotlight background.
 */
const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const root = document.documentElement;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    root.classList.add("has-custom-cursor");

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;
    let lastTarget: Element | null = null;

    const tick = () => {
      pos.x += (mouse.x - pos.x) * 0.2;
      pos.y += (mouse.y - pos.y) * 0.2;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      root.style.setProperty("--mx", `${mouse.x}px`);
      root.style.setProperty("--my", `${mouse.y}px`);

      if (Math.abs(mouse.x - pos.x) > 0.1 || Math.abs(mouse.y - pos.y) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const updateTarget = (target: Element | null) => {
      if (target === lastTarget) return;
      lastTarget = target;

      const textEl = target?.closest(TEXT_INPUT);
      const interactive = target?.closest(INTERACTIVE) as HTMLElement | null;
      const labelText = interactive?.dataset.cursor;

      root.classList.toggle("cursor-text", !!textEl);
      root.classList.toggle("cursor-hover", !!interactive && !textEl && !labelText);
      root.classList.toggle("cursor-label", !!labelText && !textEl);
      label.textContent = labelText ?? "";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      if (!root.classList.contains("cursor-visible")) {
        // First move after entering: snap the ring so it doesn't fly in from a corner
        pos.x = mouse.x;
        pos.y = mouse.y;
        root.classList.add("cursor-visible");
      }
      updateTarget(e.target as Element | null);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");
    const onLeave = () => root.classList.remove("cursor-visible");
    // Elements can appear/disappear under a still cursor (dialogs, route changes)
    const onOver = (e: Event) => updateTarget(e.target as Element | null);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      root.classList.remove(
        "has-custom-cursor",
        "cursor-visible",
        "cursor-hover",
        "cursor-label",
        "cursor-text",
        "cursor-down"
      );
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <div className="cursor-ring__inner">
          <span ref={labelRef} className="cursor-ring__label" />
        </div>
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
