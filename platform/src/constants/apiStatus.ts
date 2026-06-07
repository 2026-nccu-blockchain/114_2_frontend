export const apiStatusMessages: Record<string, string> = {
  '00000': '',
  '00001': '操作失敗，請稍後再試',
  '00002': '輸入格式錯誤',
  '00003': '尚未登入，請重新登入',
  '00004': '無權限執行此操作',
  '00005': '找不到資料',
  '00006': '伺服器發生錯誤，請稍後再試',

  '10001': '找不到資料',
  '10004': '登入憑證無效，請重新登入',
  '10005': '登入已過期，請重新登入',
  '10008': '權限不足',

  '20001': '找不到商品',
  '20002': '商品庫存不足',
  '20003': '此商品目前無法購買',
  '20011': '購物車內沒有商品',

  '30001': '查無資料',
  '30002': '查詢被拒絕',
};

export const getApiStatusMessage = (
  statusCode?: string,
  defaultMessage = '操作發生錯誤，請稍後再試',
) => {
  if (!statusCode) return defaultMessage;

  return apiStatusMessages[statusCode] || `${defaultMessage} (${statusCode})`;
};
