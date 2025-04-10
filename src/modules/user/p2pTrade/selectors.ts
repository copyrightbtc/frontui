import { P2PTradeState, RootState } from '../..';
import { CommonError } from '../../types';
import { P2PTrade } from './types';

export const selectP2PTrade = (state: RootState): P2PTrade => {
    return state.user.p2pTrade.fetch.data;
}

export const selectP2PTradeFetchLoading = (state: RootState): boolean =>
    state.user.p2pTrade.fetch.fetching;

export const selectP2PTradeFetchSuccess = (state: RootState): boolean =>
    state.user.p2pTrade.fetch.success;

export const selectP2PTradeFetchError = (state: RootState): CommonError | undefined =>
    state.user.p2pTrade.fetch.error;

export const selectP2PTradeApproveFetchSuccess = (state: RootState): boolean | undefined =>
    state.user.p2pTrade.approve.success;

export const selectP2PTradeCancelFetchSuccess = (state: RootState): boolean | undefined =>
    state.user.p2pTrade.cancel.success;

export const selectP2PTradeFeedbackFetchSuccess = (state: RootState): boolean | undefined =>
    state.user.p2pTrade.feedback.success;

export const selectP2PTradeComplainFetchSuccess = (state: RootState): boolean | undefined =>
    state.user.p2pTrade.complain.success;

export const selectP2PTradeUpdateSuccess = (state: RootState): boolean | undefined =>
    state.user.p2pTrade.update.success;

export const selectP2PTradeCreateResult = (state: RootState): P2PTradeState["create"] =>
    state.user.p2pTrade.create;