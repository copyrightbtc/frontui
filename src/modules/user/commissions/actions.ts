import { CommonError } from '../../types';
import {
  COMMISSIONS_DATA,
  COMMISSIONS_DATA_UPDATE,
  COMMISSIONS_ERROR,
  COMMISSIONS_FETCH,
} from './constants';
import { Commission } from './types';


export interface CommissionsFetch {
    type: typeof COMMISSIONS_FETCH;
    payload: {
      currency_id?: string;
      friend_uid?: string;
      page: number;
      limit: number;
    };
}

export interface CommissionsData {
  type: typeof COMMISSIONS_DATA;
  payload: {
    list: Commission[];
    page: number;
    nextPageExists: boolean;
  };
}

export interface CommissionsDataUpdate {
  type: typeof COMMISSIONS_DATA_UPDATE;
  payload: Commission;
}

export interface CommissionsError {
  type: typeof COMMISSIONS_ERROR;
  error: CommonError;
}

export type CommissionsAction = CommissionsFetch | CommissionsData | CommissionsDataUpdate | CommissionsError;
    

export const commissionsFetch = (payload: CommissionsFetch['payload']): CommissionsFetch => ({
    type: COMMISSIONS_FETCH,
    payload,
});

export const commissionsData = (payload: CommissionsData['payload']): CommissionsData => ({
  type: COMMISSIONS_DATA,
  payload,
});

export const commissionsDataUpdate = (payload: CommissionsDataUpdate['payload']): CommissionsDataUpdate => ({
  type: COMMISSIONS_DATA_UPDATE,
  payload,
});

export const commissionsError = (error: CommonError): CommissionsError => ({
  type: COMMISSIONS_ERROR,
  error,
});