import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { invitesOverviewData, invitesOverviewError, InvitesOverviewFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* invitesOverviewSaga(action: InvitesOverviewFetch) {
    try {
        const overview = yield call(API.get(config), '/account/invites/overview'); 
        yield put(invitesOverviewData(overview));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: invitesOverviewError,
            },
        }));
    }
}
