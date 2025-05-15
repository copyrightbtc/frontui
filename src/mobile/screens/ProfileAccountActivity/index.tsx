import * as React from 'react';
import { useSelector } from 'react-redux';
import { Pagination, NoResultData } from '../../../components';
import { useUserActivityFetch } from '../../../hooks';
import {
    RootState,
    selectUserActivity,
    selectUserActivityCurrentPage,
    selectUserActivityFirstElemIndex,
    selectUserActivityLastElemIndex,
    selectUserActivityNextPageExists,
} from '../../../modules';
import { UserActivityItem } from '../../components';

const DEFAULT_LIMIT = 10;

const ProfileAccountActivityMobileScreenComponent: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState(0);
    const page = useSelector(selectUserActivityCurrentPage);
    const userActivity = useSelector(selectUserActivity);
    const firstElemIndex = useSelector((state: RootState) => selectUserActivityFirstElemIndex(state, DEFAULT_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectUserActivityLastElemIndex(state, DEFAULT_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectUserActivityNextPageExists(state, DEFAULT_LIMIT));
    useUserActivityFetch({page: currentPage, limit: DEFAULT_LIMIT});

    const onClickPrevPage = () => {
        setCurrentPage(Number(page) - 1);
    };
    const onClickNextPage = () => {
        setCurrentPage(Number(page) + 1);
    };

    return ( 
        <div className="mobile-profile-account-activity">
            {userActivity.length ? 
                <div className="mobile-profile-account-activity__list">
                    {userActivity.map((item, index) => <UserActivityItem key={index} item={item} />)}
                </div> : 
                <div className="mobile-profile-account-activity__list--empty">
                    <NoResultData class="themes" /> 
                </div>
            }
            {userActivity.length > DEFAULT_LIMIT ?
            <Pagination
                firstElemIndex={firstElemIndex}
                lastElemIndex={lastElemIndex}
                page={currentPage}
                nextPageExists={nextPageExists}
                onClickPrevPage={onClickPrevPage}
                onClickNextPage={onClickNextPage}
            /> : null}
        </div> 
    );
};

export const ProfileAccountActivityMobileScreen = React.memo(ProfileAccountActivityMobileScreenComponent);
