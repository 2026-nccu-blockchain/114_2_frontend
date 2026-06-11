import { apiRequest } from '@/services/api';

export interface UploadResponse {
  status_code: string;
  message: string;
  datetime: string;
  url?: string;
}

export const uploadService = {
  /**
   * 上傳單張圖片到雲端伺服器
   * @param file 檔案二進位物件
   * @param email 當前登入使用者的帳號（嚴格對齊規格書 Essential 要求）
   * @param token 權限憑證
   */
  uploadImage: (file: File, _email: string, token: string) => {
    const formData = new FormData();
    formData.append('image', file);

    return apiRequest<UploadResponse>('/api/v2/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    });
  },
};
