import { takeLatest } from 'redux-saga/effects';
import { commissionsSaga } from './commissionsSaga';
import { COMMISSIONS_FETCH } from '../constants';

export function* rootCommissionsSaga() {
    yield takeLatest(COMMISSIONS_FETCH, commissionsSaga);
}
