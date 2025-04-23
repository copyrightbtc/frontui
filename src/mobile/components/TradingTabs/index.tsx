import React, { FC, ReactElement, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Orders } from '../';
import { TabPanelMobile } from '../../../components';
import { selectUserLoggedIn } from '../../../modules';
import { Charts } from './Charts';
import { CreateOrder } from './CreateOrder';

const TradingTabsComponent: FC = (): ReactElement => {
    const intl = useIntl();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const [ currentTabIndex, setCurrentTabIndex ] = useState(0);
    const [ currentOrderType, setCurrentOrderType ] = useState(0);

    const redirectToCreateOrder = (index: number) => {
        setCurrentTabIndex(0);
        setCurrentOrderType(index);
    };

    const renderTabs = () => [
        {
            content: currentTabIndex === 0 ? <CreateOrder currentOrderTypeIndex={currentOrderType} /> : null,
            label: intl.formatMessage({id: 'page.mobile.tradingTabs.label.createOrder'}),
        },
        {
            content: currentTabIndex === 1 ? <Charts redirectToCreateOrder={redirectToCreateOrder} /> : null,
            label: intl.formatMessage({id: 'page.mobile.tradingTabs.label.charts'}),
        },
        {
            content: currentTabIndex === 2 ? <Orders withDropdownSelect /> : null,
            label: intl.formatMessage({id: 'page.mobile.tradingTabs.label.orders'}),
            disabled: !userLoggedIn,
        },
    ];

    return (
        <div className="pg-mobile-trading-tabs">
            <TabPanelMobile
                panels={renderTabs()}
                currentTabIndex={currentTabIndex}
                onCurrentTabChange={setCurrentTabIndex}
                borders={true}
            />
        </div>
    );
};

export const TradingTabs = React.memo(TradingTabsComponent);
