import { takeEvery } from 'redux-saga/effects';
import {
    USERNAME_FETCH,
} from '../constants';
import { usernameSaga } from './setUsernameSaga';

export function* rootUsernameSaga() {
    yield takeEvery(USERNAME_FETCH, usernameSaga);
}
