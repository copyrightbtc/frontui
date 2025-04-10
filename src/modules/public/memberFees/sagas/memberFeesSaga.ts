import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { memberFeesData, memberFeesError, MemberFeesFetch } from '../actions';

const memberfeesOptions: RequestOptions = {
    apiVersion: 'tradesfor',
};

export function* memberFeesSaga(action: MemberFeesFetch) {
    try {
        const memberFees = yield call(API.get(memberfeesOptions), '/public/trading_fees');
        yield put(memberFeesData(memberFees));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: memberFeesError,
            },
        }));
    }
}
