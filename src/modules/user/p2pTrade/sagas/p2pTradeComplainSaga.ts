import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { p2pTradeComplainData, p2pTradeComplainError, P2PTradeComplainFetch } from '../actions';
import { getCsrfToken } from '../../../../helpers';
import { alertPush, sendError } from '../../..';
const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'tradesfor',
        headers: { 'X-CSRF-Token': csrfToken },
    }
};
export function* p2pTradeComplainSaga(action: P2PTradeComplainFetch) {
    try {
        yield call(API.post(config(getCsrfToken())), `/p2p/trades/${action.payload.tid}/complain`, action.payload);
        yield put(p2pTradeComplainData());
        yield put(alertPush({message: ['success.complain.create'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pTradeComplainError,
            },
        }));
    }
}