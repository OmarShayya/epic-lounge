import { forwardRef, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { tokens } from "@theme/theme";

export interface CategoryChip {
  id: string;
  name: string;
  count: number;
}

interface CategoryTabsProps {
  categories: CategoryChip[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

/**
 * Sticky, horizontally scrollable category chips. The active chip follows the
 * section you're reading and is kept centred in view.
 */
const CategoryTabs = forwardRef<HTMLDivElement, CategoryTabsProps>(({ categories, activeId, onSelect }, ref) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !activeId) return;
    const chip = scroller.querySelector<HTMLElement>(`[data-chip="${CSS.escape(activeId)}"]`);
    if (!chip) return;
    scroller.scrollTo({
      left: chip.offsetLeft - scroller.clientWidth / 2 + chip.clientWidth / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  return (
    <Box
      ref={ref}
      sx={{
        position: "sticky",
        top: tokens.headerHeight,
        zIndex: 10,
        mx: { xs: -2, sm: -3 },
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "saturate(160%) blur(14px)",
        WebkitBackdropFilter: "saturate(160%) blur(14px)",
        borderBottom: `1px solid ${tokens.border}`,
      }}
    >
      <Box
        ref={scrollerRef}
        role="tablist"
        aria-label="Menu categories"
        className="no-scrollbar"
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          px: { xs: 2, sm: 3 },
          py: 1.25,
          // fade the edges so it's obvious the row scrolls
          maskImage: "linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 24px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 24px), transparent 100%)",
        }}
      >
        {categories.map((c) => {
          const active = c.id === activeId;
          return (
            <Box
              key={c.id}
              component="button"
              role="tab"
              aria-selected={active}
              data-chip={c.id}
              onClick={() => onSelect(c.id)}
              sx={{
                position: "relative",
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                height: 38,
                px: 2,
                borderRadius: 999,
                border: `1px solid ${active ? "transparent" : tokens.border}`,
                background: "transparent",
                color: active ? "#000" : tokens.textMuted,
                font: "inherit",
                fontSize: "0.9rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                transition: "color .25s ease, border-color .25s ease",
                "&:hover": { color: active ? "#000" : tokens.text, borderColor: active ? "transparent" : tokens.borderStrong },
              }}
            >
              {active && (
                <motion.span
                  layoutId="menu-chip"
                  transition={{ type: "spring", stiffness: 450, damping: 36 }}
                  style={{ position: "absolute", inset: 0, borderRadius: 999, background: tokens.text }}
                />
              )}
              <span style={{ position: "relative" }}>{c.name}</span>
              <Box
                component="span"
                sx={{ position: "relative", fontSize: "0.75rem", opacity: active ? 0.6 : 0.55, fontWeight: 500 }}
              >
                {c.count}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
});

CategoryTabs.displayName = "CategoryTabs";

export default CategoryTabs;
