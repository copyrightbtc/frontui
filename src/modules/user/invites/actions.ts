import { CommonError } from '../../types';
import {
  INVITES_DATA,
  INVITES_DATA_UPDATE,
  INVITES_ERROR,
  INVITES_FETCH,
  INVITES_OVERVIEW_DATA,
  INVITES_OVERVIEW_ERROR,
  INVITES_OVERVIEW_FETCH,
} from './constants';
import { Invited, InviteOverview } from './types';


export interface InvitesFetch {
    type: typeof INVITES_FETCH;
    payload: {
      friend_uid?: string;
      page: number;
      limit: number;
    };
}

export interface InvitesData {
  type: typeof INVITES_DATA;
  payload: {
    list: Invited[];
    page: number;
    nextPageExists: boolean;
  };
}

export interface InvitesDataUpdate {
  type: typeof INVITES_DATA_UPDATE;
  payload: Invited;
}

export interface InvitesError {
  type: typeof INVITES_ERROR;
  error: CommonError;
}

export interface InvitesOverviewFetch {
  type: typeof INVITES_OVERVIEW_FETCH;
}

export interface InvitesOverviewData {
  type: typeof INVITES_OVERVIEW_DATA;
  payload: InviteOverview;
}

export interface InvitesOverviewError {
  type: typeof INVITES_OVERVIEW_ERROR;
  error: CommonError;
}

export type InvitesAction = InvitesFetch | InvitesData | InvitesDataUpdate | InvitesError | InvitesOverviewFetch | InvitesOverviewData | InvitesOverviewError;
    

export const invitesFetch = (payload: InvitesFetch['payload']): InvitesFetch => ({
    type: INVITES_FETCH,
    payload,
});

export const invitesData = (payload: InvitesData['payload']): InvitesData => ({
  type: INVITES_DATA,
  payload,
});

export const invitesDataUpdate = (payload: InvitesDataUpdate['payload']): InvitesDataUpdate => ({
  type: INVITES_DATA_UPDATE,
  payload,
});

export const invitesError = (error: CommonError): InvitesError => ({
  type: INVITES_ERROR,
  error,
});

export const invitesOverviewFetch = (): InvitesOverviewFetch => ({
  type: INVITES_OVERVIEW_FETCH,
});

export const invitesOverviewData = (payload: InvitesOverviewData['payload']): InvitesOverviewData => ({
  type: INVITES_OVERVIEW_DATA,
  payload,
});

export const invitesOverviewError = (error: CommonError): InvitesOverviewError => ({
  type: INVITES_OVERVIEW_ERROR,
  error,
});