import * as React from 'react';
import { useDispatch } from 'react-redux';
import { p2pTradeFetch } from '../modules/user/p2pTrade';

export const useP2PTradeFetch = (tid: string) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(p2pTradeFetch({tid}));
    }, [dispatch, tid]);
};
