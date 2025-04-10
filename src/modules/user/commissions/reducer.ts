import { CommonError } from "../../types";
import { CommissionsAction } from "./actions";
import { COMMISSIONS_DATA, COMMISSIONS_DATA_UPDATE, COMMISSIONS_ERROR, COMMISSIONS_FETCH } from "./constants";
import { Commission } from "./types";

export interface CommissionsState {
    fetch: {
        data: Commission[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
        page: number;
        nextPageExists: boolean;
    };
}

const initialState: CommissionsState = {
    fetch: {
        data: [],
        fetching: false,
        success: false,
        page: 1,
        nextPageExists: false,
    },
};

export const commissionsFetchReducer = (state: CommissionsState['fetch'], action: CommissionsAction) => {
    switch (action.type) {
        case COMMISSIONS_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case COMMISSIONS_DATA:
            return {
                ...state,
                data: action.payload.list,
                fetching: false,
                success: true,
                error: undefined,
                page: action.payload.page,
                nextPageExists: action.payload.nextPageExists,
            };
        case COMMISSIONS_ERROR:
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

export const commissionsReducer = (state = initialState, action: CommissionsAction) => {
    switch (action.type) {
        case COMMISSIONS_FETCH:
        case COMMISSIONS_DATA:
        case COMMISSIONS_DATA_UPDATE:
        case COMMISSIONS_ERROR:
            const commissionsFetchState = { ...state.fetch };

            return {
                ...state,
                fetch: commissionsFetchReducer(commissionsFetchState, action),
            };
        default:
            return state;
    }
};
