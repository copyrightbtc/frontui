import * as React from 'react';
import { useDispatch } from 'react-redux';
import { fetchHistory } from '../modules';

export const useHistoryFetch = ({ type, currency, limit = 6, page = 0 }) => {
    const dispatch = useDispatch();
    let fetchIntervalId = null;

    React.useEffect(() => {
        setInterval(() => {
            dispatch(fetchHistory({ type, limit, currency, page }));
        }, 5000);
    }, [dispatch, type, currency, limit, page]);
};