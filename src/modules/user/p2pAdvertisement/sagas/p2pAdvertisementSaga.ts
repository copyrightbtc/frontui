import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { alertPush, sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { 
    P2PAdvertisementAmountChangeFetch,
    p2pAdvertisementMutationData,
    P2PAdvertisementPriceChangeFetch,
    p2pAdvertisementsData, 
    p2pAdvertisementsError, 
    P2PAdvertisementsFetch,
    P2PAdvertisementStateChangeFetch, 
    p2pCreateAdvertisementData, 
    P2PCreateAdvertisementFetch,
    p2pDeleteAdvertisementData,
    P2PDeleteAdvertisementFetch,
    P2PUpdateAdvertisementFetch
} from '../actions';
import { P2P_ADVERTISEMENTS_AMOUNT_CHANGE_FETCH, P2P_ADVERTISEMENTS_FETCH, P2P_ADVERTISEMENTS_PRICE_CHANGE_FETCH, P2P_ADVERTISEMENTS_STATE_CHANGE_FETCH, P2P_CREATE_ADVERTISEMENTS_FETCH, P2P_DELETE_ADVERTISEMENTS_FETCH, P2P_UPDATE_ADVERTISEMENTS_FETCH } from '../constants';
import { toQueryString } from '../helpers';
import { getCsrfToken } from '../../../../helpers';

const p2pAdsOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: "tradesfor",
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* rootP2PAdvertisementsSaga() {
    yield takeEvery(P2P_ADVERTISEMENTS_FETCH, p2pAdvertisementsFetchSaga);
    yield takeLatest(P2P_ADVERTISEMENTS_STATE_CHANGE_FETCH, p2pAdvertisementStateChangeFetchSaga);
    yield takeLatest(P2P_ADVERTISEMENTS_PRICE_CHANGE_FETCH, p2pAdvertisementPriceChangeFetchSaga);
    yield takeLatest(P2P_ADVERTISEMENTS_AMOUNT_CHANGE_FETCH, p2pAdvertisementAmountChangeFetchSaga);
    yield takeLatest(P2P_CREATE_ADVERTISEMENTS_FETCH, p2pCreateAdvertisementFetchSaga);
    yield takeLatest(P2P_DELETE_ADVERTISEMENTS_FETCH, p2pDeleteAdvertisementFetchSaga);
    yield takeLatest(P2P_UPDATE_ADVERTISEMENTS_FETCH, p2pUpdateAdvertisementFetchSaga);
}

export function* p2pAdvertisementsFetchSaga(action: P2PAdvertisementsFetch) {
    try {
        const query = action.payload;
        const advertisements = yield call(API.get(p2pAdsOptions(getCsrfToken())), `/p2p/advertisements${toQueryString(query)}`);
        yield put(p2pAdvertisementsData(advertisements));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pAdvertisementsError,
            },
        }));
    }
}

export function* p2pAdvertisementStateChangeFetchSaga(stateAction: P2PAdvertisementStateChangeFetch) {
    try {
        const { id, action } = stateAction.payload;
        const advertisement = yield call(API.post(p2pAdsOptions(getCsrfToken())), `/p2p/advertisements/${id}/${action}`);
        yield put(p2pAdvertisementMutationData(advertisement));
        yield put(alertPush({ message: ['success.data.adv.changed'], type: 'success'}));  
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pAdvertisementsError,
            },
        }));
    }
}

export function* p2pAdvertisementPriceChangeFetchSaga(action: P2PAdvertisementPriceChangeFetch) {
    try {
        const advertisement = yield call(API.put(p2pAdsOptions(getCsrfToken())), `/p2p/advertisements/${action.payload.id}/price`, { ...action.payload });
        yield put(p2pAdvertisementMutationData(advertisement));
        yield put(alertPush({ message: ['success.data.adv.changed'], type: 'success'}));  
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pAdvertisementsError,
            },
        }));
    }
}

export function* p2pAdvertisementAmountChangeFetchSaga(action: P2PAdvertisementAmountChangeFetch) {
    try {
        const { id, amount, type } = action.payload;
        const advertisement = yield call(API.post(p2pAdsOptions(getCsrfToken())), `/p2p/advertisements/${id}/${type}_amount`, { id, amount });
        yield put(p2pAdvertisementMutationData(advertisement));
        yield put(alertPush({ message: ['success.data.adv.changed'], type: 'success'}));  
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pAdvertisementsError,
            },
        }));
    }
}

export function* p2pCreateAdvertisementFetchSaga(action: P2PCreateAdvertisementFetch) {
    try {
        const request = action.payload;
        const advertisement = yield call(API.post(p2pAdsOptions(getCsrfToken())), `/p2p/advertisements`, request);
        yield put(p2pCreateAdvertisementData(advertisement));
        yield put(alertPush({ message: ['success.data.adv.created'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pAdvertisementsError,
            },
        }));
    }
}

export function* p2pUpdateAdvertisementFetchSaga(action: P2PUpdateAdvertisementFetch) {
    try {
        const request = action.payload;
        const advertisement = yield call(API.put(p2pAdsOptions(getCsrfToken())), `/p2p/advertisements/${request.id}`, request);
        yield put(p2pAdvertisementMutationData(advertisement));
        yield put(alertPush({ message: ['success.data.adv.changed'], type: 'success'}));  
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pAdvertisementsError,
            },
        }));
    }
}

export function* p2pDeleteAdvertisementFetchSaga(action: P2PDeleteAdvertisementFetch) {
    try {
        yield call(API.post(p2pAdsOptions(getCsrfToken())), `/p2p/advertisements/${action.payload}/delete`);
        yield put(p2pDeleteAdvertisementData(action.payload));
        yield put(alertPush({ message: ['success.data.adv.deleted'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pAdvertisementsError,
            },
        }));
    }
}
