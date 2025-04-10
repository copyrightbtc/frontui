import { CommonError } from '../../types';
import {
  P2PTRADE_APPROVE_DATA,
  P2PTRADE_APPROVE_ERROR,
  P2PTRADE_APPROVE_FETCH,
  P2PTRADE_CANCEL_DATA,
  P2PTRADE_CANCEL_ERROR,
  P2PTRADE_CANCEL_FETCH,
  P2PTRADE_COMPLAIN_DATA,
  P2PTRADE_COMPLAIN_ERROR,
  P2PTRADE_COMPLAIN_FETCH,
  P2PTRADE_CREATE_FETCH,
  P2PTRADE_CREATE_FINISH,
  P2PTRADE_CREATE_HANDLE_FINISH,
  P2PTRADE_DATA,
  P2PTRADE_ERROR,
  P2PTRADE_FEEDBACK_DATA,
  P2PTRADE_FEEDBACK_ERROR,
  P2PTRADE_FEEDBACK_FETCH,
  P2PTRADE_FETCH,
  P2PTRADE_UPDATE_EMIT,
  P2PTRADE_UPDATE_FINISH,
} from './constants';
import { P2PTrade, P2PTradeCreate, P2PTradeModel } from './types';


export interface P2PTradeFetch {
  type: typeof P2PTRADE_FETCH;
  payload: {
    tid: string;
  }
}

export interface P2PTradeData {
  type: typeof P2PTRADE_DATA;
  payload: {
    data: P2PTrade;
  };
}

export interface P2PTradeError {
  type: typeof P2PTRADE_ERROR;
  error: CommonError;
}

export interface P2PTradeApproveFetch {
  type: typeof P2PTRADE_APPROVE_FETCH;
  payload: {
    tid: string;
  }
}

export interface P2PTradeApproveData {
  type: typeof P2PTRADE_APPROVE_DATA;
}

export interface P2PTradeApproveError {
  type: typeof P2PTRADE_APPROVE_ERROR;
  error: CommonError;
}

export interface P2PTradeFeedbackFetch {
  type: typeof P2PTRADE_FEEDBACK_FETCH;
  payload: {
    tid: string;
    rate: string;
    message: string;
  }
}

export interface P2PTradeFeedbackData {
  type: typeof P2PTRADE_FEEDBACK_DATA;
}

export interface P2PTradeFeedbackError {
  type: typeof P2PTRADE_FEEDBACK_ERROR;
  error: CommonError;
}

export interface P2PTradeComplainFetch {
  type: typeof P2PTRADE_COMPLAIN_FETCH;
  payload: {
    tid: string;
    message: string;
  }
}
export interface P2PTradeComplainData {
  type: typeof P2PTRADE_COMPLAIN_DATA;
}
export interface P2PTradeComplainError {
  type: typeof P2PTRADE_COMPLAIN_ERROR;
  error: CommonError;
}

export interface P2PTradeCancelFetch {
  type: typeof P2PTRADE_CANCEL_FETCH;
  payload: {
    tid: string;
  }
}

export interface P2PTradeCancelData {
  type: typeof P2PTRADE_CANCEL_DATA;
}

export interface P2PTradeCancelError {
  type: typeof P2PTRADE_CANCEL_ERROR;
  error: CommonError;
}

export interface P2PTradeUpdate {
  type: typeof P2PTRADE_UPDATE_EMIT;
  payload: P2PTradeModel;
}

export interface P2PTradeUpdateFinish {
  type: typeof P2PTRADE_UPDATE_FINISH;
  payload: P2PTradeModel;
}

export interface P2PTradeCreateFetch {
  type: typeof P2PTRADE_CREATE_FETCH;
  payload: P2PTradeCreate;
}

export interface P2PTradeCreateFinish {
  type: typeof P2PTRADE_CREATE_FINISH;
  payload: P2PTrade;
}
export interface P2PTradeHandleFinish {
  type: typeof P2PTRADE_CREATE_HANDLE_FINISH;
  payload: string;
}

