import { Payment } from "../../user/payments/types";

export interface P2PAdvertisement {
    id: number;
    coin_currency: string;
    fiat_currency: string;
    price: string;
    amount: string;
    min_amount: string;
    max_amount: string;
    lock_trade_amount: number;
    state: string;
    side: string;
    paytime: number;
    description?: string;
    payments?: Payment[];
    created_at: string;
    updated_at: string;
}

export interface P2PAdvertisementCreateRequest {
    side: "sell" | "buy";
    coin_currency: string;
    fiat_currency: string;
    price: number;
    amount: number;
    min_amount: number;
    max_amount: number;
    paytime: number;
    payment_methods: number[];
    description?: string;
}

export interface P2PAdvertisementUpdateRequest {
    id: number;
    min_amount?: number;
    max_amount?: number;
    description?: string;
    paytime?: number;
}

export interface P2PAdvertisementStateChangeRequest {
    id: number;
    action: "enable" | "disable";
}

export interface P2PAdvertisementPriceChangeRequest {
    id: number;
    price: number;
}

export interface P2PAdvertisementAmountChangeRequest {
    id: number;
    amount: number;
    type: "sub" | "plus";
}
