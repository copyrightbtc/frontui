import { CommonError } from '../../types';
import { memberFeesAction } from './actions';
import { MEMBER_FEES_DATA, MEMBER_FEES_ERROR, MEMBER_FEES_FETCH } from './constants';
import { MemberFees } from './types';

export interface MemberFeesState {
    data: MemberFees[];
    loading: boolean;
    success: boolean;
    error?: CommonError;
    timestamp?: number;
}

export const initialMemberFeesState: MemberFeesState = {
    data: [],
    loading: false,
    success: false,
};

export const memberFeesReducer = (state = initialMemberFeesState, action: memberFeesAction): MemberFeesState => {
    switch (action.type) {
        case MEMBER_FEES_FETCH:
            return {
                ...state,
                loading: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case MEMBER_FEES_DATA:
            return {
                ...state,
                loading: false,
                success: true,
                data: action.payload,
            };
        case MEMBER_FEES_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

