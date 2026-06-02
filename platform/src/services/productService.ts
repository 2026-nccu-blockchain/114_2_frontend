import { apiRequest } from '@/services/api';

export interface ProductItem {
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

export interface ProductBaseResponse {
  status_code: string;
  message: string;
  response_datetime: string;
}

export interface AddProductPayload {
  name: string;
  price: number;
  stock: number;
  status: boolean;
  desc: string;
  type: string;
  product_url?: string;
}

export interface AddTypePayload {
  price: number;
  stock: number;
  status: boolean;
  desc: string;
  type: string;
  product_url?: string;
}

export interface ProductActionResponse extends ProductBaseResponse, Partial<ProductItem> {}

export interface ProductSingleResponse extends ProductBaseResponse {
  product?: ProductItem[];
}
export interface ProductListResponse extends ProductBaseResponse {
  product?: ProductItem[];
}

export const productService = {
  //賣家上架商品
  addProduct: (data: AddProductPayload, token: string) => {
    return apiRequest<ProductActionResponse>('/api/v2/products/product', {
      method: 'POST',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //賣家增加商品種類
  addProductType: (productId: string, data: AddTypePayload, token: string) => {
    return apiRequest<ProductActionResponse>(`/api/v2/products/type/${productId}`, {
      method: 'POST',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //賣家編輯商品
  editProductBase: (productId: string, name: string, token: string) => {
    return apiRequest<ProductBaseResponse>(`/api/v2/products/product/${productId}`, {
      method: 'PUT',
      body: { name },
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //賣家更新商品種類
  updateProductType: (uuid: string, data: AddTypePayload, token: string) => {
    return apiRequest<ProductActionResponse>(`/api/v2/products/type/${uuid}`, {
      method: 'PUT',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //賣家刪除商品
  deleteProduct: (productId: string, token: string) => {
    return apiRequest<ProductBaseResponse>(`/api/v2/products/product/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //賣家刪除商品類型
  deleteProductType: (uuid: string, token: string) => {
    return apiRequest<ProductBaseResponse>(`/api/v2/products/type/${uuid}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //查看商品
  getProduct: (productId: string, token: string) => {
    return apiRequest<ProductSingleResponse>(`/api/v2/products/product/${productId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //列出使用者所有商品
  getMyProducts: (token: string) => {
    return apiRequest<ProductListResponse>('/api/v2/products/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
};