import { CommonError } from '../../types';
import {
  P2PORDERS_DATA,
  P2PORDERS_ERROR,
  P2PORDERS_FETCH,
  P2PORDERS_ALERT_DELETE
} from './constants';
import { P2POrder } from './types';

export interface P2POrdersFetch {
    type: typeof P2PORDERS_FETCH;
    payload: {
      page: number;
      limit: number;
      state?: string;
      side?: string;
    };
}

export interface P2POrdersData {
  type: typeof P2PORDERS_DATA;
  payload: {
    list: P2POrder[];
    page: number;
    nextPageExists: boolean;
  };
}

export interface P2POrdersError {
  type: typeof P2PORDERS_ERROR;
  error: CommonError;
}

export interface P2POrderDeleteAlert {
  type: typeof P2PORDERS_ALERT_DELETE;
  payload: {
      list: P2POrder[];
  }
}

export type P2POrdersAction = P2POrdersFetch | P2POrdersData | P2POrdersError | P2POrderDeleteAlert;

export const p2pOrdersFetch = (payload: P2POrdersFetch['payload']): P2POrdersFetch => ({
  type: P2PORDERS_FETCH,
  payload,
});

export const p2pOrdersData = (payload: P2POrdersData['payload']): P2POrdersData => ({
  type: P2PORDERS_DATA,
  payload,
});

export const p2pOrdersError = (error: CommonError): P2POrdersError => ({
  type: P2PORDERS_ERROR,
  error,
});

export const p2pOrderDeleteAlert = (payload: P2POrderDeleteAlert['payload']): P2POrderDeleteAlert => ({
  type: P2PORDERS_ALERT_DELETE,
  payload,
});
