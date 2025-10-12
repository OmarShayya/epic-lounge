import React from "react";
import { Box, Container, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import MenuHeader from "@components/menu/MenuHeader";
import CategoryTabs from "@components/menu/CategoryTabs";
import ProductGrid from "@components/menu/ProductGrid";
import FloatingCart from "@components/menu/FloatingCart";
import { useMenuProducts } from "@hooks/useProducts";
import LoadingSpinner from "@components/common/LoadingSpinner";

const MenuPage: React.FC = () => {
  const { groupedProducts, loading, error } = useMenuProducts();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  const categories = Object.keys(groupedProducts);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0A1929 0%, #132F4C 50%, #0A1929 100%)",
        py: { xs: 2, md: 6 },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 3, md: 6 }}>
          {/* Header */}
          <MenuHeader />

          {/* Category Tabs */}
          <CategoryTabs
            categories={categories}
            groupedProducts={groupedProducts}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGrid
              groupedProducts={groupedProducts}
              selectedCategory={selectedCategory}
            />
          </motion.div>
        </Stack>
      </Container>

      {/* Floating Cart Button */}
      <FloatingCart />
    </Box>
  );
};

export default MenuPage;
