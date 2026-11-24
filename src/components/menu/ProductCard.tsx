import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import type { Product } from "../../types/index";
import { useCart } from "../../context/CartContext";
import { tokens } from "@theme/theme";
import { formatLBP, formatUSD, haptic } from "@utils/helpers";
import QtyStepper from "./QtyStepper";

interface ProductCardProps {
  product: Product;
}

/** One menu item: name, description, price, optional photo, and the add / quantity control. */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, updateQuantity, getQuantity } = useCart();
  const [imgOk, setImgOk] = useState(true);
  const qty = getQuantity(product.id);
  const hasImage = !!product.image && imgOk;

  const add = () => {
    haptic();
    addItem(product);
  };
  const remove = () => {
    haptic();
    updateQuantity(product.id, qty - 1);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        gap: 2,
        height: "100%",
        alignItems: hasImage ? "stretch" : "center",
        p: { xs: 1.75, md: 2 },
        borderRadius: 4,
        background: tokens.surface,
        border: `1px solid ${qty > 0 ? "rgba(0,206,209,0.45)" : tokens.border}`,
        transition: "border-color .25s ease, background-color .25s ease",
        "&:hover": { borderColor: qty > 0 ? "rgba(0,206,209,0.7)" : tokens.borderStrong, background: tokens.surfaceRaised },
      }}
    >
      {/* Text */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Typography sx={{ fontWeight: 600, fontSize: "1.02rem", lineHeight: 1.3, color: tokens.text }}>
          {product.name}
        </Typography>
        {product.description && (
          <Typography
            sx={{
              mt: 0.5,
              color: tokens.textMuted,
              fontSize: "0.85rem",
              lineHeight: 1.45,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </Typography>
        )}
        <Box sx={{ mt: "auto", pt: hasImage || product.description ? 1.25 : 0.5, display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.08rem", color: tokens.text }}>
            {formatUSD(product.pricing.usd)}
          </Typography>
          <Typography sx={{ color: tokens.textDim, fontSize: "0.78rem", fontWeight: 500 }}>
            {formatLBP(product.pricing.lbp)}
          </Typography>
        </Box>
      </Box>

      {/* Photo + control */}
      <Box sx={{ position: "relative", flexShrink: 0, display: "flex", alignItems: "flex-end" }}>
        {hasImage ? (
          <Box sx={{ position: "relative", alignSelf: "flex-start", mb: 1 }}>
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImgOk(false)}
              sx={{
                width: { xs: 96, md: 104 },
                height: { xs: 96, md: 104 },
                objectFit: "cover",
                borderRadius: 3,
                background: tokens.surfaceRaised,
              }}
            />
            <Box sx={{ position: "absolute", right: -6, bottom: -10 }}>
              <QtyStepper quantity={qty} onAdd={add} onRemove={remove} name={product.name} />
            </Box>
          </Box>
        ) : (
          <QtyStepper quantity={qty} onAdd={add} onRemove={remove} name={product.name} />
        )}
      </Box>
    </Box>
  );
};

export default React.memo(ProductCard);
