import { CommonError } from "../../types";
import { P2PConversationsAction } from "./actions";
import { P2PCONVERSATIONS_DATA, P2PCONVERSATIONS_ERROR, P2PCONVERSATIONS_FETCH, P2PCONVERSATIONS_PUSH_FINISH, P2PCONVERSATIONS_SEND_DATA, P2PCONVERSATIONS_SEND_ERROR, P2PCONVERSATIONS_SEND_FETCH } from "./constants";
import { P2PConversation } from "./types";

export interface P2PConversationsState {
    fetch: {
        data: P2PConversation[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    send: {
        success?: boolean;
        fetching: boolean;
        error?: CommonError;
    }
}

const initialState: P2PConversationsState = {
    fetch: {
        data: [],
        fetching: false,
        success: false,
    },
    send: {
        fetching: false,
        success: false,
    }
};

const p2pConversationsSendFetchReducer = (state: P2PConversationsState['send'], action: P2PConversationsAction) => {
    switch (action.type) {
        case P2PCONVERSATIONS_SEND_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2PCONVERSATIONS_SEND_DATA:
            return {
                ...state,
                success: true,
                fetching: false,
                error: undefined,
            };
        case P2PCONVERSATIONS_SEND_ERROR:
            return  {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const p2pConversationsFetchReducer = (state: P2PConversationsState['fetch'], action: P2PConversationsAction) => {
    switch (action.type) {
        case P2PCONVERSATIONS_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case P2PCONVERSATIONS_DATA:
            return {
                ...state,
                data: action.payload.list,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2PCONVERSATIONS_ERROR:
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


export const p2pConversationsReducer = (state = initialState, action: P2PConversationsAction) => {
    switch (action.type) {
        case P2PCONVERSATIONS_FETCH:
        case P2PCONVERSATIONS_DATA:
        case P2PCONVERSATIONS_ERROR:
            const p2pConversationsFetchState = { ...state.fetch };

            return {
                ...state,
                fetch: p2pConversationsFetchReducer(p2pConversationsFetchState, action),
            };
        case P2PCONVERSATIONS_SEND_FETCH:
        case P2PCONVERSATIONS_SEND_DATA:
        case P2PCONVERSATIONS_SEND_ERROR:
            const p2pConversationsSendFetchState = { ...state.send };

            return {
                ...state,
                send: p2pConversationsSendFetchReducer(p2pConversationsSendFetchState, action),
            };
        case P2PCONVERSATIONS_PUSH_FINISH: {
            return { 
                ...state,
                fetch: {
                    data: [...action.payload],
                    fetching: false,
                    success: true,
                    error: undefined,
                }
            };
        }
        default:
            return state;
    }
};
