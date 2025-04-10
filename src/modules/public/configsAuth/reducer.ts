import { CommonError, CommonState } from '../../types';
import { ConfigsAuthAction } from './actions';
import {
    CONFIGS_DATA,
    CONFIGS_ERROR,
    CONFIGS_FETCH,
} from './constants';
import { ConfigsAuth } from './types';

export interface ConfigsAuthState extends CommonState {
    data: ConfigsAuth;
    loading: boolean;
    success: boolean;
    error?: CommonError;
}

const defaultConfigs: ConfigsAuth = {
    captcha_type: 'none',
    captcha_id: '6LcUp-QpAAAAADwWOEuheI_1o12N0SetvjKVYP32',
    password_min_entropy: 0,
};

export const initialConfigsAuthState: ConfigsAuthState = {
    loading: false,
    success: false,
    data: defaultConfigs,
};

export const configsAuthReducer = (state = initialConfigsAuthState, action: ConfigsAuthAction) => {
    switch (action.type) {
        case CONFIGS_FETCH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        case CONFIGS_DATA:
            return {
                ...state,
                loading: false,
                success: true,
                data: action.payload,
            };
        case CONFIGS_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};
