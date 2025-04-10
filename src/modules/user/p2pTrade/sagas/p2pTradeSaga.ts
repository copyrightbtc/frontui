import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { p2pTradeData, p2pTradeError, P2PTradeFetch } from '../actions';
import { getCsrfToken } from '../../../../helpers';
import { sendError } from '../../..';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'tradesfor',
        headers: { 'X-CSRF-Token': csrfToken },
    }
};

export function* p2pTradeSaga(action: P2PTradeFetch) {
    try {
        const p2pTrade = yield call(API.get(config(getCsrfToken())), `/p2p/trades/${action.payload.tid}`);
        yield put(p2pTradeData({ data: p2pTrade }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pTradeError,
            },
        }));
    }
}