export type P2PTradeAction = P2PTradeFetch | P2PTradeData | P2PTradeError | P2PTradeApproveFetch | P2PTradeApproveData | P2PTradeApproveError | P2PTradeUpdate | P2PTradeUpdateFinish | P2PTradeCreateFetch | P2PTradeCreateFinish | P2PTradeHandleFinish | P2PTradeCancelFetch | P2PTradeCancelData | P2PTradeCancelError | P2PTradeFeedbackFetch | P2PTradeFeedbackData | P2PTradeFeedbackError | P2PTradeComplainFetch | P2PTradeComplainData | P2PTradeComplainError;

export const p2pTradeFetch = (payload: P2PTradeFetch['payload']): P2PTradeFetch => ({
  type: P2PTRADE_FETCH,
  payload,
});

export const p2pTradeData = (payload: P2PTradeData['payload']): P2PTradeData => ({
  type: P2PTRADE_DATA,
  payload,
});

export const p2pTradeError = (error: CommonError): P2PTradeError => ({
  type: P2PTRADE_ERROR,
  error,
});

export const p2pTradeApproveFetch = (payload: P2PTradeApproveFetch['payload']): P2PTradeApproveFetch => ({
  type: P2PTRADE_APPROVE_FETCH,
  payload,
});

export const p2pTradeApproveData = (): P2PTradeApproveData => ({
  type: P2PTRADE_APPROVE_DATA,
});

export const p2pTradeApproveError = (error: CommonError): P2PTradeError => ({
  type: P2PTRADE_ERROR,
  error,
});

export const updateP2PTradeEmit = (payload: P2PTradeModel): P2PTradeUpdate => ({
  type: P2PTRADE_UPDATE_EMIT,
  payload,
});

export const updateP2PTradeFinish = (payload: P2PTradeModel): P2PTradeUpdateFinish => ({
  type: P2PTRADE_UPDATE_FINISH,
  payload,
});

export const p2pTradeCreateFetch = (payload: P2PTradeCreate): P2PTradeCreateFetch => ({
  type: P2PTRADE_CREATE_FETCH,
  payload,
});

export const p2pTradeCreateFinish = (payload: P2PTrade): P2PTradeCreateFinish => ({
  type: P2PTRADE_CREATE_FINISH,
  payload,
});
export const p2pTradeCreateHandleFinish = (payload: string): P2PTradeHandleFinish=> ({
  type: P2PTRADE_CREATE_HANDLE_FINISH,
  payload,
});

export const p2pTradeCancelFetch = (payload: P2PTradeCancelFetch['payload']): P2PTradeCancelFetch => ({
  type: P2PTRADE_CANCEL_FETCH,
  payload,
});

export const p2pTradeCancelData = (): P2PTradeCancelData => ({
  type: P2PTRADE_CANCEL_DATA,
});

export const p2pTradeCancelError = (error: CommonError): P2PTradeError => ({
  type: P2PTRADE_ERROR,
  error,
});

export const p2pTradeFeedbackFetch = (payload: P2PTradeFeedbackFetch['payload']): P2PTradeFeedbackFetch => ({
  type: P2PTRADE_FEEDBACK_FETCH,
  payload,
});

export const p2pTradeFeedbackData = (): P2PTradeFeedbackData => ({
  type: P2PTRADE_FEEDBACK_DATA,
});

export const p2pTradeFeedbackError = (error: CommonError): P2PTradeError => ({
  type: P2PTRADE_ERROR,
  error,
});

export const p2pTradeComplainFetch = (payload: P2PTradeComplainFetch['payload']): P2PTradeComplainFetch => ({
  type: P2PTRADE_COMPLAIN_FETCH,
  payload,
});

export const p2pTradeComplainData = (): P2PTradeComplainData => ({
  type: P2PTRADE_COMPLAIN_DATA,
});

export const p2pTradeComplainError = (error: CommonError): P2PTradeComplainError => ({
  type: P2PTRADE_COMPLAIN_ERROR,
  error,
});