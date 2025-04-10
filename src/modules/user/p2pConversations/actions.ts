import { ConversationMessage } from '../../../screens/P2PTradeScreen/types';
import { CommonError } from '../../types';
import {
  P2PCONVERSATIONS_DATA,
  P2PCONVERSATIONS_ERROR,
  P2PCONVERSATIONS_FETCH,
  P2PCONVERSATIONS_PUSH_EMIT,
  P2PCONVERSATIONS_PUSH_FINISH,
  P2PCONVERSATIONS_SEND_DATA,
  P2PCONVERSATIONS_SEND_ERROR,
  P2PCONVERSATIONS_SEND_FETCH,
} from './constants';
import { P2PConversation } from './types';


export interface P2PConversationsFetch {
  type: typeof P2PCONVERSATIONS_FETCH;
  payload: {
    tid: string;
  }
}

export interface P2PConversationsData {
  type: typeof P2PCONVERSATIONS_DATA;
  payload: {
    list: P2PConversation[];
  };
}

export interface P2PConversationsError {
  type: typeof P2PCONVERSATIONS_ERROR;
  error: CommonError;
}

export interface P2PConversationsSendFetch {
  type: typeof P2PCONVERSATIONS_SEND_FETCH;
  payload: {
    tid: string;
    data: FormData;
  }
}

export interface P2PConversationsSendData {
  type: typeof P2PCONVERSATIONS_SEND_DATA;
}

export interface P2PConversationsSendError {
  type: typeof P2PCONVERSATIONS_SEND_ERROR;
  error: CommonError;
}

export interface P2PConversationsPush {
  type: typeof P2PCONVERSATIONS_PUSH_EMIT;
  payload: ConversationMessage;
}

export interface P2PConversationsPushFinish {
  type: typeof P2PCONVERSATIONS_PUSH_FINISH;
  payload: ConversationMessage[];
}

export type P2PConversationsAction = P2PConversationsFetch | P2PConversationsData | P2PConversationsError | P2PConversationsSendFetch | P2PConversationsSendData | P2PConversationsSendError | P2PConversationsPush | P2PConversationsPushFinish;

export const p2pConversationsFetch = (payload: P2PConversationsFetch['payload']): P2PConversationsFetch => ({
  type: P2PCONVERSATIONS_FETCH,
  payload,
});

export const p2pConversationsData = (payload: P2PConversationsData['payload']): P2PConversationsData => ({
  type: P2PCONVERSATIONS_DATA,
  payload,
});

export const p2pConversationsError = (error: CommonError): P2PConversationsError => ({
  type: P2PCONVERSATIONS_ERROR,
  error,
});

export const p2pConversationsSendFetch = (payload: P2PConversationsSendFetch['payload']): P2PConversationsSendFetch => ({
  type: P2PCONVERSATIONS_SEND_FETCH,
  payload,
});

export const p2pConversationsSendData = (): P2PConversationsSendData => ({
  type: P2PCONVERSATIONS_SEND_DATA,
});

export const p2pConversationsSendError = (error: CommonError): P2PConversationsSendError => ({
  type: P2PCONVERSATIONS_SEND_ERROR,
  error,
});

export const pushP2PConversationsEmit = (payload: ConversationMessage): P2PConversationsPush => ({
  type: P2PCONVERSATIONS_PUSH_EMIT,
  payload,
});

export const pushP2PConversationsFinish = (payload: ConversationMessage[]): P2PConversationsPushFinish => ({
  type: P2PCONVERSATIONS_PUSH_FINISH,
  payload,
});
