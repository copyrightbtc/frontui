
import { RootState } from '../..';
import { AdvertiserState } from './reducer';
import { Advertiser, AdvertiserFeedback} from './types';


//#region Advertisers
const selectAdvertisersState = (state: RootState): AdvertiserState => state.public.advertiser;

export const selectAdvertisers = (state: RootState): Advertiser | null =>
    selectAdvertisersState(state).advertiser;

export const selectAdvertiserFeedbacks = (state: RootState): AdvertiserFeedback[] =>
    selectAdvertisersState(state).feedbacks;

export const selectAdvertisersLoading = (state: RootState): boolean | undefined =>
    selectAdvertisersState(state).loading;

export const selectAdvertisersTimestamp = (state: RootState): number | undefined =>
    selectAdvertisersState(state).timestamp;

export const selectShouldFetchAdvertisers = (state: RootState): boolean =>
    !selectAdvertisersTimestamp(state) && !selectAdvertisersLoading(state);

//#end region