export interface Product {
  uuid: string;
  pid: string;
  name: string;
  price: number;
  stock: number;
  status: boolean;
  seller_id: string;
  desc: string;
  type: string; 
  product_url?: string;
}
export interface CartItem extends Product {
  cartId?: string;
  quantity: number;
}
