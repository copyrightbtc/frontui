import { Advertisement, AdvertisementFilter } from '../../public/advertisement';
import { CommonError } from '../../types';
import { 
    P2P_ADVERTISEMENTS_DATA, 
    P2P_ADVERTISEMENTS_ERROR, 
    P2P_ADVERTISEMENTS_FETCH, 
    P2P_UPDATE_ADVERTISEMENTS_DATA,
    P2P_ADVERTISEMENTS_STATE_CHANGE_FETCH, 
    P2P_CREATE_ADVERTISEMENTS_FETCH,
    P2P_DELETE_ADVERTISEMENTS_DATA,
    P2P_DELETE_ADVERTISEMENTS_FETCH,
    P2P_CREATE_ADVERTISEMENTS_DATA,
    P2P_ADVERTISEMENTS_PRICE_CHANGE_FETCH,
    P2P_ADVERTISEMENTS_AMOUNT_CHANGE_FETCH,
    P2P_UPDATE_ADVERTISEMENTS_FETCH
} from './constants';
import { P2PAdvertisementAmountChangeRequest, P2PAdvertisementCreateRequest, P2PAdvertisementPriceChangeRequest, P2PAdvertisementStateChangeRequest, P2PAdvertisementUpdateRequest } from './types';

export interface P2PAdvertisementsFetch {
    type: typeof P2P_ADVERTISEMENTS_FETCH;
    payload: AdvertisementFilter;
}

export interface P2PAdvertisementsData {
    type: typeof P2P_ADVERTISEMENTS_DATA;
    payload: Advertisement[];
}

export interface P2PAdvertisementsError {
    type: typeof P2P_ADVERTISEMENTS_ERROR;
    error: CommonError;
}

export interface P2PAdvertisementMutationData {
    type: typeof P2P_UPDATE_ADVERTISEMENTS_DATA;
    payload: Advertisement;
}

export interface P2PAdvertisementStateChangeFetch {
    type: typeof P2P_ADVERTISEMENTS_STATE_CHANGE_FETCH;
    payload: P2PAdvertisementStateChangeRequest;
}

export interface P2PAdvertisementPriceChangeFetch {
    type: typeof P2P_ADVERTISEMENTS_PRICE_CHANGE_FETCH;
    payload: P2PAdvertisementPriceChangeRequest;
}

export interface P2PCreateAdvertisementFetch {
    type: typeof P2P_CREATE_ADVERTISEMENTS_FETCH;
    payload: P2PAdvertisementCreateRequest;
}

export interface P2PCreateAdvertisementData {
    type: typeof P2P_CREATE_ADVERTISEMENTS_DATA;
    payload: Advertisement;
}

export interface P2PUpdateAdvertisementFetch {
    type: typeof P2P_UPDATE_ADVERTISEMENTS_FETCH;
    payload: P2PAdvertisementUpdateRequest;
}

export interface P2PDeleteAdvertisementFetch {
    type: typeof P2P_DELETE_ADVERTISEMENTS_FETCH;
    payload: number;
}

export interface P2PDeleteAdvertisementData {
    type: typeof P2P_DELETE_ADVERTISEMENTS_DATA;
    payload: number;
}

export interface P2PAdvertisementAmountChangeFetch {
    type: typeof P2P_ADVERTISEMENTS_AMOUNT_CHANGE_FETCH;
    payload: P2PAdvertisementAmountChangeRequest;
}

export type P2PAdvertisementsAction =
    P2PAdvertisementsFetch
    | P2PAdvertisementsData
    | P2PAdvertisementStateChangeFetch
    | P2PAdvertisementPriceChangeFetch
    | P2PAdvertisementAmountChangeFetch
    | P2PCreateAdvertisementFetch
    | P2PCreateAdvertisementData
    | P2PDeleteAdvertisementFetch
    | P2PDeleteAdvertisementData
    | P2PUpdateAdvertisementFetch
    | P2PAdvertisementMutationData
    | P2PAdvertisementsError;

//#region P2PAdvertisements
export const p2pAdvertisementsFetch = (payload: AdvertisementFilter): P2PAdvertisementsFetch => ({
    type: P2P_ADVERTISEMENTS_FETCH,
    payload,
});

export const p2pAdvertisementsData = (payload: P2PAdvertisementsData['payload']): P2PAdvertisementsData => ({
    type: P2P_ADVERTISEMENTS_DATA,
    payload,
});

export const p2pAdvertisementsError = (error: CommonError): P2PAdvertisementsError => ({
    type: P2P_ADVERTISEMENTS_ERROR,
    error,
});
//endRegion

//#region P2PAdvertisement mutation
export const p2pAdvertisementMutationData = (payload: P2PAdvertisementMutationData['payload']): P2PAdvertisementMutationData => ({
    type: P2P_UPDATE_ADVERTISEMENTS_DATA,
    payload,
});
export const p2pDeleteAdvertisementData = (payload: P2PDeleteAdvertisementData['payload']): P2PDeleteAdvertisementData => ({
    type: P2P_DELETE_ADVERTISEMENTS_DATA,
    payload,
});
export const p2pAdvertisementStateChangeFetch = (payload: P2PAdvertisementStateChangeRequest): P2PAdvertisementStateChangeFetch => ({
    type: P2P_ADVERTISEMENTS_STATE_CHANGE_FETCH,
    payload,
});
export const p2pAdvertisementPriceChangeFetch = (payload: P2PAdvertisementPriceChangeFetch["payload"]): P2PAdvertisementPriceChangeFetch => ({
    type: P2P_ADVERTISEMENTS_PRICE_CHANGE_FETCH,
    payload,
});
export const p2pAdvertisementAmountChangeFetch = (payload: P2PAdvertisementAmountChangeFetch["payload"]): P2PAdvertisementAmountChangeFetch => ({
    type: P2P_ADVERTISEMENTS_AMOUNT_CHANGE_FETCH,
    payload,
});
export const p2pCreateAdvertisementFetch = (payload: P2PAdvertisementCreateRequest): P2PCreateAdvertisementFetch => ({
    type: P2P_CREATE_ADVERTISEMENTS_FETCH,
    payload,
});
export const p2pCreateAdvertisementData = (payload: P2PCreateAdvertisementData['payload']): P2PCreateAdvertisementData => ({
    type: P2P_CREATE_ADVERTISEMENTS_DATA,
    payload,
});
export const p2pUpdateAdvertisementFetch = (payload: P2PAdvertisementUpdateRequest): P2PUpdateAdvertisementFetch => ({
    type: P2P_UPDATE_ADVERTISEMENTS_FETCH,
    payload,
})
export const p2pDeleteAdvertisementFetch = (payload: number): P2PDeleteAdvertisementFetch => ({
    type: P2P_DELETE_ADVERTISEMENTS_FETCH,
    payload,
});
export const updateP2PAdvertisementEmit = (payload: Advertisement): P2PAdvertisementMutationData => ({
    type: P2P_UPDATE_ADVERTISEMENTS_DATA,
    payload
})
//endRegion