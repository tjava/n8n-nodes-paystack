/** Generic Paystack API response envelope */
export interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

/** Pagination metadata returned by list endpoints */
export interface PaginationMeta {
  total: number;
  skipped: number;
  perPage: number;
  page: number;
  pageCount: number;
  next?: string;
  previous?: string;
}

/** Common query parameters for paginated list endpoints */
export interface ListQueryParams {
  perPage?: number;
  page?: number;
  from?: string;
  to?: string;
}
