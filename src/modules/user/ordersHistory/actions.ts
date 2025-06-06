import { Market } from '../../public/markets';
import { CommonError, OrderCommon, OrderEvent } from '../../types';
import {
    ORDERS_CANCEL_ALL_DATA,
    ORDERS_CANCEL_ALL_ERROR,
    ORDERS_CANCEL_ALL_FETCH,
    ORDERS_HISTORY_CANCEL_DATA,
    ORDERS_HISTORY_CANCEL_ERROR,
    ORDERS_HISTORY_CANCEL_FETCH,
    ORDERS_HISTORY_DATA,
    ORDERS_HISTORY_ERROR,
    ORDERS_HISTORY_FETCH,
    ORDERS_HISTORY_RANGER_DATA,
    ORDERS_HISTORY_RESET,
    ORDERS_TEST_HISTORY_STATE,
} from './constants';


interface UserOrdersHistoryFetchPayload {
    pageIndex: number;
    limit: number;
    type: string;
    state?: any;
    side?: any;
    market?: any,
    markets?: Market,
    ord_type?: any,
    time_from?: any,
    time_to?: any,
}

export interface UserOrdersHistoryDataPayload {
    list: OrderCommon[];
    pageIndex: number;
    nextPageExists: boolean;
}

export interface UserOrdersHistoryFetch {
    type: typeof ORDERS_HISTORY_FETCH;
    payload: UserOrdersHistoryFetchPayload;
}

export interface UserOrdersHistoryData {
    type: typeof ORDERS_HISTORY_DATA;
    payload: UserOrdersHistoryDataPayload;
}

export interface UserOrdersHistoryRangerData {
    type: typeof ORDERS_HISTORY_RANGER_DATA;
    payload: OrderEvent;
}

export interface UserOrdersHistoryError {
    type: typeof ORDERS_HISTORY_ERROR;
    error: CommonError;
}

export interface TestOrdersHistoryState {
    type: typeof ORDERS_TEST_HISTORY_STATE;
}

export interface OrdersCancelAllFetch {
    type: typeof ORDERS_CANCEL_ALL_FETCH;
    payload?: {
        market: string;
    };
}

export interface OrdersCancelAllData {
    type: typeof ORDERS_CANCEL_ALL_DATA;
}

export interface OrdersCancelAllError {
    type: typeof ORDERS_CANCEL_ALL_ERROR;
    error: CommonError;
}

export interface OrdersHistoryCancelFetch {
    type: typeof ORDERS_HISTORY_CANCEL_FETCH;
    payload: {
        id: string | number;
        type: string;
        list: OrderCommon[];
    };
}

export interface OrdersHistoryCancelData {
    type: typeof ORDERS_HISTORY_CANCEL_DATA;
    payload: OrderCommon[];
}

export interface OrdersHistoryCancelError {
    type: typeof ORDERS_HISTORY_CANCEL_ERROR;
    error: CommonError;
}

export interface OrdersHistoryReset {
    type: typeof ORDERS_HISTORY_RESET;
}

export type OrdersHistoryAction =
    UserOrdersHistoryFetch
    | UserOrdersHistoryData
    | UserOrdersHistoryRangerData
    | UserOrdersHistoryError
    | TestOrdersHistoryState
    | OrdersCancelAllFetch
    | OrdersCancelAllData
    | OrdersCancelAllError
    | OrdersHistoryCancelFetch
    | OrdersHistoryCancelData
    | OrdersHistoryCancelError
    | OrdersHistoryReset;


export const userOrdersHistoryFetch = (payload: UserOrdersHistoryFetchPayload): UserOrdersHistoryFetch => ({
    type: ORDERS_HISTORY_FETCH,
    payload,
});

export const userOrdersHistoryData = (payload: UserOrdersHistoryDataPayload): UserOrdersHistoryData => ({
    type: ORDERS_HISTORY_DATA,
    payload,
});

export const userOrdersHistoryRangerData = (payload: OrderEvent): UserOrdersHistoryRangerData => ({
    type: ORDERS_HISTORY_RANGER_DATA,
    payload,
});

export const userOrdersHistoryError = (error: CommonError): UserOrdersHistoryError => ({
    type: ORDERS_HISTORY_ERROR,
    error,
});

export const ordersCancelAllFetch = (payload?: OrdersCancelAllFetch['payload']): OrdersCancelAllFetch => ({
    type: ORDERS_CANCEL_ALL_FETCH,
    payload,
});

export const ordersCancelAllData = (): OrdersCancelAllData => ({
    type: ORDERS_CANCEL_ALL_DATA,
});

export const ordersCancelAllError = (error: CommonError): OrdersCancelAllError => ({
    type: ORDERS_CANCEL_ALL_ERROR,
    error,
});

export const ordersHistoryCancelFetch = (payload: OrdersHistoryCancelFetch['payload']): OrdersHistoryCancelFetch => ({
    type: ORDERS_HISTORY_CANCEL_FETCH,
    payload,
});

export const ordersHistoryCancelData = (payload: OrdersHistoryCancelData['payload']): OrdersHistoryCancelData => ({
    type: ORDERS_HISTORY_CANCEL_DATA,
    payload,
});

export const ordersHistoryCancelError = (error: CommonError): OrdersHistoryCancelError => ({
    type: ORDERS_HISTORY_CANCEL_ERROR,
    error,
});

export const resetOrdersHistory = (): OrdersHistoryReset => ({
    type: ORDERS_HISTORY_RESET,
});
