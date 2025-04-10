import { takeLatest } from 'redux-saga/effects';
import { p2pOrdersSaga } from './p2pOrdersSaga';
import { P2PORDERS_FETCH } from '../constants';

export function* rootP2POrdersSaga() {
    yield takeLatest(P2PORDERS_FETCH, p2pOrdersSaga);
}
