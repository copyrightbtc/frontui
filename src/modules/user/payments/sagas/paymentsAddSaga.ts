import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { paymentsAddData, paymentsAddError, PaymentsAddFetch } from '../actions';
import { getCsrfToken } from 'src/helpers';

const config: RequestOptions = {
    apiVersion: 'tradesfor',
    headers: {
        'X-CSRF-Token': getCsrfToken()
    }
};

export function* paymentsAddSaga(action: PaymentsAddFetch) {
    try {
        yield call(API.post(config), '/p2p/payments', action.payload);
        yield put(paymentsAddData());
        yield put(alertPush({message: ['success.payments.add'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: paymentsAddError,
            },
        }));
    }
}
