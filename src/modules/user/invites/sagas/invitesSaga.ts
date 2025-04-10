import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { invitesData, invitesError, InvitesFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* invitesSaga(action: InvitesFetch) {
    try {
        const { page, limit } = action.payload;
        const invites = yield call(API.get(config), `/account/invites?page=${page}&limit=${limit}`);
        let nextPageExists = false;

        if (invites.length === action.payload.limit) {
            const checkData = yield call(API.get(config), `/account/invites?page=${(page) * limit + 1}&limit=${1}`);

            if (checkData.length === 1) {
                nextPageExists = true;
            }
        }
        
        yield put(invitesData({ list: invites, page, nextPageExists }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: invitesError,
            },
        }));
    }
}
