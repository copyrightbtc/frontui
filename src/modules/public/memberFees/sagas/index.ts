import { takeLatest } from 'redux-saga/effects';
import { MEMBER_FEES_FETCH } from '../constants';
import { memberFeesSaga } from './memberFeesSaga';

export function* rootMemberFeesSaga() {
    yield takeLatest(MEMBER_FEES_FETCH, memberFeesSaga);
}
