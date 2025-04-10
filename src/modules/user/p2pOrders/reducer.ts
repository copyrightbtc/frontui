import { CommonError } from "../../types";
import { P2POrdersAction } from "./actions";
import { P2PORDERS_DATA, P2PORDERS_ERROR, P2PORDERS_FETCH, P2PORDERS_ALERT_DELETE } from "./constants";
import { P2POrder } from "./types";

export interface P2POrdersState {
    fetch: {
        data: P2POrder[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
        page: number;
        nextPageExists: boolean;
    };
    alertsList: {
        list: P2POrder[];
    };
}

const initialState: P2POrdersState = {
    fetch: {
        data: [],
        fetching: false,
        success: false,
        page: 1,
        nextPageExists: false,
    },
    alertsList: {
        list: [],
    },
};

export const p2pOrdersFetchReducer = (state: P2POrdersState['fetch'], action: P2POrdersAction) => {
    switch (action.type) {
        case P2PORDERS_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2PORDERS_DATA:
            return {
                ...state,
                data: action.payload.list,
                fetching: false,
                success: true,
                error: undefined,
                page: action.payload.page,
                nextPageExists: action.payload.nextPageExists,
            };
        case P2PORDERS_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        case P2PORDERS_ALERT_DELETE:
            return {
                ...state,
                alertsList: action.payload,
            };
        default:
            return state;
    }
};


export const p2pOrdersReducer = (state = initialState, action: P2POrdersAction) => {
    switch (action.type) {
        case P2PORDERS_FETCH:
        case P2PORDERS_DATA:
        case P2PORDERS_ERROR:
        case P2PORDERS_ALERT_DELETE:
            const p2pOrdersFetchState = { ...state.fetch };

            return {
                ...state,
                fetch: p2pOrdersFetchReducer(p2pOrdersFetchState, action),
            };
        default:
            return state;
    }
};
