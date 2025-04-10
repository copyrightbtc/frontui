import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { memberFeesFetch, selectShouldMemberFees } from '../modules';

export const useMemberFees = () => {
    const shouldDispatch = useSelector(selectShouldMemberFees);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(memberFeesFetch());
        }
    }, [shouldDispatch]);
};
