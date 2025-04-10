import { RootState } from '../..';
import { CommonError } from '../../types';
import { ConfigsAuth } from './types';

export const selectAuthConfigs = (state: RootState): ConfigsAuth =>
    state.public.configsAuth.data;

export const selectAuthConfigsSuccess = (state: RootState): boolean =>
    state.public.configsAuth.success;

export const selectAuthConfigsLoading = (state: RootState): boolean =>
    state.public.configsAuth.loading;

export const selectAuthConfigsError = (state: RootState): CommonError | undefined =>
    state.public.configsAuth.error;
