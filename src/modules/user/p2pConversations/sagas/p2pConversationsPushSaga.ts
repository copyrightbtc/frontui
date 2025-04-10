import { put, select } from 'redux-saga/effects';
import { P2PConversationsPush, pushP2PConversationsFinish } from '../actions';
import { selectP2PConversations } from '../selectors';

export function* p2pConversationsPushSaga(action: P2PConversationsPush) {
    const actualList = yield select(selectP2PConversations);
    const updatedConversations = [ ...actualList, action.payload];

    yield put(pushP2PConversationsFinish(updatedConversations));
}
