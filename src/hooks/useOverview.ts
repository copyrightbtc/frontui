import * as React from 'react';
import { useDispatch } from 'react-redux';
import { invitesOverviewFetch } from '../modules';

export const useOverview = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(invitesOverviewFetch());
    }, [dispatch]);
};
