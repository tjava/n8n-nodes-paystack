/** Body for POST /subscription */
export interface CreateSubscriptionBody {
  /** Customer email or customer_code (required) */
  customer: string;
  /** Plan code (required) */
  plan: string;
  /** Authorization code to use — if the customer has multiple, uses most recent if omitted */
  authorization?: string;
  /** ISO 8601 start date, e.g. 2024-01-15T00:00:00+01:00 */
  start_date?: string;
}

/** Body for POST /subscription/disable */
export interface DisableSubscriptionBody {
  /** Subscription code, e.g. SUB_xxxx (required) */
  code: string;
  /** Email token associated with the subscription (required) */
  token: string;
}

/** Subscription object returned by the API */
export interface Subscription {
  id: number;
  domain: string;
  status: string;
  subscription_code: string;
  email_token: string;
  amount: number;
  cron_expression: string;
  next_payment_date: string;
  open_invoice: string | null;
  plan: {
    id: number;
    name: string;
    plan_code: string;
    interval: string;
    amount: number;
    currency: string;
  };
  authorization: {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
  };
  customer: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    customer_code: string;
    phone: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

/** Query params for GET /subscription */
export interface ListSubscriptionsQuery {
  perPage?: number;
  page?: number;
  customer?: string;
  plan?: string;
}
