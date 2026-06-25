import { useCallback, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  mapProductActionToProductItem,
  mapProductDtoToProductItem,
  productService,
  type AddProductPayload,
  type AddTypePayload,
} from '@/services/productService';
import type { ApiError } from '@/types/common';
import toast from 'react-hot-toast';

const EMPTY_PRODUCT_STATUS_CODES = new Set(['00005', '20001', '30001']);

const isEmptyProductResponse = (statusCode?: string) => (
  Boolean(statusCode && EMPTY_PRODUCT_STATUS_CODES.has(statusCode))
);

const isEmptyProductError = (error: unknown) => {
  const apiError = error as ApiError;
  return apiError?.status === 404 || isEmptyProductResponse(apiError?.statusCode);
};

const getProductErrorMessage = (error: unknown) => (
  error instanceof Error ? error.message : '網路連線失敗，請檢查網路連線後再試'
);

export const useProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleProductStatusCode = useCallback((statusCode: string, defaultMessage: string) => {
    switch (statusCode) {
      case '00000': return null;
      case '00001': return '操作失敗';
      case '00002': return '輸入格式錯誤';
      
      case '00003': 
      case '00004': 
      case '10004': 
      case '10005': 
        logout();
        navigate('/');
        return null;
      case '00005': return '資源不存在';
      case '00006': return '伺服器錯誤';
      case '20001': return '找不到商品';
      case '20002': return '商品庫存不足';
      case '20007': return '商品已存在';
      case '20008': return '新增商品失敗';
      case '30001': return '查無資料';
      case '30002': return '查詢被拒絕';
      
      default:
        return defaultMessage || `商品操作錯誤 (${statusCode})`;
    }
  }, [logout, navigate]);

  //賣家上架商品
  const addProduct = async (data: AddProductPayload) => {
    if (!token) return null;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await productService.addProduct(data, token);
      const responsePayload = res?.data ?? res;
      const code = responsePayload?.status_code;
      if (code === '00000') {
        setSuccess(true);
        toast.success('商品上架成功！');
        return mapProductActionToProductItem(res.data);
      } else {
        setError(handleProductStatusCode(code, responsePayload?.message || ''));
        return null;
      }
    } catch (err) {
      console.error(err);
      setError('網路連線失敗，請檢查網路連線後再試');
      return null;
    } finally {
      setLoading(false);
    }
  };

  //賣家增加商品種類
  const addProductType = async (pid: string, data: AddTypePayload) => {
    if (!token) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await productService.addProductType(pid, data, token);
      const responsePayload = res?.data ?? res;
      const code = responsePayload?.status_code;
      if (code === '00000') {
        toast.success('商品種類新增成功！');
        return mapProductActionToProductItem(res.data);
      } else {
        setError(handleProductStatusCode(code, responsePayload?.message || ''));
        return null;
      }
    } catch (err) {
      console.error(err);
      setError('網路連線失敗，請檢查網路連線後再試');
      return null;
    } finally {
      setLoading(false);
    }
  };

  //賣家編輯商品基本名稱
  const editProductBase = async (pid: string, name: string) => {
    if (!token) return false;
    setLoading(true);
    setError(null);
    try {
      const res = await productService.editProductBase(pid, name, token);
      const responsePayload = res?.data ?? res;
      const code = responsePayload?.status_code;
      if (code === '00000') {
        toast.success('商品名稱更新成功！');
        return true;
      } else {
        setError(handleProductStatusCode(code, responsePayload?.message || ''));
        return false;
      }
    } catch (err) {
      console.error(err);
      setError('網路連線失敗，請檢查網路連線後再試');
      return false;
    } finally {
      setLoading(false);
    }
  };

  //賣家更新商品種類詳細資料
  const updateProductType = async (uuid: string, data: AddTypePayload) => {
    if (!token) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await productService.updateProductType(uuid, data, token);
      const responsePayload = res?.data ?? res;
      const code = responsePayload?.status_code;
      if (code === '00000') {
        toast.success('商品類型更新成功！');
        return mapProductActionToProductItem(res.data);
      } else {
        setError(handleProductStatusCode(code, responsePayload?.message || ''));
        return null;
      }
    } catch (err) {
      console.error(err);
      setError('網路連線失敗，請檢查網路連線後再試');
      return null;
    } finally {
      setLoading(false);
    }
  };

  //賣家刪除完整商品
  const deleteProduct = async (pid: string) => {
    if (!token) return false;
    if (!window.confirm('確定要永久刪除此項商品嗎？這將會連帶移除所有種類。')) return false;
    setLoading(true);
    try {
      const res = await productService.deleteProduct(pid, token);
      const responsePayload = res?.data ?? res;
      const code = responsePayload?.status_code;
      if (code === '00000') {
        toast.success('商品已成功刪除！');
        return true;
      } else {
        toast.error(handleProductStatusCode(code, responsePayload?.message || '') || '刪除失敗');
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error('網路連線失敗，請檢查網路連線後再試');
      return false;
    } finally {
      setLoading(false);
    }
  };

  //賣家刪除單一商品類型
  const deleteProductType = async (uuid: string) => {
    if (!token) return false;
    if (!window.confirm('確定要刪除這個商品款式類型嗎？')) return false;
    setLoading(true);
    try {
      const res = await productService.deleteProductType(uuid, token);
      const responsePayload = res?.data ?? res;
      const code = responsePayload?.status_code;
      if (code === '00000') {
        toast.success('款式類型已成功刪除！');
        return true;
      } else {
        toast.error(handleProductStatusCode(code, responsePayload?.message || '') || '刪除失敗');
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error('網路連線失敗，請檢查網路連線後再試');
      return false;
    } finally {
      setLoading(false);
    }
  };

  //查看單一商品詳情
  const getProduct = useCallback(async (pid: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getProduct(pid, token || undefined);
      const responsePayload = res?.data ?? res;
      const code = responsePayload?.status_code;
      if (code === '00000') {
        return (res.data.product ?? []).map(mapProductDtoToProductItem);
      } else if (isEmptyProductResponse(code)) {
        return [];
      } else {
        setError(handleProductStatusCode(code, responsePayload?.message || ''));
        return null;
      }
    } catch (err) {
      if (isEmptyProductError(err)) {
        return [];
      }
      console.error(err);
      setError(getProductErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleProductStatusCode, token]);

  //列出目前登入使用者的專屬商品清單
  const getMyProducts = useCallback(async () => {
    if (!token) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getMyProducts(token);
      const responsePayload = res?.data ?? res;
      const code = responsePayload?.status_code;
      if (code === '00000') {
        return (res.data.product ?? []).map(mapProductDtoToProductItem);
      } else if (isEmptyProductResponse(code)) {
        return [];
      } else {
        setError(handleProductStatusCode(code, responsePayload?.message || ''));
        return null;
      }
    } catch (err) {
      if (isEmptyProductError(err)) {
        return [];
      }
      console.error(err);
      setError(getProductErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleProductStatusCode, token]);

  //列出所有可購買商品，未登入也可使用
  const getPublicProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getPublicProducts();
      const responsePayload = res?.data ?? res;
      const code = responsePayload?.status_code;
      if (code === '00000') {
        return (res.data.product ?? []).map(mapProductDtoToProductItem);
      } else if (isEmptyProductResponse(code)) {
        return [];
      } else {
        setError(handleProductStatusCode(code, responsePayload?.message || ''));
        return null;
      }
    } catch (err) {
      if (isEmptyProductError(err)) {
        return [];
      }
      console.error(err);
      setError(getProductErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleProductStatusCode]);

  return {
    loading,
    error,
    success,
    addProduct,
    addProductType,
    editProductBase,
    updateProductType,
    deleteProduct,
    deleteProductType,
    getProduct,
    getMyProducts,
    getPublicProducts,
  };
};
