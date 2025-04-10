import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { paymentsData, paymentsError, PaymentsFetch } from '../actions';
import { getCsrfToken } from '../../../../helpers';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'tradesfor',
        headers: { 'X-CSRF-Token': csrfToken },
    }
};

export function* paymentsSaga(action: PaymentsFetch) {
    try {
        const { page, limit } = action.payload;
        const payments = yield call(API.get(config(getCsrfToken())), `/p2p/payments?page=${page}&limit=${limit}`);
        let nextPageExists = false;

        if (payments.length === action.payload.limit) {
            const checkData = yield call(API.get(config(getCsrfToken())), `/p2p/payments?page=${(page) * limit + 1}&limit=${1}`);

            if (checkData.length === 1) {
                nextPageExists = true;
            }
        }
        
        yield put(paymentsData({ list: payments, page, nextPageExists }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: paymentsError,
            },
        }));
    }
}
