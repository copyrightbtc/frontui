import { CommonState } from '../../types';
import { P2PAdvertisementsAction } from './actions';
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
    P2P_UPDATE_ADVERTISEMENTS_FETCH
} from './constants';
import { P2PAdvertisement } from './types';


//#region PAdvertisements
export interface P2PAdvertisementsState extends CommonState {
    list: P2PAdvertisement[];
    loading: boolean;
    timestamp?: number;
}

export const initialP2PAdvertisementsState: P2PAdvertisementsState = {
    list: [],
    loading: false,
};

export const p2pAdvertisementsReducer = (state = initialP2PAdvertisementsState, action: P2PAdvertisementsAction) => {
    switch (action.type) {
        case P2P_ADVERTISEMENTS_STATE_CHANGE_FETCH:
        case P2P_ADVERTISEMENTS_PRICE_CHANGE_FETCH:
        case P2P_CREATE_ADVERTISEMENTS_FETCH:
        case P2P_DELETE_ADVERTISEMENTS_FETCH:
        case P2P_UPDATE_ADVERTISEMENTS_FETCH:
            return {
                ...state,
                loading: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_ADVERTISEMENTS_FETCH:
            return {
                ...state,
                loading: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_ADVERTISEMENTS_DATA:
            return {
                ...state,
                loading: false,
                list: action.payload,
            };
        case P2P_UPDATE_ADVERTISEMENTS_DATA: 
            return {
                ...state,
                loading: false,
                list: state.list.map(adv => adv.id === action.payload.id ? action.payload : adv),
            };
        case P2P_CREATE_ADVERTISEMENTS_DATA:
            return {
                ...state,
                loading: false,
            };
        case P2P_DELETE_ADVERTISEMENTS_DATA:
            return {
                ...state,
                loading: false,
                list: state.list.filter(adv => adv.id !== action.payload),
            };
        case P2P_ADVERTISEMENTS_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

//#end region