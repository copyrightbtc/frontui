import { RootState } from '../..';

export const selectUsernameSuccess = (state: RootState): boolean | undefined =>
    state.user.username.fetch.success;
