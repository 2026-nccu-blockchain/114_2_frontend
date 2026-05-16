export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sellerId: string;
  sellerName: string;
  imageUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
}