import React, { useState } from "react";
import { Box, Typography, alpha } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import type { Product } from "../../types/index";
import { useCart } from "../../context/CartContext";
import { tokens } from "@theme/theme";
import { formatLBP, formatUSD, haptic } from "@utils/helpers";
import QtyStepper from "./QtyStepper";

interface ProductCardProps {
  product: Product;
  accent: string;
  Icon: SvgIconComponent;
}

/**
 * One menu item as a clear row: photo (or a coloured category icon), name,
 * short description, price, and the add / quantity control.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, accent, Icon }) => {
  const { addItem, updateQuantity, getQuantity } = useCart();
  const [imgOk, setImgOk] = useState(true);
  const qty = getQuantity(product.id);
  const hasImage = !!product.image && imgOk;
  const inCart = qty > 0;

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
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.5, md: 1.75 },
        height: "100%",
        p: { xs: 1.25, md: 1.5 },
        pr: { xs: 1.5, md: 1.75 },
        borderRadius: "18px",
        background: inCart ? `linear-gradient(90deg, ${alpha(tokens.cyan, 0.09)}, ${tokens.menuCard} 60%)` : tokens.menuCard,
        border: `1px solid ${inCart ? alpha(tokens.cyan, 0.5) : tokens.menuBorder}`,
        boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(10,8,30,0.35)",
        transition: "border-color .25s ease, background-color .25s ease, transform .25s ease",
        "&:hover": {
          background: inCart ? undefined : tokens.menuCardHover,
          borderColor: inCart ? alpha(tokens.cyan, 0.7) : "rgba(255,255,255,0.14)",
        },
      }}
    >
      {/* Photo or category icon */}
      <Box
        sx={{
          position: "relative",
          width: { xs: 64, md: 72 },
          height: { xs: 64, md: 72 },
          flexShrink: 0,
          borderRadius: "14px",
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
          background: hasImage
            ? tokens.surfaceRaised
            : `radial-gradient(120% 120% at 20% 0%, ${alpha(accent, 0.32)}, ${alpha(accent, 0.08)} 70%)`,
          border: `1px solid ${alpha(accent, hasImage ? 0.15 : 0.3)}`,
        }}
      >
        {hasImage ? (
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgOk(false)}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Icon sx={{ color: accent, fontSize: { xs: 28, md: 32 } }} />
        )}
      </Box>

      {/* Text */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: "1rem", md: "1.05rem" },
            lineHeight: 1.25,
            color: "#fff",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </Typography>
        {product.description && (
          <Typography
            sx={{
              mt: 0.25,
              color: tokens.menuText,
              fontSize: "0.82rem",
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
        <Box sx={{ mt: 0.75, display: "flex", alignItems: "baseline", columnGap: 1, flexWrap: "wrap" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: accent, lineHeight: 1.3 }}>
            {formatUSD(product.pricing.usd)}
          </Typography>
          <Typography sx={{ color: tokens.menuTextDim, fontSize: "0.78rem", fontWeight: 500 }}>
            {formatLBP(product.pricing.lbp)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <QtyStepper quantity={qty} onAdd={add} onRemove={remove} name={product.name} />
      </Box>
    </Box>
  );
};

export default ProductCard;
