import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { P2PTradeCancelFetch, p2pTradeCancelData, p2pTradeCancelError } from '../actions';
import { getCsrfToken } from '../../../../helpers';
import { sendError } from '../../..';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'tradesfor',
        headers: { 'X-CSRF-Token': csrfToken },
    }
};

export function* p2pTradeCancelSaga(action: P2PTradeCancelFetch) {
    try {
        yield call(API.post(config(getCsrfToken())), `/p2p/trades/${action.payload.tid}/cancel`);
        yield put(p2pTradeCancelData());
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pTradeCancelError,
            },
        }));
    }
}
