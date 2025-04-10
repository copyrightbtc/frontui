import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { p2pTradeFeedbackData, p2pTradeFeedbackError, P2PTradeFeedbackFetch } from '../actions';
import { getCsrfToken } from '../../../../helpers';
import { alertPush, sendError } from '../../..';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'tradesfor',
        headers: { 'X-CSRF-Token': csrfToken },
    }
};

export function* p2pTradeFeedbackSaga(action: P2PTradeFeedbackFetch) {
    try {
        yield call(API.post(config(getCsrfToken())), `/p2p/trades/${action.payload.tid}/feedbacks`, action.payload);
        yield put(p2pTradeFeedbackData());
        yield put(alertPush({message: ['success.feedback.create'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pTradeFeedbackError,
            },
        }));
    }
}
