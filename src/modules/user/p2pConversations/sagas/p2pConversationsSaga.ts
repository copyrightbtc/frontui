import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pConversationsData, p2pConversationsError, P2PConversationsFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* p2pConversationsSaga(action: P2PConversationsFetch) {
    try {
        const p2pConversations = yield call(API.get(config), `/p2p/trades/${action.payload.tid}/messages`);
        yield put(p2pConversationsData({ list: p2pConversations }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pConversationsError,
            },
        }));
    }
}
