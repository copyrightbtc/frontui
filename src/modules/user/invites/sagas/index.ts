import { takeLatest } from 'redux-saga/effects';
import { invitesSaga } from './invitesSaga';
import { INVITES_FETCH, INVITES_OVERVIEW_FETCH } from '../constants';
import { invitesOverviewSaga } from './invitesOverviewSaga';

export function* rootInvitesSaga() {
    yield takeLatest(INVITES_FETCH, invitesSaga);
    yield takeLatest(INVITES_OVERVIEW_FETCH, invitesOverviewSaga);
}
