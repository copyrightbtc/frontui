import { call, put } from 'redux-saga/effects';
// import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { P2PTradeApproveFetch, p2pTradeApproveData, p2pTradeApproveError } from '../actions';
import { getCsrfToken } from '../../../../helpers';
import { sendError } from '../../..';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'tradesfor',
        headers: { 'X-CSRF-Token': csrfToken },
    }
};

export function* p2pTradeApproveSaga(action: P2PTradeApproveFetch) {
    try {
        yield call(API.post(config(getCsrfToken())), `/p2p/trades/${action.payload.tid}/approve`);
        yield put(p2pTradeApproveData());
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pTradeApproveError,
            },
        }));
    }
}
