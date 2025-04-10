import { RootState } from '../..';
import { CommonError } from '../../types';
import { P2POrder } from './types';

export const selectP2POrders = (state: RootState): P2POrder[] => {
    return state.user.p2pOrders.fetch.data;
}

export const selectP2POrdersCurrentPageIndex = (state: RootState): number =>
    state.user.p2pOrders.fetch.page - 1;

export const selectP2POrdersFirstElemIndex = (state: RootState, limit: number): number =>
    ((state.user.p2pOrders.fetch.page - 1) * limit) + 1;

export const selectP2POrdersLastElemIndex = (state: RootState, limit: number): number =>
    ((state.user.p2pOrders.fetch.page - 1) * limit) + state.user.p2pOrders.fetch.data.length;

export const selectP2POrdersNextPageExists = (state: RootState): boolean =>
    state.user.p2pOrders.fetch.nextPageExists;

export const selectP2POrdersFetchLoading = (state: RootState): boolean =>
    state.user.p2pOrders.fetch.fetching;

export const selectP2POrdersFetchSuccess = (state: RootState): boolean =>
    state.user.p2pOrders.fetch.success;

export const selectP2POrdersFetchError = (state: RootState): CommonError | undefined =>
    state.user.p2pOrders.fetch.error;

export const selectP2POrdersAlerts = (state: RootState): P2POrder[] =>
    state.user.p2pOrders.alertsList.list;