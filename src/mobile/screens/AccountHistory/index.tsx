import React, { FC, ReactElement, useCallback, useEffect, useState, } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'; 
import { useIntl } from "react-intl";
import { TabPanelUnderlines } from 'src/components';
import { TabPanelMobile } from 'src/components/TabPanelMobile';
import { MobileHistoryElement } from 'src/containers/HistoryElement/MobileHistoryElement';
import { AccountActivities } from 'src/containers/ProfileAccountActivity/AccountActivities';
import { ProfileAccountActivityMobileScreen } from 'src/mobile/screens';
import { useDocumentTitle } from 'src/hooks';
import {
    fetchHistory,
    marketsFetch,
    resetHistory,
    walletsFetch,
} from 'src/modules';

interface ParamTypes {
    routeTab?: string;
}

export const AccountHistory: FC = (): ReactElement => {
 
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
    const [tabMapping] = useState<string[]>(['account-activity', 'deposits-history', 'withdraws-history']);
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
                content: currentTabIndex === 0 ? <ProfileAccountActivityMobileScreen /> : null,
                label: translate('page.body.history.activity'),
            },
            {
                content: currentTabIndex === 1 ? <MobileHistoryElement type="deposits" /> : null,
                label: translate('page.body.history.deposit'),
            },
            {
                content: currentTabIndex === 2 ? <MobileHistoryElement type="withdraws" /> : null,
                label: translate('page.body.history.withdraw'),
            },
        ];
    };
 
    return (
        <div className="mobile-history-page">
            <TabPanelMobile
                panels={renderTabs()}
                onTabChange={onTabChange}
                currentTabs={currentTabIndex}
                onCurrentTabChange={onCurrentTabChange}
                borders={true}
            />
        </div> 
    );
};