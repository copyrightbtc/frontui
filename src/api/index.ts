import { AxiosResponse } from 'axios';
import { JsonBody, makeRequest } from './requestBuilder';

export * from './config';

export interface RequestOptions {
    apiVersion: 'applogic' | 'tradesfor' | 'authsfor' | 'p2p';
    withHeaders?: boolean;
    headers?: any;
}

export type RequestBody = JsonBody | FormData;

export type RequestMethod = (
    config: RequestOptions
) => (url: string, body?: RequestBody) => Promise<AxiosResponse['data']>;

export interface ApiWrapper {
    get: RequestMethod;
    post: RequestMethod;
    patch: RequestMethod;
    put: RequestMethod;
    delete: RequestMethod;
}

export const API: ApiWrapper = {
    get: (config: RequestOptions) => async (url: string) =>
        makeRequest(
            {
                method: 'get',
                url,
            },
            config
        ),

    post: (config: RequestOptions) => async (url: string, body?: JsonBody) =>
        makeRequest(
            {
                method: 'post',
                body,
                url,
            },
            config
        ),

    patch: (config: RequestOptions) => async (url: string, body?: JsonBody) =>
        makeRequest(
            {
                method: 'patch',
                body,
                url,
            },
            config
        ),

    put: (config: RequestOptions) => async (url: string, body?: JsonBody) =>
        makeRequest(
            {
                method: 'put',
                body,
                url,
            },
            config
        ),

    delete: (config: RequestOptions) => async (url: string, body?: JsonBody) =>
        makeRequest(
            {
                method: 'delete',
                body,
                url,
            },
            config
        ),
};
