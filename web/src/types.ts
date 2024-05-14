export type User = {
  email: string;
  id: number;
};

export type Filter = {
  keyword: string;
  price: [number, number];
  brand: string;
  categories: string[];
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

export type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  discountPercentage: number;
  brand: string;
  category: string;
  thumbnail: string;
};
