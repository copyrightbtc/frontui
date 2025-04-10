import { CommonError } from '../../types';
import { MEMBER_FEES_DATA, MEMBER_FEES_ERROR, MEMBER_FEES_FETCH } from './constants';
import { MemberFees } from './types';

export interface MemberFeesFetch {
    type: typeof MEMBER_FEES_FETCH;
}

export interface MemberFeesData {
    type: typeof MEMBER_FEES_DATA;
    payload: MemberFees[];
}

export interface MemberFeesError {
    type: typeof MEMBER_FEES_ERROR;
    error: CommonError;
}

export type memberFeesAction = MemberFeesFetch
    | MemberFeesData
    | MemberFeesError;

export const memberFeesFetch = (): MemberFeesFetch => ({
    type: MEMBER_FEES_FETCH,
});

export const memberFeesData = (payload: MemberFeesData['payload']): MemberFeesData => ({
    type: MEMBER_FEES_DATA,
    payload,
});

export const memberFeesError = (error: CommonError): MemberFeesError => ({
    type: MEMBER_FEES_ERROR,
    error,
});
