import classnames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

export enum HideMode {
    hide = 'hide',
    unmount = 'unmount',
}

export type OrderBookTabsCallback = (index: number, label?: string | JSX.Element) => void;

type OnCurrentTabChange = (index: number) => void;

export interface Tab {
    content: React.ReactNode;
    label?: string | JSX.Element;
    icon?: React.ReactNode;
}

export interface OrderBookTabsProps {
    panels: Tab[];
    hideMode?: HideMode;
    orderBookTabs?: OrderBookTabsCallback;
    onCurrentTabChange?: OnCurrentTabChange;
    currentTabIndex: number;
}

export const OrderBookTabs: React.FC<OrderBookTabsProps> = ({
    hideMode = HideMode.hide,
    panels,
    currentTabIndex,
    onCurrentTabChange,
    orderBookTabs,
}) => { 

    const createOrderBookTabsHandler = React.useCallback(
        (index: number, tab: Tab) => () => {
            if (onCurrentTabChange) {
                onCurrentTabChange(index);
            }
            if (orderBookTabs) {
                orderBookTabs(index, tab.label);
            }
        },
        [onCurrentTabChange, orderBookTabs]
    );

    const renderTabPanel = React.useCallback(
        (tab: Tab, index: number) => {
            const { icon } = tab;

            const active = currentTabIndex === index;
            const cn = classnames('switch-orders', {
                'switch-orders__active': active,
            });

            return (
                <div
                    className={cn}
                    key={index}
                    onClick={createOrderBookTabsHandler(index, tab)}
                    role="tab"
                    tabIndex={index}
                >
                    {icon}
                </div>
            );
        },
        [createOrderBookTabsHandler, currentTabIndex]
    );

    const tabPanelRender = React.useCallback(() => {
        return (
            <React.Fragment>
                {panels.map(renderTabPanel)}
            </React.Fragment>
        );
    }, [panels, renderTabPanel]);

    const renderTabContent = React.useCallback(
        (tab: Tab, index: number) => {
            const cn: string = classnames({
                'order-book-datas': hideMode === HideMode.hide ? currentTabIndex === index : false,
            });

            return (
                <div className={cn} key={`${tab.label}-${index}`}>
                    {tab.content}
                </div>
            );
        },
        [currentTabIndex, hideMode]
    );

    const contents = React.useMemo(
        () =>
            hideMode === HideMode.hide
                ? panels.map(renderTabContent)
                : panels.filter((panel, index) => index === currentTabIndex).map(renderTabContent),
        [currentTabIndex, hideMode, panels, renderTabContent]
    );

    return (
        <React.Fragment>
            <div className="grid-item__header">
                <FormattedMessage id="page.body.trade.orderbook"/> 
                <div className='switch-orders-wrapper'>{tabPanelRender()}</div>
            </div>
            {contents}
        </React.Fragment>
    );
};
