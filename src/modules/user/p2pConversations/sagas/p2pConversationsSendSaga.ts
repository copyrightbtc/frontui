import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pConversationsSendData, p2pConversationsSendError, P2PConversationsSendFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* p2pConversationsSendSaga(action: P2PConversationsSendFetch) {
    try {
        yield call(API.post(config), `/p2p/trades/${action.payload.tid}/messages`, action.payload.data);
        yield put(p2pConversationsSendData());
        yield put(alertPush({message: ['success.conversations.sended'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pConversationsSendError,
            },
        }));
    }
}
