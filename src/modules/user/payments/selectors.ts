import { RootState } from '../../';
import { CommonError } from '../../types';
import { Payment } from './types';

export const selectPayments = (state: RootState): Payment[] => {
    return state.user.payments.fetch.data;
}

export const selectPaymentsCurrentPageIndex = (state: RootState): number =>
    state.user.payments.fetch.page - 1;

export const selectPaymentsFirstElemIndex = (state: RootState, limit: number): number =>
    ((state.user.payments.fetch.page - 1) * limit) + 1;

export const selectPaymentsLastElemIndex = (state: RootState, limit: number): number =>
    ((state.user.payments.fetch.page - 1) * limit) + state.user.payments.fetch.data.length;

export const selectPaymentsNextPageExists = (state: RootState): boolean =>
    state.user.payments.fetch.nextPageExists;

export const selectPaymentsFetchLoading = (state: RootState): boolean =>
    state.user.payments.fetch.fetching;

export const selectPaymentsFetchSuccess = (state: RootState): boolean =>
    state.user.payments.fetch.success;

export const selectPaymentsFetchError = (state: RootState): CommonError | undefined =>
    state.user.payments.fetch.error;

export const selectAddPaymentSuccess = (state: RootState): boolean | undefined =>
    state.user.payments.add.success;

export const selectDeletePaymentSuccess = (state: RootState): boolean | undefined =>
    state.user.payments.delete.success;
