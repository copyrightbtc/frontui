import { takeEvery, takeLatest } from 'redux-saga/effects';
import { p2pTradeSaga } from './p2pTradeSaga';
import { P2PTRADE_APPROVE_FETCH, P2PTRADE_CANCEL_FETCH, P2PTRADE_COMPLAIN_FETCH, P2PTRADE_CREATE_FETCH, P2PTRADE_FEEDBACK_FETCH, P2PTRADE_FETCH, P2PTRADE_UPDATE_EMIT } from '../constants';
import { p2pTradeApproveSaga } from './p2pTradeApproveSaga';
import { p2pTradeUpdateSaga } from './p2pTradeUpdateSaga';
import { p2pTradeCreateSaga } from './p2pTradeCreateSaga';
import { p2pTradeCancelSaga } from './p2pTradeCancelSaga';
import { p2pTradeFeedbackSaga } from './p2pTradeFeedbackSaga';
import { p2pTradeComplainSaga } from './p2pTradeComplainSaga';

export function* rootP2PTradeSaga() {
    yield takeLatest(P2PTRADE_FETCH, p2pTradeSaga);
    yield takeEvery(P2PTRADE_APPROVE_FETCH, p2pTradeApproveSaga);
    yield takeEvery(P2PTRADE_FEEDBACK_FETCH, p2pTradeFeedbackSaga);
    yield takeEvery(P2PTRADE_COMPLAIN_FETCH, p2pTradeComplainSaga);
    yield takeEvery(P2PTRADE_CANCEL_FETCH, p2pTradeCancelSaga);
    yield takeEvery(P2PTRADE_UPDATE_EMIT, p2pTradeUpdateSaga);
    yield takeEvery(P2PTRADE_CREATE_FETCH, p2pTradeCreateSaga);
}
