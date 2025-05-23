import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { depthData, depthError, DepthFetch } from '../actions';

const depthOptions: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* depthSaga(action: DepthFetch) {
    try {
        const market = action.payload;
        const depth = yield call(API.get(depthOptions), `/public/markets/${market.id}/depth`);
        yield put(depthData(depth));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'console',
            extraOptions: {
                actionError: depthError,
            },
        }));
    }
}
