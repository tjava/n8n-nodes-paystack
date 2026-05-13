/** Body for POST /customer */
export interface CreateCustomerBody {
  /** Customer email address (required) */
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

/** Body for PUT /customer/:customer_code */
export interface UpdateCustomerBody {
  first_name?: string;
  last_name?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

/** Customer object as returned by the API */
export interface Customer {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  customer_code: string;
  phone: string | null;
  metadata: unknown;
  risk_action: string;
  international_format_phone: string | null;
  identified: boolean;
  identifications: unknown[] | null;
  domain: string;
  integration: number;
  createdAt: string;
  updatedAt: string;
}
