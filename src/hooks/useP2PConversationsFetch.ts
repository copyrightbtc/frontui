import * as React from 'react';
import { useDispatch } from 'react-redux';
import { p2pConversationsFetch } from '../modules/user/p2pConversations';

export const useP2PConversationsFetch = (tid: string) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(p2pConversationsFetch({tid}));
    }, [dispatch, tid]);
};
