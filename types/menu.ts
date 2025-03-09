export interface ShopReference {
  _id: string;
  name?: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  shop: string | ShopReference;
  image?: string; // Optional URL for food image
}
