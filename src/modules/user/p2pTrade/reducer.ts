import { CommonError } from "../../types";
import { P2PTradeAction } from "./actions";
import { P2PTRADE_APPROVE_DATA, P2PTRADE_APPROVE_ERROR, P2PTRADE_APPROVE_FETCH, P2PTRADE_CANCEL_DATA, P2PTRADE_CANCEL_ERROR, P2PTRADE_CANCEL_FETCH, P2PTRADE_COMPLAIN_DATA, P2PTRADE_COMPLAIN_ERROR, P2PTRADE_COMPLAIN_FETCH, P2PTRADE_CREATE_FETCH, P2PTRADE_CREATE_FINISH, P2PTRADE_CREATE_HANDLE_FINISH, P2PTRADE_DATA, P2PTRADE_ERROR, P2PTRADE_FEEDBACK_DATA, P2PTRADE_FEEDBACK_ERROR, P2PTRADE_FEEDBACK_FETCH, P2PTRADE_FETCH, P2PTRADE_UPDATE_FINISH } from './constants';
import { P2PTrade } from "./types";

export interface P2PTradeState {
    fetch: {
        data: P2PTrade;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    approve: {
        success?: boolean;
        error?: CommonError;
    };
    cancel: {
        success?: boolean;
        error?: CommonError;
    };
    feedback :{ 
        success?: boolean;
        error?: CommonError;
    };
    complain :{ 
        success?: boolean;
        error?: CommonError;
    };
    update: {
        success?: boolean;
    }
    create: {
        success?: boolean;
        tid?: string;
    }
}

const initialState: P2PTradeState = {
    fetch: {
        data: {} as P2PTrade,
        fetching: false,
        success: false,
    },
    approve: {
        success: false,
    },
    cancel: {
        success: false,
    },
    feedback: {
        success: false,
    },
    complain: {
        success: false,
    },
    update: {
        success: false,
    },
    create: {
        success: false,
    }
};

export const p2pTradeFetchReducer = (state: P2PTradeState['fetch'], action: P2PTradeAction) => {
    switch (action.type) {
        case P2PTRADE_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2PTRADE_DATA:
            return {
                ...state,
                data: action.payload.data,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2PTRADE_ERROR:
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

const p2pTradeFeedbackFetchReducer = (state: P2PTradeState['feedback'], action: P2PTradeAction) => {
    switch (action.type) {
        case P2PTRADE_FEEDBACK_FETCH:
            return {
                ...state,
                success: false,
                error: undefined,
            };
        case P2PTRADE_FEEDBACK_DATA:
            return {
                ...state,
                success: true,
                error: undefined,
            };
        case P2PTRADE_FEEDBACK_ERROR:
            return  {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pTradeComplainFetchReducer = (state: P2PTradeState['complain'], action: P2PTradeAction) => {
    switch (action.type) {
        case P2PTRADE_COMPLAIN_FETCH:
            return {
                ...state,
                success: false,
                error: undefined,
            };
        case P2PTRADE_COMPLAIN_DATA:
            return {
                ...state,
                success: true,
                error: undefined,
            };
        case P2PTRADE_COMPLAIN_ERROR:
            return  {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pTradeApproveFetchReducer = (state: P2PTradeState['approve'], action: P2PTradeAction) => {
    switch (action.type) {
        case P2PTRADE_APPROVE_FETCH:
            return {
                ...state,
                success: false,
                error: undefined,
            };
        case P2PTRADE_APPROVE_DATA:
            return {
                ...state,
                success: true,
                error: undefined,
            };
        case P2PTRADE_APPROVE_ERROR:
            return  {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pTradeCancelFetchReducer = (state: P2PTradeState['cancel'], action: P2PTradeAction) => {
    switch (action.type) {
        case P2PTRADE_CANCEL_FETCH:
            return {
                ...state,
                success: false,
                error: undefined,
            };
        case P2PTRADE_CANCEL_DATA:
            return {
                ...state,
                success: true,
                error: undefined,
            };
        case P2PTRADE_CANCEL_ERROR:
            return  {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};

export const p2pTradeReducer = (state = initialState, action: P2PTradeAction) => {
    switch (action.type) {
        case P2PTRADE_FETCH:
        case P2PTRADE_DATA:
        case P2PTRADE_ERROR:
            const p2pTradeFetchState = { ...state.fetch };

            return {
                ...state,
                fetch: p2pTradeFetchReducer(p2pTradeFetchState, action),
            };
        case P2PTRADE_APPROVE_FETCH:
        case P2PTRADE_APPROVE_DATA:
        case P2PTRADE_APPROVE_ERROR:
            const p2pTradeApproveFetchState = { ...state.approve };

            return {
                ...state,
                approve: p2pTradeApproveFetchReducer(p2pTradeApproveFetchState, action),
            };
        case P2PTRADE_FEEDBACK_FETCH:
        case P2PTRADE_FEEDBACK_DATA:
        case P2PTRADE_FEEDBACK_ERROR:
            const p2pTradeFeedbackFetchState = { ...state.feedback };

            return {
                ...state,
                feedback: p2pTradeFeedbackFetchReducer(p2pTradeFeedbackFetchState, action),
            };
        case P2PTRADE_COMPLAIN_FETCH:
            case P2PTRADE_COMPLAIN_DATA:
            case P2PTRADE_COMPLAIN_ERROR:
                const p2pTradeComplainFetchState = { ...state.complain };
                return {
                    ...state,
                    complain: p2pTradeComplainFetchReducer(p2pTradeComplainFetchState, action),
                };    
        case P2PTRADE_CANCEL_FETCH:
        case P2PTRADE_CANCEL_DATA:
        case P2PTRADE_CANCEL_ERROR:
            const p2pTradeCancelFetchState = { ...state.cancel };

            return {
                ...state,
                cancel: p2pTradeCancelFetchReducer(p2pTradeCancelFetchState, action),
            };
        case P2PTRADE_CREATE_FETCH:
            return {
                ...state,
                create: {
                    success: false,
                    tid: undefined,
                }
            };
        case P2PTRADE_CREATE_FINISH: {
            return { 
                ...state,
                fetch: {
                    data: action.payload,
                    fetching: false,
                    success: true,
                    error: undefined,
                },
                create: {
                    success: true,
                    tid: action.payload.tid
                }
            };
        }
        case P2PTRADE_CREATE_HANDLE_FINISH: {
            return { 
                ...state,
                create: {
                    success: false,
                }
            };
        }
        case P2PTRADE_UPDATE_FINISH: {
            if (state.fetch.data.tid !== String(action.payload.tid)) return {
                ...state,
                update: {
                    success: false,
                }
            };

            return { 
                ...state,
                fetch: {
                    data: {
                        ...state.fetch.data,
                        ...action.payload,
                        maker_accepted: !!action.payload.maker_accepted_at,
                        taker_accepted: !!action.payload.taker_accepted_at,
                        maker_seen: !!action.payload.maker_seen_at,
                        taker_seen: !!action.payload.taker_seen_at,
                    },
                    fetching: false,
                    success: true,
                    error: undefined,
                },
                update: {
                    success: true,
                }
            };
        }
        default:
            return state;
    }
};
