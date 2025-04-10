import { call, put } from 'redux-saga/effects';
import { P2PTradeCreateFetch, p2pTradeCreateFinish, p2pTradeError } from '../actions';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { sendError } from '../../..';
// import { alertPush } from '../../../public/alert';

const p2pTradeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: "tradesfor",
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* p2pTradeCreateSaga(action: P2PTradeCreateFetch) {
    try {
        const p2pTrade = yield call(API.post(p2pTradeOptions(getCsrfToken())), '/p2p/trades', action.payload);
        yield put(p2pTradeCreateFinish(p2pTrade));
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
