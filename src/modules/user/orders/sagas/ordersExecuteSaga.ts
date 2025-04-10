import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { userOpenOrdersAppend } from '../../openOrders';
import { orderExecuteData, orderExecuteError, OrderExecuteFetch } from '../actions';

const executeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'tradesfor',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* ordersExecuteSaga(action: OrderExecuteFetch) {
    try {
        const params = action.payload;
        const order = yield call(API.post(executeOptions(getCsrfToken())), '/market/orders', params);
        yield put(orderExecuteData());
 
        if (order.ord_type !== 'market') {
            yield put(userOpenOrdersAppend(order));
        }

        yield put(alertPush({ message: ['success.order.created'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: orderExecuteError,
            },
        }));
    }
}
