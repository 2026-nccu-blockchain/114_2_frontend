import Cookies from 'js-cookie';
import { getApiStatusMessage } from '@/constants/apiStatus';
import type { ApiError, ApiResponse } from '@/types/common';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: unknown;
  auth?: boolean;
};

const API_BASE_URL = import.meta.env['VITE_API_URL'] || '/api/v2';

const buildUrl = (url: string) => {
  if (/^https?:\/\//.test(url)) return url;

  const normalizedBase = API_BASE_URL.replace(/\/$/, '');
  const normalizedPath = url
    .replace(/^\/api\/v\d+/, '')
    .replace(/^\/*/, '/');

  return `${normalizedBase}${normalizedPath}`;
};

const buildError = async (response: Response): Promise<ApiError> => {
  try {
    const data = await response.json();
    const validationMessage = Array.isArray(data?.detail)
      ? data.detail
          .map((issue: { loc?: Array<string | number>; msg?: string }) => {
            const field = issue.loc?.filter((part) => part !== 'body').join('.');
            return [field, issue.msg].filter(Boolean).join(': ');
          })
          .join('; ')
      : typeof data?.detail === 'string'
        ? data.detail
        : undefined;
    const fallbackMessage = data?.message || data?.desc || validationMessage || response.statusText;

    return {
      message: data?.status_code
        ? getApiStatusMessage(data.status_code, fallbackMessage)
        : fallbackMessage,
      status: response.status,
      statusCode: data?.status_code,
    };
  } catch {
    return { message: response.statusText, status: response.status };
  }
};

export const apiRequest = async <T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => {
  const { method = 'GET', headers, body, auth = true } = options;
  const token = auth ? Cookies.get('token') : null;
  const isFormData = body instanceof FormData;

  const response = await fetch(buildUrl(url), {
    method,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (!response.ok) {
    throw await buildError(response);
  }

  const data = (await response.json()) as T;
  return { data };
};
