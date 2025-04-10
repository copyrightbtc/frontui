import { CommonError } from '../../types';
import { USERNAME_DATA, USERNAME_ERROR, USERNAME_FETCH } from './constants';

export interface UsernameFetch {
    type: typeof USERNAME_FETCH;
    payload: {
      username: string;
    };
}

export interface UsernameData {
    type: typeof USERNAME_DATA;
}

export interface UsernameError {
    type: typeof USERNAME_ERROR;
    error: CommonError;
}


export type UsernameAction =
    | UsernameFetch
    | UsernameData
    | UsernameError

export const usernameFetch = (payload: UsernameFetch['payload']): UsernameFetch => ({
    type: USERNAME_FETCH,
    payload,
});

export const usernameData = (): UsernameData => ({
    type: USERNAME_DATA,
});

export const usernameError = (error: CommonError): UsernameError => ({
    type: USERNAME_ERROR,
    error,
});
