import { useState, useEffect } from "react";
import { menuApi } from "@services/api";
import { Product, GroupedProducts } from "../types/index";

export const useMenuProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await menuApi.getMenuProducts();
        setProducts(data);

        // Group products by category
        const grouped = data.reduce((acc, product) => {
          const categoryId = product.category.id;
          if (!acc[categoryId]) {
            acc[categoryId] = {
              category: product.category,
              products: [],
            };
          }
          acc[categoryId].products.push(product);
          return acc;
        }, {} as GroupedProducts);

        setGroupedProducts(grouped);
        setError(null);
      } catch (err) {
        setError("Failed to load menu items");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, groupedProducts, loading, error };
};

export const useExchangeRate = () => {
  const [rate, setRate] = useState<number>(89500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const data = await menuApi.getExchangeRate();
        setRate(data.rate);
      } catch (err) {
        console.error("Error fetching exchange rate:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, []);

  return { rate, loading };
};
