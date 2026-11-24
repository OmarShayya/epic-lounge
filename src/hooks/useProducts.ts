import { useCallback, useEffect, useState } from "react";
import { menuApi } from "@services/api";
import type { Product, GroupedProducts } from "../types/index";

const groupByCategory = (data: Product[]): GroupedProducts =>
  data.reduce((acc, product) => {
    const categoryId = product.category.id;
    if (!acc[categoryId]) acc[categoryId] = { category: product.category, products: [] };
    acc[categoryId].products.push(product);
    return acc;
  }, {} as GroupedProducts);

export const useMenuProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuApi.getMenuProducts();
      setProducts(data);
      setGroupedProducts(groupByCategory(data));
    } catch (err) {
      setError("We couldn't load the menu. Check your connection and try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, groupedProducts, loading, error, retry: fetchProducts };
};

export const useExchangeRate = () => {
  const [rate, setRate] = useState<number>(89500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    menuApi
      .getExchangeRate()
      .then((data) => setRate(data.rate))
      .catch((err) => console.error("Error fetching exchange rate:", err))
      .finally(() => setLoading(false));
  }, []);

  return { rate, loading };
};
