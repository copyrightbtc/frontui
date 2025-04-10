import React, { FC, ReactElement, useState } from 'react';
import { useIntl } from 'react-intl';

import { TabPanelUnderlines } from '../../components';
import { MarketDepthsComponent, TradingChart } from '../index';

export const Charts: FC = (): ReactElement => {
    const intl = useIntl(); 
    const [ currentTabIndex, setCurrentTabIndex ] = useState(0);

    const renderTabs = () => [
        {
            content: currentTabIndex === 0 ? <TradingChart /> : null,
            label: intl.formatMessage({ id: 'page.body.charts.tabs.chart' }),
        },
        {
            content: currentTabIndex === 1 ? <MarketDepthsComponent /> : null,
            label: intl.formatMessage( { id: 'page.body.charts.tabs.depth' }),
        },
        {
            content: currentTabIndex === 2 ? <div className="charts-screen__both"><TradingChart /><MarketDepthsComponent /></div> : null,
            label: intl.formatMessage( { id: 'trading.window.both' }),
        },
    ];

    return (
        <div className="charts-screen">
            <TabPanelUnderlines
                panels={renderTabs()}
                currentTabIndex={currentTabIndex}
                onCurrentTabChange={setCurrentTabIndex}
                tradeClass={true}
                themes={true} 
                borders={true}
            />
        </div>
    );
};
