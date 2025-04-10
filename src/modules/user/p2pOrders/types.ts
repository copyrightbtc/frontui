export interface P2POrder {
  coin_currency: string;
  fiat_currency: string;
  maker: P2POrderUser;
  tid: number;
  taker: P2POrderUser;
  price: string;
  amount: string;
  maker_accepted: boolean;
  taker_accepted: boolean;
  maker_seen: boolean;
  taker_seen: boolean;
  paytime: number;
  payment: P2POrderPayment;
  state: string;
  side: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
}

export interface P2POrderUser {
  uid: string;
  username: string | null;
}

export interface P2POrderPayment {
  id: number;
  member_id: number;
  payment_type: string;
  state: string;
  account_name: string;
  data: Record<string, string>
  created_at: string;
  updated_at: string;
}