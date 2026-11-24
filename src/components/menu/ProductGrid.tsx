import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import type { Category, Product } from "../../types/index";
import { tokens } from "@theme/theme";
import { sectionDomId } from "@utils/helpers";

export interface MenuSection {
  category: Category;
  products: Product[];
}

interface ProductGridProps {
  sections: MenuSection[];
}

/** All categories stacked as sections — scroll through, or jump with the chips. */
const ProductGrid: React.FC<ProductGridProps> = ({ sections }) => (
  <Stack spacing={{ xs: 4.5, md: 6 }}>
    {sections.map(({ category, products }) => (
      <Box key={category.id} component="section" id={sectionDomId(category.id)} data-section={category.id}>
        <Stack direction="row" alignItems="baseline" spacing={1.25} sx={{ mb: 2 }}>
          <Typography component="h2" sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", md: "1.45rem" } }}>
            {category.name}
          </Typography>
          <Typography sx={{ color: tokens.textDim, fontSize: "0.9rem", fontWeight: 500 }}>
            {products.length} {products.length === 1 ? "item" : "items"}
          </Typography>
        </Stack>
        <Grid container spacing={{ xs: 1.25, md: 2 }}>
          {products.map((product, i) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.03 }}
                style={{ height: "100%" }}
              >
                <ProductCard product={product} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    ))}
  </Stack>
);

export default ProductGrid;
