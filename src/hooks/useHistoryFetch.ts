import * as React from 'react';
import { useDispatch } from 'react-redux';
import { fetchHistory } from '../modules';

const reFetchInterval = 5000; // In MS' (5000 = 5 seconds)

export const useHistoryFetch = ({ type, currency, limit = 6, page = 0 }) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        // Initial fetch
        dispatch(fetchHistory({ type, limit, currency, page }));
        
        // Setup interval
        const interval = setInterval(() => {
            dispatch(fetchHistory({ type, limit, currency, page }));
        }, reFetchInterval);

        // Cleanup
        return () => clearInterval(interval);
    }, [dispatch, type, currency, limit, page]);
};