export interface P2PTrade {
    coin_currency: string;
    fiat_currency: string;
    maker: P2PTradeUser;
    tid: string;
    taker: P2PTradeUser;
    price: string;
    amount: string;
    maker_accepted: boolean;
    taker_accepted: boolean;
    maker_seen: boolean;
    taker_seen: boolean;
    maker_sent_feedback: boolean;
    taker_sent_feedback: boolean;
    paytime: number;
    payment: P2PTradePayment;
    state: string;
    side: string;
    complain: Complain;
    created_at: string;
    updated_at: string;
    completed_at: string;
}

export interface Complain {
    id: number;
    message: string;
}

export interface P2PTradeModel {
    coin_currency: string;
    fiat_currency: string;
    maker: P2PTradeUser;
    tid: number;
    taker: P2PTradeUser;
    price: string;
    amount: string;
    maker_accepted_at: string | null;
    taker_accepted_at: string | null;
    maker_seen_at: string | null;
    taker_seen_at: string | null;
    paytime: number;
    payment: P2PTradePayment;
    state: string;
    side: string;
    created_at: string;
    updated_at: string;
    completed_at: string;
}

export interface P2PTradeUser {
    uid: string;
    username: string;
}

export interface P2PTradePayment {
    id: number;
    member_id: number;
    payment_type: string;
    state: string;
    account_name: string;
    data: Record<string, string>
    created_at: string;
    updated_at: string;
}

export interface P2PTradeCreate {
    payment: number;
    price: number;
    amount: number;
    advertisement: number;
}