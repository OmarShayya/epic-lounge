import { forwardRef, useEffect, useRef } from "react";
import { Box, alpha } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import { motion } from "framer-motion";
import { tokens } from "@theme/theme";

export interface CategoryChip {
  id: string;
  name: string;
  count: number;
  color: string;
  Icon: SvgIconComponent;
}

interface CategoryTabsProps {
  categories: CategoryChip[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

/**
 * Sticky, horizontally scrollable category chips, colour-coded per category.
 * The active chip follows the section you're reading and is kept centred in view.
 */
const CategoryTabs = forwardRef<HTMLDivElement, CategoryTabsProps>(({ categories, activeId, onSelect }, ref) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeColor = categories.find((c) => c.id === activeId)?.color ?? tokens.cyan;

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
        background: "rgba(30,33,60,0.92)",
        backdropFilter: "saturate(160%) blur(14px)",
        WebkitBackdropFilter: "saturate(160%) blur(14px)",
        borderBottom: `1px solid ${tokens.menuBorder}`,
        boxShadow: `0 1px 0 ${alpha(activeColor, 0.25)}`,
        transition: "box-shadow .3s ease",
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
          maskImage: "linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 24px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 24px), transparent 100%)",
        }}
      >
        {categories.map((c) => {
          const active = c.id === activeId;
          const { Icon } = c;
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
                height: 40,
                pl: 1.25,
                pr: 1.75,
                borderRadius: "999px",
                border: `1px solid ${active ? "transparent" : tokens.menuBorder}`,
                background: active ? "transparent" : tokens.menuCard,
                color: active ? "#000" : "#D9DAE3",
                font: "inherit",
                fontSize: "0.9rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                transition: "color .25s ease, border-color .25s ease, background-color .25s ease",
                "&:hover": active ? {} : { borderColor: alpha(c.color, 0.5), color: "#fff" },
              }}
            >
              {active && (
                <motion.span
                  layoutId="menu-chip"
                  transition={{ type: "spring", stiffness: 450, damping: 36 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 999,
                    background: c.color,
                    boxShadow: `0 6px 20px ${alpha(c.color, 0.35)}`,
                  }}
                />
              )}
              <Icon sx={{ position: "relative", fontSize: 18, color: active ? "#000" : c.color }} />
              <span style={{ position: "relative" }}>{c.name}</span>
              <Box component="span" sx={{ position: "relative", fontSize: "0.75rem", opacity: 0.6, fontWeight: 600 }}>
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
