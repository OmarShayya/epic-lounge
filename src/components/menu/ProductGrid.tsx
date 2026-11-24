import React from "react";
import { Box, Grid, Stack, Typography, alpha } from "@mui/material";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import type { Category, Product } from "../../types/index";
import type { CategoryStyle } from "@utils/categoryStyle";
import { sectionDomId } from "@utils/helpers";

export interface MenuSection {
  category: Category;
  products: Product[];
  style: CategoryStyle;
}

interface ProductGridProps {
  sections: MenuSection[];
}

/** All categories stacked as colour-coded sections — scroll through, or jump with the chips. */
const ProductGrid: React.FC<ProductGridProps> = ({ sections }) => (
  <Stack spacing={{ xs: 4, md: 5.5 }}>
    {sections.map(({ category, products, style }) => {
      const { color, Icon } = style;
      return (
        <Box key={category.id} component="section" id={sectionDomId(category.id)} data-section={category.id}>
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.75 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "11px",
                display: "grid",
                placeItems: "center",
                background: alpha(color, 0.16),
                border: `1px solid ${alpha(color, 0.35)}`,
                flexShrink: 0,
              }}
            >
              <Icon sx={{ color, fontSize: 20 }} />
            </Box>
            <Typography component="h2" sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", md: "1.45rem" }, color: "#fff" }}>
              {category.name}
            </Typography>
            <Box
              component="span"
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color,
                background: alpha(color, 0.12),
              }}
            >
              {products.length}
            </Box>
            <Box sx={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${alpha(color, 0.35)}, transparent)` }} />
          </Stack>
          <Grid container spacing={{ xs: 1, md: 1.75 }}>
            {products.map((product, i) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                  transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.03 }}
                  style={{ height: "100%" }}
                >
                  <ProductCard product={product} accent={color} Icon={Icon} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    })}
  </Stack>
);

export default ProductGrid;
