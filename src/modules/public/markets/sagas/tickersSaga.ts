import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { marketsTickersData, marketsTickersError, MarketsTickersFetch } from '../actions';

const tickersOptions: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* tickersSaga(action: MarketsTickersFetch) {
    try {
        const tickers = yield call(API.get(tickersOptions), `/public/markets/tickers`);

        if (tickers) {
            const pairs = Object.keys(tickers);

            const convertedTickers = pairs.reduce((result, pair) => {
                result[pair] = tickers[pair].ticker;

                return result;
            }, {});
            yield put(marketsTickersData(convertedTickers));
        }
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: marketsTickersError,
            },
        }));
    }
}
