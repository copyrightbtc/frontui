import { CommonState } from '../../types';
import { AdvertisementsAction } from './actions';
import {
    ADVERTISEMENTS_DATA,
    ADVERTISEMENTS_ERROR,
    ADVERTISEMENTS_FETCH,
} from './constants';
import { Advertisement } from './types';


//#region Advertisements
export interface AdvertisementsState extends CommonState {
    list: Advertisement[];
    loading: boolean;
    timestamp?: number;
}


export const initialAdvertisementsState: AdvertisementsState = { 
    list: [],
    loading: false,
};

export const advertisementsReducer = (state = initialAdvertisementsState, action: AdvertisementsAction) => {
    switch (action.type) {
        case ADVERTISEMENTS_FETCH:
            return {
                ...state,
                loading: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case ADVERTISEMENTS_DATA:  
            return {
                ...state,
                loading: false,
                list: action.payload,
            };
        case ADVERTISEMENTS_ERROR:
            return {
                ...state,
                loading: false,
            }; 
        default:
            return state;
    }
};

//#end region