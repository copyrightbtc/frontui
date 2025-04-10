import { CommonError } from '../../types';
import { ADVERTISER_DATA, ADVERTISER_ERROR, ADVERTISER_FEEDBACK_DATA, ADVERTISER_FEEDBACK_FETCH, ADVERTISER_FETCH } from './constants';
import { Advertiser, AdvertiserFeedback, FeedbackFilter } from './types';

//#region Advertisers
export interface AdvertiserFetch {
    type: typeof ADVERTISER_FETCH;
    payload: string,
}

export interface AdvertiserData {
    type: typeof ADVERTISER_DATA;
    payload: {
        advertiser: Advertiser;
        feedbacks: AdvertiserFeedback[];
    };
}

export interface AdvertiserError {
    type: typeof ADVERTISER_ERROR;
    error: CommonError;
}

export interface AdvertiserFeedbackFetch {
    type: typeof ADVERTISER_FEEDBACK_FETCH;
    payload: FeedbackFilter,
}

export interface AdvertiserFeedbackData {
    type: typeof ADVERTISER_FEEDBACK_DATA;
    payload: AdvertiserFeedback[];
}

export type AdvertiserAction =
    AdvertiserFetch
    | AdvertiserFeedbackFetch
    | AdvertiserFeedbackData
    | AdvertiserData
    | AdvertiserError;

export const advertiserFetch = (payload: string): AdvertiserFetch => ({
    type: ADVERTISER_FETCH,
    payload,
});

export const advertiserData = (payload: AdvertiserData['payload']): AdvertiserData => ({
    type: ADVERTISER_DATA,
    payload,
});

export const advertiserError = (error: CommonError): AdvertiserError => ({
    type: ADVERTISER_ERROR,
    error,
});

export const advertiserFeedbackFetch = (payload: FeedbackFilter): AdvertiserFeedbackFetch => ({
    type: ADVERTISER_FEEDBACK_FETCH,
    payload,
});

export const advertiserFeedbackData = (payload: AdvertiserFeedbackData["payload"]): AdvertiserFeedbackData => ({
    type: ADVERTISER_FEEDBACK_DATA,
    payload,
});


//endRegion