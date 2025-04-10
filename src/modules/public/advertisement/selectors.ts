
import { RootState } from '../..';
import { AdvertisementsState } from './reducer';
import { Advertisement } from './types';


//#region Advertisements
const selectAdvertisementsState = (state: RootState): AdvertisementsState => state.public.advertisements;

export const selectAdvertisements = (state: RootState): Advertisement[] =>
    selectAdvertisementsState(state).list;

export const selectAdvertisementsLoading = (state: RootState): boolean | undefined =>
    selectAdvertisementsState(state).loading;

export const selectAdvertisementsTimestamp = (state: RootState): number | undefined =>
    selectAdvertisementsState(state).timestamp;

export const selectShouldFetchAdvertisements = (state: RootState): boolean =>
    !selectAdvertisementsTimestamp(state) && !selectAdvertisementsLoading(state);

//#end region