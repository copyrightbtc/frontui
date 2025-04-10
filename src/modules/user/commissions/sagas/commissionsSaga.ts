import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { commissionsData, commissionsError, CommissionsFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* commissionsSaga(action: CommissionsFetch) {
    try {
        const { page, limit } = action.payload;
        const commissions = yield call(API.get(config), `/account/commissions?page=${page}&limit=${limit}`);
        let nextPageExists = false;

        if (commissions.length === action.payload.limit) {
            const checkData = yield call(API.get(config), `/account/commissions?page=${(page) * limit + 1}&limit=${1}`);

            if (checkData.length === 1) {
                nextPageExists = true;
            }
        }

        yield put(commissionsData({ list: commissions, page, nextPageExists }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: commissionsError,
            },
        }));
    }
}
