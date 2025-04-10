import { takeEvery, takeLatest } from 'redux-saga/effects';
import { p2pConversationsSaga } from './p2pConversationsSaga';
import { P2PCONVERSATIONS_FETCH, P2PCONVERSATIONS_PUSH_EMIT, P2PCONVERSATIONS_SEND_FETCH } from '../constants';
import { p2pConversationsSendSaga } from './p2pConversationsSendSaga';
import { p2pConversationsPushSaga } from './p2pConversationsPushSaga';

export function* rootP2PConversationsSaga() {
    yield takeLatest(P2PCONVERSATIONS_FETCH, p2pConversationsSaga);
    yield takeEvery(P2PCONVERSATIONS_SEND_FETCH, p2pConversationsSendSaga);
    yield takeLatest(P2PCONVERSATIONS_PUSH_EMIT, p2pConversationsPushSaga);
}
