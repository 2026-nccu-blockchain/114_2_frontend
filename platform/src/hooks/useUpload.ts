import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { uploadService } from '@/services/uploadService';
import toast from 'react-hot-toast';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { token } = useAuthStore();
  const handleUploadStatusCode = (statusCode: string, defaultMessage: string) => {
    switch (statusCode) {
      case '00000': return null;
      case '00001': return '圖片上傳失敗，請稍後再試';
      case '00002': return '上傳參數格式錯誤';
      case '00003': return '登入憑證已失效，請重新登入';
      case '00004': return '無權限執行此操作';
      case '00006': return '伺服器儲存空間異常';
      case '40001': return '您選擇的檔案不是合法的圖片格式'; 
      default:
        return defaultMessage || `上傳發生錯誤 (${statusCode})`;
    }
  };

  const upload = async (file: File, email: string): Promise<string | null> => {
    if (!token) {
      toast.error('未登入，無法上傳圖片');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('檔案太大，請上傳小於 5MB 的圖片');
      return null;
    }

    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file, email, token);
      const code = res?.data?.status_code;

      if (code === '00000' && res.data.url) {
        toast.success('圖片上傳成功！');
        return res.data.url;
      } else {
        const errorMsg = handleUploadStatusCode(code, res?.data?.message || '');
        toast.error(errorMsg || '上傳失敗');
        return null;
      }
    } catch (err) {
      toast.error('網路連線失敗，無法連接上傳伺服器');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
};