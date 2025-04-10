import { CommonError } from '../../types';
import {
  PAYMENTS_ADD_DATA,
  PAYMENTS_ADD_ERROR,
  PAYMENTS_ADD_FETCH,
  PAYMENTS_DATA,
  PAYMENTS_DELETE_DATA,
  PAYMENTS_DELETE_ERROR,
  PAYMENTS_DELETE_FETCH,
  PAYMENTS_ERROR,
  PAYMENTS_FETCH,
} from './constants';
import { Payment } from './types';

export interface PaymentsFetch {
    type: typeof PAYMENTS_FETCH;
    payload: {
      page: number;
      limit: number;
    };
}

export interface PaymentsData {
  type: typeof PAYMENTS_DATA;
  payload: {
    list: Payment[];
    page: number;
    nextPageExists: boolean;
  };
}

export interface PaymentsError {
  type: typeof PAYMENTS_ERROR;
  error: CommonError;
}

export interface PaymentsAddFetch {
  type: typeof PAYMENTS_ADD_FETCH;
  payload: {
    payment_type: string;
    account_name: string;
    data: Record<string, string>;
  };
}

export interface PaymentsAddData {
  type: typeof PAYMENTS_ADD_DATA;
}

export interface PaymentsAddError {
  type: typeof PAYMENTS_ADD_ERROR;
  error: CommonError;
}

export interface PaymentsDeleteFetch {
  type: typeof PAYMENTS_DELETE_FETCH;
  payload: {
    id: number;
  };
}

export interface PaymentsDeleteData {
  type: typeof PAYMENTS_DELETE_DATA;
}

export interface PaymentsDeleteError {
  type: typeof PAYMENTS_DELETE_ERROR;
  error: CommonError;
}

export type PaymentsAction = PaymentsFetch | PaymentsData | PaymentsError | PaymentsAddFetch | PaymentsAddData | PaymentsAddError | PaymentsDeleteFetch | PaymentsDeleteData | PaymentsDeleteError;
    

export const paymentsFetch = (payload: PaymentsFetch['payload']): PaymentsFetch => ({
    type: PAYMENTS_FETCH,
    payload,
});

export const paymentsData = (payload: PaymentsData['payload']): PaymentsData => ({
  type: PAYMENTS_DATA,
  payload,
});

export const paymentsError = (error: CommonError): PaymentsError => ({
  type: PAYMENTS_ERROR,
  error,
});

export const paymentsAddFetch = (payload: PaymentsAddFetch['payload']): PaymentsAddFetch => ({
  type: PAYMENTS_ADD_FETCH,
  payload,
});

export const paymentsAddData = (): PaymentsAddData => ({
  type: PAYMENTS_ADD_DATA,
});

export const paymentsAddError = (error: CommonError): PaymentsAddError => ({
  type: PAYMENTS_ADD_ERROR,
  error,
});

export const paymentsDeleteFetch = (payload: PaymentsDeleteFetch['payload']): PaymentsDeleteFetch => ({
  type: PAYMENTS_DELETE_FETCH,
  payload,
});

export const paymentsDeleteData = (): PaymentsDeleteData => ({
  type: PAYMENTS_DELETE_DATA,
});

export const paymentsDeleteError = (error: CommonError): PaymentsDeleteError => ({
  type: PAYMENTS_DELETE_ERROR,
  error,
});
