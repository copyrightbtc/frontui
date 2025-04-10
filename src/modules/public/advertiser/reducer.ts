import { CommonState } from '../../types';
import { AdvertiserAction } from './actions';
import {
    ADVERTISER_DATA,
    ADVERTISER_ERROR,
    ADVERTISER_FEEDBACK_DATA,
    ADVERTISER_FEEDBACK_FETCH,
    ADVERTISER_FETCH
} from './constants';
import { Advertiser, AdvertiserFeedback } from './types';


//#region Advertisers
export interface AdvertiserState extends CommonState {
    advertiser: Advertiser | null;
    feedbacks: AdvertiserFeedback[];
    loading: boolean;
    timestamp?: number;
}


export const initialAdvertiserState: AdvertiserState = {
    advertiser: null,
    feedbacks: [],
    loading: false,
};

export const advertiserReducer = (state = initialAdvertiserState, action: AdvertiserAction) => {
    switch (action.type) {
        case ADVERTISER_FEEDBACK_FETCH:
        case ADVERTISER_FETCH:
            return {
                ...state,
                loading: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case ADVERTISER_DATA:
            return {
                ...state,
                loading: false,
                advertiser: action.payload.advertiser,
                feedbacks: action.payload.feedbacks,
            };
        case ADVERTISER_FEEDBACK_DATA:
            return {
                
                ...state,
                loading: false,
                feedbacks: action.payload,
            }
        case ADVERTISER_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

//#end region
