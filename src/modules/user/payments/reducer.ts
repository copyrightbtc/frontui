import { CommonError } from "../../types";
import { PaymentsAction } from "./actions";
import { PAYMENTS_ADD_DATA, PAYMENTS_ADD_ERROR, PAYMENTS_ADD_FETCH, PAYMENTS_DATA, PAYMENTS_DELETE_DATA, PAYMENTS_DELETE_ERROR, PAYMENTS_DELETE_FETCH, PAYMENTS_ERROR, PAYMENTS_FETCH } from "./constants";
import { Payment } from "./types";

export interface PaymentsState {
    fetch: {
        data: Payment[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
        page: number;
        nextPageExists: boolean;
    };
    add: {
        success?: boolean;
        error?: CommonError;
    };
    delete: {
        success?: boolean;
        error?: CommonError;
    };
}

const initialState: PaymentsState = {
    fetch: {
        data: [],
        fetching: false,
        success: false,
        page: 1,
        nextPageExists: false,
    },
    add: {
        success: false,
    },
    delete: {
        success: false,
    }
};

const paymentsAddFetchReducer = (state: PaymentsState['add'], action: PaymentsAction) => {
    switch (action.type) {
        case PAYMENTS_ADD_FETCH:
            return {
                ...state,
                success: false,
                error: undefined,
            };
        case PAYMENTS_ADD_DATA:
            return {
                ...state,
                success: true,
                error: undefined,
            };
        case PAYMENTS_ADD_ERROR:
            return  {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};

const paymentsDeleteFetchReducer = (state: PaymentsState['delete'], action: PaymentsAction) => {
    switch (action.type) {
        case PAYMENTS_DELETE_FETCH:
            return {
                ...state,
                success: false,
                error: undefined,
            };
        case PAYMENTS_DELETE_DATA:
            return {
                ...state,
                success: true,
                error: undefined,
            };
        case PAYMENTS_DELETE_ERROR:
            return  {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};

export const paymentsFetchReducer = (state: PaymentsState['fetch'], action: PaymentsAction) => {
    switch (action.type) {
        case PAYMENTS_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case PAYMENTS_DATA:
            return {
                ...state,
                data: action.payload.list,
                fetching: false,
                success: true,
                error: undefined,
                page: action.payload.page,
                nextPageExists: action.payload.nextPageExists,
            };
        case PAYMENTS_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const paymentsReducer = (state = initialState, action: PaymentsAction) => {
    switch (action.type) {
        case PAYMENTS_FETCH:
        case PAYMENTS_DATA:
        case PAYMENTS_ERROR:
            const paymentsFetchState = { ...state.fetch };

            return {
                ...state,
                fetch: paymentsFetchReducer(paymentsFetchState, action),
            };
        case PAYMENTS_ADD_FETCH:
        case PAYMENTS_ADD_DATA:
        case PAYMENTS_ADD_ERROR:
            const paymentsAddFetchState = { ...state.add };

            return {
                ...state,
                add: paymentsAddFetchReducer(paymentsAddFetchState, action),
            };
        case PAYMENTS_DELETE_FETCH:
        case PAYMENTS_DELETE_DATA:
        case PAYMENTS_DELETE_ERROR:
            const paymentsDeleteFetchState = { ...state.delete };

            return {
                ...state,
                delete: paymentsDeleteFetchReducer(paymentsDeleteFetchState, action),
            };
        default:
            return state;
    }
};
