import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { usernameData, usernameError, UsernameFetch } from '../actions';

const usernameOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'authsfor',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* usernameSaga(action: UsernameFetch) {
    try {
        yield call(API.put(usernameOptions(getCsrfToken())), '/resource/users/me', action.payload);
        yield put(usernameData());
        yield put(alertPush({message: ['success.username.changed'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: usernameError,
            },
        }));
    }
}
