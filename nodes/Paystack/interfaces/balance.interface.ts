/** Single balance item returned by GET /balance */
export interface BalanceItem {
  currency: string;
  balance: number;
}

/** Bank object returned by GET /bank */
export interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Query params for GET /bank */
export interface ListBanksQuery {
  country?: string;
  use_cursor?: boolean;
  perPage?: number;
  pay_with_bank?: boolean;
  cursor?: string;
  gateway?: string;
}

/** Data returned by GET /bank/resolve */
export interface ResolvedAccount {
  account_number: string;
  account_name: string;
  bank_id: number;
}
