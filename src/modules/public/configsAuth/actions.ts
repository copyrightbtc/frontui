import { CommonError } from '../../types';
import {
    CONFIGS_DATA,
    CONFIGS_ERROR,
    CONFIGS_FETCH,
} from './constants';
import { ConfigsAuth } from './types';

export interface ConfigsAuthFetch {
    type: typeof CONFIGS_FETCH;
}

export interface ConfigsAuthData {
    type: typeof CONFIGS_DATA;
    payload: ConfigsAuth;
}

export interface ConfigsAuthError {
    type: typeof CONFIGS_ERROR;
    error: CommonError;
}

export type ConfigsAuthAction =
    ConfigsAuthFetch
    | ConfigsAuthData
    | ConfigsAuthError;

export const configsAuthFetch = (): ConfigsAuthFetch => ({
    type: CONFIGS_FETCH,
});

export const configsAuthData = (payload: ConfigsAuthData['payload']): ConfigsAuthData => ({
    type: CONFIGS_DATA,
    payload,
});

export const configsAuthError = (error: CommonError): ConfigsAuthError => ({
    type: CONFIGS_ERROR,
    error,
});
