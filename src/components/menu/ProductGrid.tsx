import React from "react";
import { Grid, Typography, Box, Stack } from "@mui/material";
import ProductCard from "./ProductCard";
import { GroupedProducts } from "../../types/index";
import { Restaurant } from "@mui/icons-material";

interface ProductGridProps {
  groupedProducts: GroupedProducts;
  selectedCategory: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  groupedProducts,
  selectedCategory,
}) => {
  // Get products based on selected category
  const getProducts = () => {
    if (selectedCategory === "all") {
      // Return all products from all categories
      return Object.values(groupedProducts).flatMap((group) =>
        group.products.map((product) => ({
          ...product,
          categoryName: group.category.name,
        }))
      );
    } else {
      // Return products from selected category
      return groupedProducts[selectedCategory]?.products || [];
    }
  };

  const products = getProducts();

  // Separate products with and without images
  const productsWithImages = products.filter((p) => p.image && p.image !== "");
  const productsWithoutImages = products.filter(
    (p) => !p.image || p.image === ""
  );

  if (products.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 10,
        }}
      >
        <Restaurant
          sx={{
            fontSize: 80,
            color: "rgba(0,206,209,0.3)",
            mb: 2,
          }}
        />
        <Typography
          variant="h5"
          sx={{
            color: "#B2BAC2",
            mb: 1,
          }}
        >
          No products available
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(178,186,194,0.6)",
          }}
        >
          Check back soon for updates!
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      {/* Products WITH images - Grid layout */}
      {productsWithImages.length > 0 && (
        <Box>
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {productsWithImages.map((product, index) => (
              <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={product.id}>
                <ProductCard product={product} index={index} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Products WITHOUT images - List layout */}
      {productsWithoutImages.length > 0 && (
        <Box>
          {productsWithImages.length > 0 && (
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Rajdhani",
                fontWeight: 700,
                color: "#B2BAC2",
                mb: 2,
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              More Items
            </Typography>
          )}
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {productsWithoutImages.map((product, index) => (
              <Grid size={{ xs: 12, sm: 12, md: 6 }} key={product.id}>
                <ProductCard
                  product={product}
                  index={productsWithImages.length + index}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Stack>
  );
};

export default ProductGrid;
