import { call, put, takeLeading } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { 
    advertisementsData, 
    advertisementsError, 
    AdvertisementsFetch, 
} from '../actions';
import { ADVERTISEMENTS_FETCH } from '../constants';
import { toQueryString } from '../helpers';

const advertisementsOptions: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* rootAdvertisementsSaga() {
    yield takeLeading(ADVERTISEMENTS_FETCH, advertisementsFetchSaga);
}

export function* advertisementsFetchSaga(action: AdvertisementsFetch) {
    try {
        const query = action.payload;
        const advertisements = yield call(API.get(advertisementsOptions), `/public/p2p/advertisements${toQueryString(query)}`);
        yield put(advertisementsData(advertisements));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: advertisementsError,
            },
        }));
    }
}