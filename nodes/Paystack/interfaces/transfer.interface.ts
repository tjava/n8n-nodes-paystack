/** Recipient type for POST /transferrecipient */
export type TransferRecipientType =
  | "nuban"
  | "mobile_money"
  | "basa"
  | "ghipss";

/** Body for POST /transferrecipient */
export interface CreateTransferRecipientBody {
  /** Type of recipient account (required) */
  type: TransferRecipientType;
  /** Recipient full name (required) */
  name: string;
  /** Recipient account number (required) */
  account_number: string;
  /** Bank code — obtain from GET /bank (required for nuban/basa) */
  bank_code: string;
  /** Currency code, e.g. NGN */
  currency?: string;
  /** Description / narration */
  description?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/** Recipient object returned by API */
export interface TransferRecipient {
  active: boolean;
  createdAt: string;
  currency: string;
  description: string;
  domain: string;
  email: string | null;
  id: number;
  integration: number;
  metadata: unknown;
  name: string;
  recipient_code: string;
  type: string;
  updatedAt: string;
  is_deleted: boolean;
  details: {
    authorization_code: string | null;
    account_number: string;
    account_name: string;
    bank_code: string;
    bank_name: string;
  };
}

/** Body for POST /transfer (initiate) */
export interface InitiateTransferBody {
  /** Source of funds — currently only 'balance' is supported */
  source: "balance";
  /** Amount in subunit (required) */
  amount: number;
  /** Recipient code from create recipient (required) */
  recipient: string;
  /** Description / narration */
  reason?: string;
  /** Currency code */
  currency?: string;
  /** Unique transfer reference */
  reference?: string;
}

/** Body for POST /transfer/finalize_transfer */
export interface FinalizeTransferBody {
  /** Transfer code from initiate step (required) */
  transfer_code: string;
  /** OTP sent to business phone/email (required) */
  otp: string;
}

/** Transfer object returned by the API */
export interface Transfer {
  id: number;
  domain: string;
  amount: number;
  currency: string;
  reference: string;
  source: string;
  source_details: unknown | null;
  reason: string;
  status: string;
  failures: unknown | null;
  transfer_code: string;
  titan_code: string | null;
  transferred_at: string | null;
  integration: number;
  recipient: TransferRecipient;
  session: { provider: unknown; id: unknown };
  createdAt: string;
  updatedAt: string;
}

/** Query params for GET /transfer */
export interface ListTransfersQuery {
  perPage?: number;
  page?: number;
  customer?: string;
  from?: string;
  to?: string;
}
