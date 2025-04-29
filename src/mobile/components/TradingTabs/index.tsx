import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { Orders } from '../';
import { TabPanelMobile } from '../../../components';
import { selectUserLoggedIn, selectCurrentMarket } from '../../../modules';
import { CreateOrder } from './CreateOrder';
import { ModalMobile } from '../../components';
import {
    OrderBook,
    TradingChart,
    MarketDepthsComponent,
    OrderComponent
} from '../../../containers';
import { selectRecentTradesOfCurrentMarket } from '../../../modules/public/recentTrades';
import { RecentTradesMarket } from '../../../containers/RecentTrades/Market';
import { RecentTradesYours } from '../../../containers/RecentTrades/Yours';

const TradingTabsComponent: FC = () => {
    const intl = useIntl();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const currentMarket = useSelector(selectCurrentMarket);
    const [ currentTabs, setCurrentTabs ] = useState(0);
    const [ currentOrderType, setCurrentOrderType ] = useState(0);
    const [ isOpenMakeOrders, setOpenMakeOrders ] = useState(false);

    const recentTrades = useSelector(selectRecentTradesOfCurrentMarket);

    const redirectToCreateOrder = (index: number) => {
        setCurrentOrderType(index);
        setOpenMakeOrders(true);
    };

    const renderModalHeader = (
        <div className="mobile-modal__header borders">
            <div className="mobile-modal__header-title">
                {intl.formatMessage({ id: 'page.body.trade.header.make.order' })}
            </div>
            <div className="mobile-modal__header-close" onClick={() => setOpenMakeOrders(false)}>
                <CloseIcon />
            </div>
        </div>
    );

    React.useEffect(() => {
        setOpenMakeOrders(false);
    }, []);

    const renderTabs = () => [
        {
            content: currentTabs === 0 ? <TradingChart /> : null,
            label: intl.formatMessage({id: 'page.body.trade.header.chart'}),
        },
        {
            content: currentTabs === 1 ? <MarketDepthsComponent /> : null,
            label: intl.formatMessage({id: 'page.body.charts.tabs.depth'}),
        },
        {
            content: currentTabs === 2 ? <OrderBook forceLarge={false} /> : null,
            label: intl.formatMessage({id: 'page.body.trade.orderbook'}),
        },
        {
            content: currentTabs === 3 ? <RecentTradesMarket recentTrades={recentTrades}/> : null,
            label: intl.formatMessage({id: 'page.header.navbar.trade'}),
        },
        {
            content: currentTabs === 4 ? <RecentTradesYours /> : null,
            label: intl.formatMessage({id: 'page.body.trade.header.yours'}),
            disabled: !userLoggedIn,
        }
    ];

    return (
        <div className="mobile-trading-screen">
            <TabPanelMobile
                panels={renderTabs()}
                currentTabs={currentTabs}
                onCurrentTabChange={setCurrentTabs}
                borders={true}
            />
            <Orders />
            {userLoggedIn ? 
            <div className="mobile-order-buttons">
                <button
                    onClick={() => redirectToCreateOrder(0)}
                    className="mobile-order-buttons__button buy"
                >
                    {intl.formatMessage(
                        { id: 'page.mobile.orderButtons.buy' },
                        { base_unit: currentMarket ? currentMarket.base_unit.toUpperCase() : '' },
                    )}
                </button>
                <button
                    onClick={() => redirectToCreateOrder(1)}
                    className="mobile-order-buttons__button sell"
                >
                    {intl.formatMessage(
                        { id: 'page.mobile.orderButtons.sell' },
                        { base_unit: currentMarket ? currentMarket.base_unit.toUpperCase() : '' },
                    )}
                </button>
            </div> : 
            <div className="mobile-order-buttons">
                <Link
                    to="/signin"
                    className="mobile-order-buttons__button buy"
                >
                    {intl.formatMessage({id: 'page.body.landing.header.login'})}
                </Link>
                <Link
                    to="/signin"
                    className="mobile-order-buttons__button sell"
                >
                    {intl.formatMessage({id: 'page.body.landing.header.login'})}
                </Link>
            </div> }
            <ModalMobile
                header={renderModalHeader}
                isOpen={isOpenMakeOrders}
                onClose={() => setOpenMakeOrders(!isOpenMakeOrders)}
            >
                <OrderComponent defaultTabIndex={currentOrderType} />
            </ModalMobile>
        </div>
    );
};

export const TradingTabs = React.memo(TradingTabsComponent);