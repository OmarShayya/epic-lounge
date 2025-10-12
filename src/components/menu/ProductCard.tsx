import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { Product } from "../../types/index";
import { AddShoppingCart } from "@mui/icons-material";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addItem } = useCart();
  const hasImage = product.image && product.image !== "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  // Compact list-style card for products WITHOUT images
  if (!hasImage) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03, duration: 0.3 }}
      >
        <Card
          sx={{
            background: "rgba(19, 47, 76, 0.3)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0,206,209,0.1)",
            borderRadius: 2,
            overflow: "hidden",
            transition: "all 0.3s ease",
            "&:hover": {
              border: "1px solid rgba(0,206,209,0.4)",
              boxShadow: "0 4px 20px rgba(0,206,209,0.15)",
              transform: "translateX(4px)",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Left: Product Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack spacing={0.5}>
                  {/* Name & Category */}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Rajdhani",
                        fontWeight: 700,
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                        color: "#FFFFFF",
                        lineHeight: 1.2,
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Chip
                      label={product.category.name}
                      size="small"
                      sx={{
                        height: 20,
                        backgroundColor: "rgba(0,206,209,0.15)",
                        color: "#00CED1",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  </Stack>

                  {/* Description */}
                  {product.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#B2BAC2",
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.description}
                    </Typography>
                  )}
                </Stack>
              </Box>

              {/* Right: Prices & Add Button */}
              <Stack
                spacing={1}
                alignItems="flex-end"
                sx={{ minWidth: "fit-content" }}
              >
                <Stack spacing={0.5} alignItems="flex-end">
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Orbitron",
                      fontWeight: 700,
                      color: "#00CED1",
                      fontSize: { xs: "1.1rem", sm: "1.3rem" },
                      lineHeight: 1,
                    }}
                  >
                    ${product.pricing.usd.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "Rajdhani",
                      fontWeight: 600,
                      color: "#9B51E0",
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      lineHeight: 1,
                    }}
                  >
                    {product.pricing.lbp.toLocaleString()} LBP
                  </Typography>
                </Stack>

                {/* Add to Cart Button */}
                <IconButton
                  onClick={handleAddToCart}
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  sx={{
                    background:
                      "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
                    color: "#FFFFFF",
                    width: 36,
                    height: 36,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5FE3E6 0%, #BA7FED 100%)",
                      boxShadow: "0 4px 12px rgba(0,206,209,0.4)",
                    },
                  }}
                >
                  <AddShoppingCart sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Image card for products WITH images (compact version)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "rgba(19, 47, 76, 0.3)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0,206,209,0.1)",
          borderRadius: 2,
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            border: "1px solid rgba(0,206,209,0.4)",
            boxShadow: "0 8px 30px rgba(0,206,209,0.2)",
            "& .product-image": {
              transform: "scale(1.05)",
            },
          },
        }}
      >
        {/* Image - Compact */}
        <Box
          sx={{
            position: "relative",
            paddingTop: "60%", // 5:3 aspect ratio (shorter than before)
            overflow: "hidden",
            backgroundColor: "rgba(10, 25, 41, 0.6)",
          }}
        >
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            className="product-image"
            onError={(e: any) => {
              e.target.style.display = "none";
            }}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
          />

          {/* Category Badge */}
          <Chip
            label={product.category.name}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,206,209,0.9)",
              color: "#0A1929",
              fontWeight: 700,
              fontSize: "0.7rem",
              height: 22,
              backdropFilter: "blur(10px)",
            }}
          />
        </Box>

        {/* Content - Compact */}
        <CardContent
          sx={{
            flexGrow: 1,
            p: { xs: 1.5, sm: 2 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Product Name */}
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Rajdhani",
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              color: "#FFFFFF",
              mb: 0.5,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name}
          </Typography>

          {/* Description - Compact */}
          {product.description && (
            <Typography
              variant="body2"
              sx={{
                color: "#B2BAC2",
                mb: 1.5,
                lineHeight: 1.4,
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.description}
            </Typography>
          )}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Price Section - Compact */}
          <Box
            sx={{
              mt: "auto",
              pt: 1.5,
              borderTop: "1px solid rgba(0,206,209,0.1)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              {/* Prices */}
              <Stack spacing={0.5}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Orbitron",
                    fontWeight: 700,
                    color: "#00CED1",
                    fontSize: { xs: "1.1rem", sm: "1.3rem" },
                  }}
                >
                  ${product.pricing.usd.toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Rajdhani",
                    fontWeight: 600,
                    color: "#9B51E0",
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  }}
                >
                  {product.pricing.lbp.toLocaleString()} LBP
                </Typography>
              </Stack>

              {/* Add to Cart Button */}
              <IconButton
                onClick={handleAddToCart}
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                sx={{
                  background:
                    "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
                  color: "#FFFFFF",
                  width: 40,
                  height: 40,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5FE3E6 0%, #BA7FED 100%)",
                    boxShadow: "0 4px 12px rgba(0,206,209,0.4)",
                  },
                }}
              >
                <AddShoppingCart sx={{ fontSize: 20 }} />
              </IconButton>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
