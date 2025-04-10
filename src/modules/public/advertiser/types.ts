
  export interface Advertiser {
    uid: string;
    username: string;
    trades_count_30d: number;
    success_rate_30d: number;
    positive_feedback_count: number;
    negative_feedback_count: number;
    total_sell_trades_count?: number;
    total_buy_trades_count?: number;
    first_trade_at?: string;
  }
  
  export interface AdvertiserFeedback {
    rate: "positive" | "negative";
    message: string;
    created_at: string;
    username: string;
    uid: string;
  }

  export interface FeedbackFilter {
    uid: string;
    page: number;
    limit: number;
  }