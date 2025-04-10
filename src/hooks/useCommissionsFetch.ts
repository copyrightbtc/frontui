import * as React from 'react';
import { useDispatch } from 'react-redux';
import { commissionsFetch } from '../modules/user/commissions';

export const useCommissionsFetch = (page: number, limit: number) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(commissionsFetch({page, limit}));
    }, [dispatch, page, limit]);
};
