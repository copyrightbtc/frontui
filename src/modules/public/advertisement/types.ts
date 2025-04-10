import { Payment } from "../../user/payments/types";

export interface Advertisement {
    id: number;
    coin_currency: string;
    fiat_currency: string;
    price: string;
    amount: string;
    state: string;
    min_amount: string;
    max_amount: string;
    side: string;
    paytime: number;
    description?: string;
    payments: Payment[];
    advertiser: Advertiser;
  }
  
  export interface Advertiser {
    uid: string;
    username: string;
    trades_count_30d: number;
    success_rate_30d: number;
    positive_feedback_count: number;
    negative_feedback_count: number;
  }
  
  export interface AdvertisementFilter {
    page?: number;
    limit?: number;
    coin_currency?: string;
    fiat_currency?: string;
    side: string;
    states?: string;
    order_by?: string;
    ordering?: "asc" | "desc";
    uid?: string;
  }