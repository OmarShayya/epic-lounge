import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Container, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Refresh, SearchOff } from "@mui/icons-material";
import MenuHeader from "@components/menu/MenuHeader";
import CategoryTabs from "@components/menu/CategoryTabs";
import type { CategoryChip } from "@components/menu/CategoryTabs";
import ProductGrid from "@components/menu/ProductGrid";
import type { MenuSection } from "@components/menu/ProductGrid";
import FloatingCart from "@components/menu/FloatingCart";
import { useMenuProducts } from "@hooks/useProducts";
import { useCart } from "../context/CartContext";
import { tokens } from "@theme/theme";
import { sectionDomId } from "@utils/helpers";
import { getCategoryStyle } from "@utils/categoryStyle";

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const MenuSkeleton: React.FC = () => (
  <Box aria-busy="true" aria-label="Loading menu">
    <Stack direction="row" spacing={1} sx={{ py: 1.25, mb: 3, overflow: "hidden" }}>
      {[88, 110, 96, 120, 80].map((w, i) => (
        <Box key={i} className="skeleton" sx={{ width: w, height: 40, borderRadius: "999px", flexShrink: 0 }} />
      ))}
    </Stack>
    <Box className="skeleton" sx={{ width: 140, height: 24, mb: 2 }} />
    <Box sx={{ display: "grid", gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" } }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Box key={i} className="skeleton" sx={{ height: 92, borderRadius: "18px" }} />
      ))}
    </Box>
  </Box>
);

const MenuPage: React.FC = () => {
  const { products, groupedProducts, loading, error, retry } = useMenuProducts();
  const { getTotalItems } = useCart();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const spyLockedUntil = useRef(0);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Every category gets a stable colour + icon (based on the full list, so search doesn't reshuffle them)
  const allSections: MenuSection[] = useMemo(
    () =>
      Object.values(groupedProducts).map((g, i) => ({
        category: g.category,
        products: g.products,
        style: getCategoryStyle(g.category.name, i),
      })),
    [groupedProducts]
  );

  // Sections (filtered by search)
  const sections: MenuSection[] = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return allSections;
    return allSections
      .map((g) => ({
        ...g,
        products: g.products.filter((p) =>
          normalize(`${p.name} ${p.description ?? ""} ${g.category.name}`).includes(q)
        ),
      }))
      .filter((g) => g.products.length > 0);
  }, [allSections, query]);

  const chips: CategoryChip[] = useMemo(
    () =>
      sections.map((s) => ({
        id: s.category.id,
        name: s.category.name,
        count: s.products.length,
        color: s.style.color,
        Icon: s.style.Icon,
      })),
    [sections]
  );

  const resultCount = useMemo(() => sections.reduce((n, s) => n + s.products.length, 0), [sections]);

  // Distance from the top of the viewport where a section counts as "current"
  const getOffset = useCallback(() => {
    const header = isDesktop ? 72 : 60;
    const chipsH = chipsRef.current?.offsetHeight ?? 58;
    return header + chipsH + 12;
  }, [isDesktop]);

  // Scroll-spy: highlight the chip for the section you're looking at
  useEffect(() => {
    if (!chips.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (Date.now() < spyLockedUntil.current) return;
      const offset = getOffset() + 8;
      let current = chips[0].id;
      for (const c of chips) {
        const el = document.getElementById(sectionDomId(c.id));
        if (el && el.getBoundingClientRect().top - offset <= 0) current = c.id;
      }
      // At the very bottom, the last section wins even if it's short
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = chips[chips.length - 1].id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [chips, getOffset]);

  const jumpTo = (id: string) => {
    const el = document.getElementById(sectionDomId(id));
    if (!el) return;
    setActiveId(id);
    spyLockedUntil.current = Date.now() + 800;
    const top = el.getBoundingClientRect().top + window.scrollY - getOffset();
    window.scrollTo({ top, behavior: "smooth" });
  };

  const hasCart = getTotalItems() > 0;

  return (
    <Box
      sx={{
        pb: hasCart ? 14 : 8,
        // Lifted charcoal with soft colour glows — clearer than pure black
        mt: { xs: "-60px", md: "-72px" },
        pt: { xs: "60px", md: "72px" },
        minHeight: "100vh",
        background: tokens.menuPageBg,
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 2.5, md: 5 }, px: { xs: 2, sm: 3 } }}>
        <MenuHeader query={query} onQueryChange={setQuery} />

        {loading ? (
          <MenuSkeleton />
        ) : error ? (
          <Stack alignItems="center" spacing={2} sx={{ py: 10, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 600, fontSize: "1.1rem" }}>Menu unavailable</Typography>
            <Typography sx={{ color: tokens.textMuted, maxWidth: 360 }}>{error}</Typography>
            <Button variant="contained" startIcon={<Refresh />} onClick={retry}>
              Try again
            </Button>
          </Stack>
        ) : products.length === 0 ? (
          <Stack alignItems="center" spacing={1} sx={{ py: 10, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 600, fontSize: "1.1rem" }}>The menu is being updated</Typography>
            <Typography sx={{ color: tokens.textMuted }}>Check back in a moment.</Typography>
          </Stack>
        ) : (
          <>
            {chips.length > 0 && <CategoryTabs ref={chipsRef} categories={chips} activeId={activeId} onSelect={jumpTo} />}

            {query.trim() && (
              <Typography sx={{ color: tokens.textMuted, fontSize: "0.9rem", mt: 2.5 }}>
                {resultCount} {resultCount === 1 ? "result" : "results"} for “{query.trim()}”
              </Typography>
            )}

            <Box sx={{ mt: { xs: 3, md: 4 } }}>
              {sections.length > 0 ? (
                <ProductGrid sections={sections} />
              ) : (
                <Stack alignItems="center" spacing={1.5} sx={{ py: 8, textAlign: "center" }}>
                  <SearchOff sx={{ fontSize: 40, color: tokens.textDim }} />
                  <Typography sx={{ fontWeight: 600 }}>Nothing matches “{query.trim()}”</Typography>
                  <Button variant="outlined" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                </Stack>
              )}
            </Box>
          </>
        )}
      </Container>

      <FloatingCart />
    </Box>
  );
};

export default MenuPage;
