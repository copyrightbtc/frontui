import { RootState } from '../../';
import { CommonError } from '../../types';
import { Commission } from './types';

export const selectCommissions = (state: RootState): Commission[] => {
    return state.user.commissions.fetch.data;
}

export const selectCommissionsCurrentPageIndex = (state: RootState): number =>
    state.user.commissions.fetch.page - 1;

export const selectCommissionsFirstElemIndex = (state: RootState, limit: number): number =>
    ((state.user.commissions.fetch.page - 1) * limit) + 1;

export const selectCommissionsLastElemIndex = (state: RootState, limit: number): number =>
    ((state.user.commissions.fetch.page - 1) * limit) + state.user.commissions.fetch.data.length;

export const selectCommissionsNextPageExists = (state: RootState): boolean =>
    state.user.commissions.fetch.nextPageExists;

export const selectCommissionsFetchLoading = (state: RootState): boolean =>
    state.user.commissions.fetch.fetching;

export const selectCommissionsFetchSuccess = (state: RootState): boolean =>
    state.user.commissions.fetch.success;

export const selectCommissionsFetchError = (state: RootState): CommonError | undefined =>
    state.user.commissions.fetch.error;