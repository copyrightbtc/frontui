import { call, put } from 'redux-saga/effects';
import { buildQueryString } from 'src/helpers';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { userOrdersHistoryData, userOrdersHistoryError, UserOrdersHistoryFetch } from '../actions';

const ordersOptions: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* ordersHistorySaga(action: UserOrdersHistoryFetch) {
    try {
        const { pageIndex, limit, type, market, state, side, ord_type, time_from, time_to } = action.payload;
        let params: any = {
            page: pageIndex,
            limit,
            market,
            state,
            side,
            ord_type,
            time_from,
            time_to,
            ...(type === 'open' && { state: ['wait'] }), //{ state: ['wait', 'trigger_wait'] }),
        };

        const data = yield call(API.get(ordersOptions), `/market/orders?${buildQueryString(params)}`);
        let nextPageExists = false;

        if (data.length === limit) {
            params = { ...params, page: (pageIndex + 1) * limit, limit: 1 };
            const checkData = yield call(API.get(ordersOptions), `/market/orders?${buildQueryString(params)}`);

            if (checkData.length === 1) {
                nextPageExists = true;
            }
        }

        yield put(userOrdersHistoryData({ list: data, nextPageExists, pageIndex }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: userOrdersHistoryError,
            },
        }));
    }
}
