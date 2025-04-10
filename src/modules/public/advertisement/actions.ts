import { CommonError } from '../../types';
import { 
    ADVERTISEMENTS_DATA, 
    ADVERTISEMENTS_ERROR, 
    ADVERTISEMENTS_FETCH,
} from './constants';
import { Advertisement, AdvertisementFilter } from './types';

//#region Advertisements
export interface AdvertisementsFetch {
    type: typeof ADVERTISEMENTS_FETCH;
    payload: AdvertisementFilter,
}

export interface AdvertisementsData {
    type: typeof ADVERTISEMENTS_DATA;
    payload: Advertisement[];
}

export interface AdvertisementsError {
    type: typeof ADVERTISEMENTS_ERROR;
    error: CommonError;
}

export type AdvertisementsAction =
    AdvertisementsFetch
    | AdvertisementsData
    | AdvertisementsError;

export const advertisementsFetch = (payload: AdvertisementFilter): AdvertisementsFetch => ({
    type: ADVERTISEMENTS_FETCH,
    payload,
});

export const advertisementsData = (payload: AdvertisementsData['payload']): AdvertisementsData => ({
    type: ADVERTISEMENTS_DATA,
    payload,
});

export const advertisementsError = (error: CommonError): AdvertisementsError => ({
    type: ADVERTISEMENTS_ERROR,
    error,
});

//endRegion
