export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
