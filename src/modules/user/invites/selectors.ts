import { RootState } from '../../';
import { CommonError } from '../../types';
import { Invited, InviteOverview } from './types';

export const selectInvites = (state: RootState): Invited[] => {
    return state.user.invites.fetch.data;
}

export const selectInvitesCurrentPageIndex = (state: RootState): number =>
    state.user.invites.fetch.page - 1;

export const selectInvitesFirstElemIndex = (state: RootState, limit: number): number =>
    ((state.user.invites.fetch.page - 1) * limit) + 1;

export const selectInvitesLastElemIndex = (state: RootState, limit: number): number =>
    ((state.user.invites.fetch.page - 1) * limit) + state.user.invites.fetch.data.length;

export const selectInvitesNextPageExists = (state: RootState): boolean =>
    state.user.invites.fetch.nextPageExists;

export const selectInvitesFetchLoading = (state: RootState): boolean =>
    state.user.invites.fetch.fetching;

export const selectInvitesFetchSuccess = (state: RootState): boolean =>
    state.user.invites.fetch.success;

export const selectInvitesFetchError = (state: RootState): CommonError | undefined =>
    state.user.invites.fetch.error;

export const selectOverview = (state: RootState): InviteOverview => {
    return state.user.invites.overview.data;
}

export const selectOverviewLoading = (state: RootState): boolean =>
    state.user.invites.overview.fetching;

export const selectOverviewSuccess = (state: RootState): boolean =>
    state.user.invites.overview.success;

export const selectOverviewError = (state: RootState): CommonError | undefined =>
    state.user.invites.overview.error;
