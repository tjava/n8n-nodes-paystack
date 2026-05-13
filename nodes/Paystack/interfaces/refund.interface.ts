/** Body for POST /refund */
export interface CreateRefundBody {
  /** Transaction ID or reference to refund (required) */
  transaction: string;
  /** Amount to refund in subunit — defaults to full transaction amount */
  amount?: number;
  /** Currency code */
  currency?: string;
  /** Note from the customer */
  customer_note?: string;
  /** Note from the merchant */
  merchant_note?: string;
}

/** Refund object returned by the API */
export interface Refund {
  id: number;
  domain: string;
  transaction: number;
  dispute: unknown | null;
  integration: number;
  deducted_amount: number | null;
  channel: string | null;
  fully_deducted: boolean;
  amount: number;
  currency: string;
  status: string;
  refunded_at: string | null;
  refunded_by: string;
  customer_note: string;
  merchant_note: string;
  created_at: string;
  updated_at: string;
}

/** Query parameters for GET /refund */
export interface ListRefundsQuery {
  reference?: string;
  currency?: string;
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
}
