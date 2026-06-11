import { apiRequest } from '@/services/api';

export interface ProductItem {
  product_id?: string;
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

export interface ProductDto {
  product_id: string;
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

export interface ProductActionResponse extends ProductBaseResponse, Partial<ProductDto> {}

export interface ProductSingleResponse extends ProductBaseResponse {
  product?: ProductDto[];
}
export interface ProductListResponse extends ProductBaseResponse {
  product?: ProductDto[];
}

export const mapProductDtoToProductItem = (product: ProductDto): ProductItem => ({
  uuid: product.product_id,
  pid: product.pid,
  name: product.name,
  price: product.price,
  stock: product.stock,
  status: product.status,
  seller_id: product.seller_id,
  desc: product.desc,
  type: product.type,
  product_url: product.product_url,
});

export const mapProductActionToProductItem = (product: ProductActionResponse): ProductItem | null => {
  if (!product.product_id || !product.pid || !product.name) return null;

  return mapProductDtoToProductItem({
    product_id: product.product_id,
    pid: product.pid,
    name: product.name,
    price: product.price ?? 0,
    stock: product.stock ?? 0,
    status: product.status ?? true,
    seller_id: product.seller_id ?? '',
    desc: product.desc ?? '',
    type: product.type ?? '',
    product_url: product.product_url,
  });
};

export const productService = {
  //賣家上架商品
  addProduct: (data: AddProductPayload, token: string) => {
    return apiRequest<ProductActionResponse>('/products/product', {
      method: 'POST',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //賣家增加商品種類
  addProductType: (pid: string, data: AddTypePayload, token: string) => {
    return apiRequest<ProductActionResponse>(`/api/v2/products/type/${pid}`, {
      method: 'POST',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //賣家編輯商品
  editProductBase: (pid: string, name: string, token: string) => {
    return apiRequest<ProductBaseResponse>(`/api/v2/products/product/${pid}`, {
      method: 'PUT',
      body: { name },
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //賣家更新商品種類
  updateProductType: (uuid: string, data: AddTypePayload, token: string) => {
    return apiRequest<ProductActionResponse>(`/products/type/${uuid}`, {
      method: 'PUT',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //賣家刪除商品
  deleteProduct: (pid: string, token: string) => {
    return apiRequest<ProductBaseResponse>(`/api/v2/products/product/${pid}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //賣家刪除商品類型
  deleteProductType: (uuid: string, token: string) => {
    return apiRequest<ProductBaseResponse>(`/products/type/${uuid}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  //查看商品
  getProduct: (pid: string, token: string) => {
    return apiRequest<ProductSingleResponse>(`/api/v2/products/product/${pid}`, {
      method: 'GET',
      auth: Boolean(token),
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
    });
  },
  //列出使用者所有商品
  getMyProducts: (token: string) => {
    return apiRequest<ProductListResponse>('/products/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
};
