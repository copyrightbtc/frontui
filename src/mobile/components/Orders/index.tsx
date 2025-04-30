import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { NoResultData } from '../../../components';
import { TabPanelMobile } from '../../../components';
import {
    ordersCancelAllFetch,
    selectCurrentMarket,
    selectUserLoggedIn,
    selectOrdersHistory,
    selectShouldFetchCancelAll,
    resetOrdersHistory,
    marketsFetch
} from '../../../modules';
import { OrdersItem } from './OrdersItem';

export const OrdersComponent: React.FC = (): React.ReactElement => {
    const { formatMessage } = useIntl();
    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);
    const isLoggedIn = useSelector(selectUserLoggedIn);
    const dispatch = useDispatch();

    const currentMarket = useSelector(selectCurrentMarket);
    const shouldFetchCancelAll = useSelector(selectShouldFetchCancelAll);
    const list = useSelector(selectOrdersHistory);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

    const handleCancelAllOrders = () => {
        if (shouldFetchCancelAll) {
            currentMarket && dispatch(ordersCancelAllFetch({ market: currentMarket.id }));
        }
    };
        
    useEffect(() => {
        dispatch(marketsFetch());
        dispatch(resetOrdersHistory());
    }, [dispatch]);

    const renderTabs = () => {
        return [
            {
                content: currentTabIndex === 0 ? <OrdersItem type="open"/> : null,
                label: translate('page.body.openOrders.tab.open'),
            },
            {
                content: currentTabIndex === 1 ? <OrdersItem type="all" /> : null,
                label: translate('page.body.openOrders.tab.all'),
            }
        ];
    };

    const updateList = list.filter(o => o.state === 'wait');

    const cancelAll = updateList.length > 0 && isLoggedIn ? (
        <div className="cancel-orders" onClick={handleCancelAllOrders}>
            <span>{translate('page.body.openOrders.header.button.cancelAll')}</span>
            <div className="cancel-orders__close" />
        </div>
    ) : null;

    const renderContent = () => {
        return (
            <TabPanelMobile
                panels={renderTabs()}
                optionalHead={cancelAll}
                currentTabs={currentTabIndex}
                onCurrentTabChange={setCurrentTabIndex}
                borders={true}
            />
        )
    };
 
    return (isLoggedIn ? renderContent() : 
        <div className='trade-orders-mobile'>
            <div className="trade-orders-mobile__header">
                {translate('page.body.trade.header.openOrders')} {currentMarket && currentMarket.name}
            </div>
            <div className="empty-container">
                <NoResultData class="themes" title={translate('page.body.trade.header.allOrders.nodata')}/>
            </div>
        </div>
    );
}

export const Orders = React.memo(OrdersComponent);
