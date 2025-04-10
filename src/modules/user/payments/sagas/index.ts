import { takeEvery, takeLatest } from 'redux-saga/effects';
import { paymentsSaga } from './paymentsSaga';
import { PAYMENTS_ADD_FETCH, PAYMENTS_DELETE_FETCH, PAYMENTS_FETCH } from '../constants';
import { paymentsAddSaga } from './paymentsAddSaga';
import { paymentsDeleteSaga } from './paymentsDeleteSaga';

export function* rootPaymentsSaga() {
    yield takeLatest(PAYMENTS_FETCH, paymentsSaga);
    yield takeEvery(PAYMENTS_ADD_FETCH, paymentsAddSaga);
    yield takeEvery(PAYMENTS_DELETE_FETCH, paymentsDeleteSaga);
}
