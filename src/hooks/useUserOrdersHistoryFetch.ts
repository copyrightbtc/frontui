import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Market } from '../modules/public/markets';
import { userOrdersHistoryFetch } from '../modules';

export const useUserOrdersHistoryFetch = (pageIndex, type, limit, markets?: Market) => {
    const dispatch = useDispatch();
    const id = markets?.id;

    React.useEffect(() => {
        dispatch(userOrdersHistoryFetch({ pageIndex, type, limit, markets: { id } as Market }));
    }, [dispatch, pageIndex, type, limit, markets]);
};