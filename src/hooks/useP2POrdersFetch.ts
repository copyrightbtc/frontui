import * as React from 'react';
import { useDispatch } from 'react-redux';
import { p2pOrdersFetch } from '../modules/user/p2pOrders';

export const useP2POrdersFetch = (page: number, limit: number, state: string, side: string) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(p2pOrdersFetch({
            page,
            limit,
            side: side === 'all' ? '' : side,
            state: state === 'all' ? '' : state,
        }));
    }, [dispatch, page, limit, state, side]);
};
