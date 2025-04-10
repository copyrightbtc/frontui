import * as React from 'react';
import { useDispatch } from 'react-redux';
import { paymentsFetch } from '../modules/user/payments';

export const usePaymentsFetch = (page: number, limit: number) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(paymentsFetch({page, limit}));
    }, [dispatch, page, limit]);
};
