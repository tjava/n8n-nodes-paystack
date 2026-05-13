/** Body for POST /transaction/initialize */
export interface InitializeTransactionBody {
  /** Customer email address (required) */
  email: string;
  /** Amount in the subunit of the currency, e.g. kobo for NGN (required) */
  amount: number;
  /** Unique transaction reference (optional — Paystack generates one if omitted) */
  reference?: string;
  /** Fully qualified URL to redirect the customer after payment */
  callback_url?: string;
  /** Currency code, e.g. NGN, GHS, USD */
  currency?: string;
  /** Payment channels to enable, e.g. ['card', 'bank', 'ussd'] */
  channels?: string[];
  /** Plan code to create a subscription for the customer */
  plan?: string;
  /** Overrides the invoice email for Paystack invoice */
  invoice_limit?: number;
  /** Additional key-value metadata */
  metadata?: Record<string, unknown>;
}

/** Data portion of the initialize transaction response */
export interface InitializeTransactionData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

/** Full transaction object as returned by verify / fetch / list */
export interface Transaction {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string | null;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: unknown;
  fees: number | null;
  customer: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    customer_code: string;
    phone: string | null;
    metadata: unknown;
    risk_action: string;
  };
  authorization: {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name: string | null;
  } | null;
  plan: unknown;
  split: unknown;
  subaccount: unknown;
}

/** Query parameters for GET /transaction */
export interface ListTransactionsQuery {
  perPage?: number;
  page?: number;
  customer?: string;
  status?: 'abandoned' | 'failed' | 'success';
  from?: string;
  to?: string;
  amount?: number;
}
