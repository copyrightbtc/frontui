import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pOrdersData, p2pOrdersError, P2POrdersFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* p2pOrdersSaga(action: P2POrdersFetch) {
    try {
        const { page, limit, side, state } = action.payload;
        let params = ''

        if (side) {
            params += `&side=${side}`
        }

        if (state) {
            params += `&state=${state}`
        }

        const p2pOrders = yield call(API.get(config), `/p2p/trades?order_by=created_at&ordering=desc&page=${page}&limit=${limit}${params}`);
        let nextPageExists = false;

        if (p2pOrders.length === action.payload.limit) {
            const checkData = yield call(API.get(config), `/p2p/trades?order_by=created_at&ordering=desc&page=${(page) * limit + 1}&limit=${1}${params}`);

            if (checkData.length >= 1) {
                nextPageExists = true; 
            }
        }
        
        yield put(p2pOrdersData({ list: p2pOrders, page, nextPageExists }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pOrdersError,
            },
        }));
    }
}
