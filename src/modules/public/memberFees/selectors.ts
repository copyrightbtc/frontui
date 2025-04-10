import { RootState } from '../..';
import { CommonError } from '../../types';
import { MemberFees } from './types';

export const selectMemberFees = (state: RootState): MemberFees[] =>
    state.public.memberFees.data;

export const selectMemberFeesLoading = (state: RootState): boolean =>
    state.public.memberFees.loading;

export const selectMemberFeesSuccess = (state: RootState): boolean =>
    state.public.memberFees.success;

export const selectMemberFeesError = (state: RootState): CommonError | undefined =>
    state.public.memberFees.error;

export const selectMemberFeesTimestamp = (state: RootState): number | undefined =>
    state.public.memberFees.timestamp;

export const selectShouldMemberFees = (state: RootState): boolean =>
    !selectMemberFeesTimestamp(state) && !selectMemberFeesLoading(state);
