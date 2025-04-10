import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import {
    marketsData,
    marketsError,
    MarketsFetch,
    setCurrentMarketIfUnset,
} from '../actions';

const marketsRequestOptions: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* marketsFetchSaga(action: MarketsFetch) {
    try {
        const markets = yield call(API.get(marketsRequestOptions), '/public/markets');
        yield put(marketsData(markets));
        yield put(setCurrentMarketIfUnset(markets[0]));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: marketsError,
            },
        }));
    }
}
