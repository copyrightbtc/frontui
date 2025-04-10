import { put } from 'redux-saga/effects';
import { P2PTradeUpdate, updateP2PTradeFinish } from '../actions';
import { alertPush } from '../../..';

export function* p2pTradeUpdateSaga(action: P2PTradeUpdate) {
    yield put(updateP2PTradeFinish(action.payload));
    if (action.payload.state === 'pending') {
        yield put(alertPush({message: ['success.p2p.trade.new'], type: 'success'}));
    } else if (action.payload.state === 'wait') {
        if ((action.payload.side === 'buy' && action.payload.maker_accepted_at) || (action.payload.side === 'sell' && action.payload.taker_accepted_at)) {
            yield put(alertPush({message: ['success.p2p.trade.action.sell.approve'], type: 'success'}));
        } else if ((action.payload.side === 'sell' && action.payload.maker_accepted_at) || (action.payload.side === 'buy' && action.payload.taker_accepted_at)) {
            yield put(alertPush({message: ['success.p2p.trade.action.buy.approve'], type: 'success'}));
        }
    } else if (action.payload.state === 'reject') {
        yield put(alertPush({message: ['success.p2p.trade.reject'], type: 'success'}));
    } else if (action.payload.state === 'completed') {
        yield put(alertPush({message: ['success.p2p.trade.success'], type: 'success'}));
    } else if (action.payload.state === 'cancel') {
        yield put(alertPush({message: ['success.p2p.trade.cancel'], type: 'success'}));
    }
}
