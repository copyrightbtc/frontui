import * as React from 'react';
import { useDispatch } from 'react-redux';
import { invitesFetch } from '../modules/user/invites';

export const useInvitesFetch = (page: number, limit: number) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(invitesFetch({page, limit}));
    }, [dispatch, page, limit]);
};