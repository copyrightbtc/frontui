import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { setBlocklistStatus } from '../../blocklistAccess';
import { configsAuthData, configsAuthError, ConfigsAuthFetch } from '../actions';

const configsOptions: RequestOptions = {
    apiVersion: 'authsfor',
};

export function* configsFetchSaga(action: ConfigsAuthFetch) {
    try {
        const configs = yield call(API.get(configsOptions), '/identity/configs');
        yield put(configsAuthData(configs));
        yield put(setBlocklistStatus({ status: 'allowed' }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: configsAuthError,
            },
        }));
    }
}
