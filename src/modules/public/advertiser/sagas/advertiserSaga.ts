import { call, put, takeEvery, takeLeading } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { AdvertiserFeedbackFetch, AdvertiserFetch, advertiserData, advertiserError, advertiserFeedbackData } from '../actions';
import { ADVERTISER_FEEDBACK_FETCH, ADVERTISER_FETCH } from '../constants';

const advertiserOptions: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* rootAdvertiserSaga() {
    yield takeLeading(ADVERTISER_FETCH, advertiserFetchSaga);
    yield takeEvery(ADVERTISER_FEEDBACK_FETCH, advertiserFeedbackFetchSaga);
}

export function* advertiserFetchSaga(action: AdvertiserFetch) {
    try {
        const uid = action.payload;
        const advertiser = yield call(API.get(advertiserOptions), `/public/p2p/profile/${uid}`);
        yield put(advertiserData({ advertiser, feedbacks: [] }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: advertiserError,
            },
        }));
    }
}

export function* advertiserFeedbackFetchSaga(action: AdvertiserFeedbackFetch) {
    try {
        const { uid, page, limit } = action.payload;
        const feedbacks = yield call(API.get(advertiserOptions), `/public/p2p/profile/${uid}/feedbacks?page=${page}&limit=${limit}`);
        yield put(advertiserFeedbackData(feedbacks));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: advertiserError,
            },
        }));
    }
}
