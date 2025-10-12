export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category: {
    id: string;
    name: string;
  };
  pricing: {
    usd: number;
    lbp: number;
  };
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface GroupedProducts {
  [categoryId: string]: {
    category: Category;
    products: Product[];
  };
}
