import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken} from '../../../../helpers';
import { openOrdersCancelError, OpenOrdersCancelFetch } from '../actions';

const ordersCancelOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'tradesfor',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* openOrdersCancelSaga(action: OpenOrdersCancelFetch) {
    try {
        const { order: { id, uuid } } = action.payload;

        if (uuid) {
            yield call(API.post(ordersCancelOptions(getCsrfToken())), `/market/orders/${uuid}/cancel`, { uuid });
        } else {
            yield call(API.post(ordersCancelOptions(getCsrfToken())), `/market/orders/${id}/cancel`, { id });
        } 

        yield put(alertPush({ message: ['success.order.cancelling'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: openOrdersCancelError,
            },
        }));
    }
}
