import React, { FC, ReactElement, useCallback, useEffect, useState, } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'; 
import { useIntl } from "react-intl";
import { TabPanelUnderlines } from '../../components';
import { HistoryElement } from '../../containers/HistoryElement';
import { AccountActivities } from '../../containers/ProfileAccountActivity/AccountActivities';
import { Sidebar, ProfileHeader } from '../../containers';
import { useDocumentTitle } from 'src/hooks';
import {
    fetchHistory,
    marketsFetch,
    resetHistory,
    walletsFetch,
} from '../../modules';

interface ParamTypes {
    routeTab?: string;
}

export const HistoryScreen: FC = (): ReactElement => {
 
    const history = useHistory();

    const { formatMessage } = useIntl();
    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(resetHistory());
        dispatch(marketsFetch());
        dispatch(walletsFetch());
    }, [dispatch]);

    const timeFrom = String(Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000));
    
    useEffect(() => {
        dispatch(fetchHistory({ 
            page: 0, 
            type: 'trades', 
            limit: 25, 
            time_from: timeFrom 
        }));
    }, [dispatch]);

    const { routeTab } = useParams<ParamTypes>();

    const [tab, setTab] = useState<string>('');
    const [tabMapping] = useState<string[]>(['account-activity', 'deposits-history', 'withdraws-history'/*, 'qe-history'*/]);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

    useDocumentTitle(translate('page.body.header.up.titles.history'));

    useEffect(() => {
        if (routeTab) {
            const index = tabMapping.indexOf(routeTab);
            if (index !== -1) {
                setTab(routeTab);
                setCurrentTabIndex(index);
            }
        } else {
            history.push('/history/account-activity');
        }
    }, [routeTab, tabMapping]);

    const onCurrentTabChange = (index: number) => {
        setCurrentTabIndex(index);
        history.push(`/history/${tabMapping[index]}`);
    };

    const onTabChange = (index: number) => {
        if (tab !== tabMapping[index]) {
            setTab(tabMapping[index]);
        }
    };

    const renderTabs = () => {

        return [
            {
                content: currentTabIndex === 0 ? <AccountActivities /> : null,
                label: translate('page.body.history.activity'),
            },
            {
                content: currentTabIndex === 1 ? <HistoryElement type="deposits" /> : null,
                label: translate('page.body.history.deposit'),
            },
            {
                content: currentTabIndex === 2 ? <HistoryElement type="withdraws" /> : null,
                label: translate('page.body.history.withdraw'),
            },
            /*{
                content: currentTabIndex === 3 ? <HistoryElement type="quick_exchange" /> : null,
                label: translate('page.body.history.quick'),
            }*/
        ];
    };
 
    return (
        <div className="accountpage-wrapper">
            <Sidebar />
            <div className="accountpage-wrapper__right">
                <ProfileHeader />
                <div className="profile-history">
                    <TabPanelUnderlines
                        panels={renderTabs()}
                        onTabChange={onTabChange}
                        currentTabIndex={currentTabIndex}
                        onCurrentTabChange={onCurrentTabChange}
                        borders={true}
                    />
                </div> 
            </div>
        </div> 
    );
};