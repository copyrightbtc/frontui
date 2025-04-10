import { RootState } from '../..';
import { CommonError } from '../../types';
import { P2PConversation } from './types';

export const selectP2PConversations = (state: RootState): P2PConversation[] => {
    return state.user.p2pConversations.fetch.data;
}

export const selectP2PConversationsFetchLoading = (state: RootState): boolean =>
    state.user.p2pConversations.fetch.fetching;

export const selectP2PConversationsFetchSuccess = (state: RootState): boolean =>
    state.user.p2pConversations.fetch.success;

export const selectP2PConversationsFetchError = (state: RootState): CommonError | undefined =>
    state.user.p2pConversations.fetch.error;

export const selectP2PConversationsSendFetchLoading = (state: RootState): boolean | undefined =>
    state.user.p2pConversations.send.fetching;

export const selectP2PConversationsSendFetchSuccess = (state: RootState): boolean | undefined =>
    state.user.p2pConversations.send.success;
