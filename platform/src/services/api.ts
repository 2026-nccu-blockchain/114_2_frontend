import type { ApiError, ApiResponse } from '@/types/common';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: unknown;
};

const buildError = async (response: Response): Promise<ApiError> => {
  try {
    const data = await response.json();
    return { message: data?.message || response.statusText, status: response.status };
  } catch {
    return { message: response.statusText, status: response.status };
  }
};

export const apiRequest = async <T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => {
  const { method = 'GET', headers, body } = options;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw await buildError(response);
  }

  const data = (await response.json()) as T;
  return { data };
};
