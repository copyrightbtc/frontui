import { CommonError } from "../../types";
import { InvitesAction } from "./actions";
import { INVITES_DATA, INVITES_DATA_UPDATE, INVITES_ERROR, INVITES_FETCH, INVITES_OVERVIEW_DATA, INVITES_OVERVIEW_ERROR, INVITES_OVERVIEW_FETCH } from "./constants";
import { Invited, InviteOverview } from "./types";

export interface InvitesState {
    fetch: {
        data: Invited[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
        page: number;
        nextPageExists: boolean;
    };
    overview: {
        data: InviteOverview;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    }
}

const initialState: InvitesState = {
    fetch: {
        data: [],
        fetching: false,
        success: false,
        page: 1,
        nextPageExists: false,
    },
    overview: {
        data: {
            invites: 0,
            total: '0',
        },
        fetching: false,
        success: false,
    },
};

export const invitesFetchReducer = (state: InvitesState['fetch'], action: InvitesAction) => {
    switch (action.type) {
        case INVITES_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case INVITES_DATA:
            return {
                ...state,
                data: action.payload.list,
                fetching: false,
                success: true,
                error: undefined,
                page: action.payload.page,
                nextPageExists: action.payload.nextPageExists,
            };
        case INVITES_ERROR:
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

export const invitesOverviewFetchReducer = (state: InvitesState['overview'], action: InvitesAction) => {
    switch (action.type) {
        case INVITES_OVERVIEW_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case INVITES_OVERVIEW_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case INVITES_OVERVIEW_ERROR:
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

export const invitesReducer = (state = initialState, action: InvitesAction) => {
    switch (action.type) {
        case INVITES_FETCH:
        case INVITES_DATA:
        case INVITES_DATA_UPDATE:
        case INVITES_ERROR:
            const invitesFetchState = { ...state.fetch };

            return {
                ...state,
                fetch: invitesFetchReducer(invitesFetchState, action),
            };
        case INVITES_OVERVIEW_FETCH:
        case INVITES_OVERVIEW_DATA:
        case INVITES_OVERVIEW_ERROR:
            const invitesOverviewFetchState = { ...state.overview };

            return {
                ...state,
                overview: invitesOverviewFetchReducer(invitesOverviewFetchState, action),
            };
        default:
            return state;
    }
};
