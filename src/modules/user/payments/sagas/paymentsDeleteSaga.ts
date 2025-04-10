import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { paymentsDeleteData, paymentsDeleteError, PaymentsDeleteFetch } from '../actions';
import { getCsrfToken } from 'src/helpers';

const config: RequestOptions = {
    apiVersion: 'tradesfor',
    headers: {
        'X-CSRF-Token': getCsrfToken()
    }
};

export function* paymentsDeleteSaga(action: PaymentsDeleteFetch) {
    try {
        yield call(API.delete(config), `/p2p/payments/${action.payload.id}`);
        yield put(paymentsDeleteData());
        yield put(alertPush({message: ['success.payments.delete'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: paymentsDeleteError,
            },
        }));
    }
}
