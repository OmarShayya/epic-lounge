import React from "react";
import { Box, Tabs, Tab, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { GroupedProducts } from "../../types/index";

interface CategoryTabsProps {
  categories: string[];
  groupedProducts: GroupedProducts;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  groupedProducts,
  selectedCategory,
  onCategoryChange,
}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onCategoryChange(newValue);
  };

  // Calculate total products for "All" tab
  const totalProducts = Object.values(groupedProducts).reduce(
    (sum, group) => sum + group.products.length,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "rgba(0,206,209,0.2)",
          position: "sticky",
          top: { xs: 64, md: 72 },
          backgroundColor: "rgba(10, 25, 41, 0.95)",
          backdropFilter: "blur(10px)",
          zIndex: 100,
          py: 2,
        }}
      >
        <Tabs
          value={selectedCategory}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#00CED1",
              height: 3,
            },
            "& .MuiTab-root": {
              fontFamily: "Orbitron",
              fontWeight: 600,
              fontSize: { xs: "0.9rem", md: "1rem" },
              color: "#B2BAC2",
              textTransform: "none",
              minHeight: 48,
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#00CED1",
                background: "rgba(0,206,209,0.05)",
              },
              "&.Mui-selected": {
                color: "#00CED1",
              },
            },
          }}
        >
          {/* All Items Tab */}
          <Tab
            value="all"
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                All Items
                <Chip
                  label={totalProducts}
                  size="small"
                  sx={{
                    backgroundColor:
                      selectedCategory === "all"
                        ? "#00CED1"
                        : "rgba(0,206,209,0.2)",
                    color: selectedCategory === "all" ? "#0A1929" : "#00CED1",
                    fontWeight: 700,
                    height: 22,
                    fontSize: "0.75rem",
                  }}
                />
              </Box>
            }
          />

          {/* Category Tabs */}
          {categories.map((categoryId) => {
            const group = groupedProducts[categoryId];
            return (
              <Tab
                key={categoryId}
                value={categoryId}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {group.category.name}
                    <Chip
                      label={group.products.length}
                      size="small"
                      sx={{
                        backgroundColor:
                          selectedCategory === categoryId
                            ? "#00CED1"
                            : "rgba(0,206,209,0.2)",
                        color:
                          selectedCategory === categoryId
                            ? "#0A1929"
                            : "#00CED1",
                        fontWeight: 700,
                        height: 22,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                }
              />
            );
          })}
        </Tabs>
      </Box>
    </motion.div>
  );
};

export default CategoryTabs;
