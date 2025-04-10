import { takeLatest } from 'redux-saga/effects';
import { CONFIGS_FETCH } from '../constants';
import { configsFetchSaga } from './configsFetchSaga';

export function* rootConfigsAuthSaga() {
    yield takeLatest(CONFIGS_FETCH, configsFetchSaga);
}
