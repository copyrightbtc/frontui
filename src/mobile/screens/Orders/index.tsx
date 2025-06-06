import React, { FC, ReactElement, useCallback, useEffect, useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'; 
import { useIntl } from "react-intl";
import { TabPanelMobile } from 'src/components/TabPanelMobile';
import { MobileHistoryElement } from 'src/containers/HistoryElement/MobileHistoryElement';
import { MobileOrdersElement } from 'src/containers/OrdersElement/MobileOrdersElement';
import { useDocumentTitle } from 'src/hooks';
import {
    marketsFetch,
    ordersCancelAllFetch,
    selectShouldFetchCancelAll,
    resetOrdersHistory,
    selectOrdersHistory,
    fetchHistory,
    resetHistory,
} from 'src/modules';

interface ParamType {
    routeTab?: string;
}

export const OrdersMobileScreen: FC = (): ReactElement => {
     
    const history = useHistory();

    const { formatMessage } = useIntl();
    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const dispatch = useDispatch();
    
    useEffect(() => {
        list;
        dispatch(marketsFetch());
        dispatch(resetOrdersHistory());
        dispatch(resetHistory());
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
    
    const shouldFetchCancelAll = useSelector(selectShouldFetchCancelAll);
    const handleCancelAllOrders = () => {
        if (shouldFetchCancelAll) {
            dispatch(ordersCancelAllFetch());
        }
    };
    const list = useSelector(selectOrdersHistory);
    const { routeTab } = useParams<ParamType>();

    const [tab, setTab] = useState<string>('');
    const [tabMapping] = useState<string[]>(['open-orders', 'all-orders', 'trade-history']);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

    useDocumentTitle(translate('page.header.navbar.openOrders'));

    useEffect(() => {
        if (routeTab) {
            const index = tabMapping.indexOf(routeTab);
            if (index !== -1) {
                setTab(routeTab);
                setCurrentTabIndex(index);
            }
        } else {
            history.push('/orders/open-orders');
        }
    }, [routeTab, tabMapping]);

    const onCurrentTabChange = (index: number) => {
        setCurrentTabIndex(index);
        history.push(`/orders/${tabMapping[index]}`);
    };

    const onTabChange = (index: number) => {
        if (tab !== tabMapping[index]) {
            setTab(tabMapping[index]);
        }
    };

    const renderTabs = () => {

        return [
            {
                content: currentTabIndex === 0 ? <MobileOrdersElement type="open"/> : null,
                label: translate('page.body.openOrders.tab.open'),
            },
            {
                content: currentTabIndex === 1 ? <MobileOrdersElement type="all" /> : null,
                label: translate('page.body.openOrders.tab.all'),
            },
            {
                content: currentTabIndex === 2 ? <MobileHistoryElement type="trades" /> : null,
                label: translate('page.body.history.trade'),
            },
        ];
    };

    const updateList = list.filter(o => o.state === 'wait');

    const cancelAll = updateList.length > 0 && tab !== 'trade-history' ? (
        <div className="cancel-orders" onClick={handleCancelAllOrders}>
            <span>{translate('page.body.openOrders.header.button.cancelAll')}</span>
            <div className="cancel-orders__close" />
        </div>
    ) : null;

    return (
        <div className="mobile-history-page">
            <TabPanelMobile
                panels={renderTabs()}
                onTabChange={onTabChange}
                optionalHead={cancelAll}
                currentTabs={currentTabIndex}
                onCurrentTabChange={onCurrentTabChange}
                borders={true}
            />
        </div> 
    );
};