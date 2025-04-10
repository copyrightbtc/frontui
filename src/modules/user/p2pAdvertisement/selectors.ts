
import { RootState } from '../..';
import { P2PAdvertisementsState } from './reducer';
import { P2PAdvertisement } from './types';


//#region P2PAdvertisements
const selectP2PAdvertisementsState = (state: RootState): P2PAdvertisementsState => state.user.p2pAdvertisements;

export const selectP2PAdvertisements = (state: RootState): P2PAdvertisement[] =>
    selectP2PAdvertisementsState(state).list;

export const selectP2PAdvertisementsLoading = (state: RootState): boolean | undefined =>
    selectP2PAdvertisementsState(state).loading;

export const selectP2PAdvertisementsTimestamp = (state: RootState): number | undefined =>
    selectP2PAdvertisementsState(state).timestamp;

export const selectShouldFetchP2PAdvertisements = (state: RootState): boolean =>
    !selectP2PAdvertisementsTimestamp(state) && !selectP2PAdvertisementsLoading(state);

//#end region