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

type ApiEnvelope = {
  status_code?: string;
  message?: string;
};

const API_BASE_URL = import.meta.env['VITE_API_URL'] || '/api/v2';

const buildUrl = (url: string) => {
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith('/api/')) return url;

  const normalizedBase = API_BASE_URL.replace(/\/$/, '');
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${normalizedBase}${normalizedPath}`;
};

const buildError = async (response: Response): Promise<ApiError> => {
  try {
    const data = await response.json();
    return {
      message: getApiStatusMessage(data?.status_code, data?.message || response.statusText),
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

  const response = await fetch(buildUrl(url), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw await buildError(response);
  }

  const data = (await response.json()) as T;
  const envelope = data as ApiEnvelope;

  if (envelope.status_code && envelope.status_code !== '00000') {
    throw {
      message: getApiStatusMessage(envelope.status_code, envelope.message || 'Request failed'),
      statusCode: envelope.status_code,
    } satisfies ApiError;
  }

  return { data };
};
