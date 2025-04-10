import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { OpenOrders, TabPanelUnderlines } from '../../components';
import {
    ordersCancelAllFetch,
    selectCurrentMarket,
    selectUserLoggedIn,
    selectOrdersHistory,
    selectShouldFetchCancelAll,
    resetOrdersHistory,
    marketsFetch
} from '../../modules'; 

export const OpenOrdersComponent: React.FC = (): React.ReactElement => {
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
                content: currentTabIndex === 0 ? <OpenOrders type="open"/> : null,
                label: translate('page.body.openOrders.tab.open'),
            },
            {
                content: currentTabIndex === 1 ? <OpenOrders type="all" /> : null,
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
            <TabPanelUnderlines
                panels={renderTabs()}
                optionalHead={cancelAll}
                currentTabIndex={currentTabIndex}
                onCurrentTabChange={setCurrentTabIndex}
                borders={true}
                tradeClass={true}
                themes={true}
            />
        )
    };
 
    return (isLoggedIn ? renderContent() : 
        <div className='trade-orders'>
            <div className="grid-item__header">
                <div className='trade-orders__header'>
                    {translate('page.body.trade.header.openOrders')} {currentMarket && currentMarket.name}
                </div>
            </div>
            <div className="trade-orders__wellcome">
                <span>{translate('page.body.openOrders.header.starttrading')}</span>
                <div className="trade-orders__wellcome__buttons">
                    <Button
                        variant="outlined"
                        href="/signin"
                    >
                        {translate('page.body.landing.header.login')}
                    </Button>
                    <p>{translate('page.body.openOrders.header.starttrading.or')}</p>
                    <Button
                        href="/signup"
                        variant="outlined"
                    >
                        {translate('page.body.land.button.register')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
