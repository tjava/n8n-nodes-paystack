/** Body for POST /plan */
export interface CreatePlanBody {
  /** Name of the plan (required) */
  name: string;
  /** Amount in subunit of currency (required) */
  amount: number;
  /** Billing interval (required) */
  interval: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually';
  /** Description of the plan */
  description?: string;
  /** Currency code, e.g. NGN */
  currency?: string;
  /** How many invoices to raise before stopping */
  invoice_limit?: number;
  /** Whether to send SMS to the customer on subscription */
  send_sms?: boolean;
}

/** Plan object returned by the API */
export interface Plan {
  id: number;
  name: string;
  plan_code: string;
  description: string | null;
  amount: number;
  interval: string;
  currency: string;
  invoice_limit: number;
  send_invoices: boolean;
  send_sms: boolean;
  hosted_page: boolean;
  hosted_page_url: string | null;
  hosted_page_summary: string | null;
  domain: string;
  integration: number;
  is_deleted: boolean;
  is_archived: boolean;
  total_subscriptions: number;
  active_subscriptions: number;
  total_subscriptions_revenue: number;
  createdAt: string;
  updatedAt: string;
}

/** Query params for GET /plan */
export interface ListPlansQuery {
  perPage?: number;
  page?: number;
  interval?: string;
  amount?: number;
}
