import classnames from 'classnames';
import * as React from 'react';
 
export enum HideMode {
    hide = 'hide',
    unmount = 'unmount',
}

export type OnUnderChangeCallback = (index: number, label?: string | JSX.Element, marketName?: string | JSX.Element) => void;

type OnCurrentTabChange = (index: number) => void;

export interface Panel {
    content: React.ReactNode;
    label: string | JSX.Element;
    marketName?: string | JSX.Element;
}

export interface OrderPanelProps {
    panels: Panel[];
    onTabChange?: OnUnderChangeCallback;
    onCurrentTabChange?: OnCurrentTabChange;
    currentTabIndex: number;
    hideMode?: HideMode;
}

export const OrderPanel: React.FC<OrderPanelProps> = ({
    panels,
    hideMode = HideMode.hide,
    currentTabIndex,
    onCurrentTabChange,
    onTabChange,
}) => {

    const createOnTabChangeHandler = (index: number, tab: Panel) => () => {
        if (onCurrentTabChange) {
            onCurrentTabChange(index);
        }
        if (onTabChange) {
            onTabChange(index, tab.label, tab.marketName);
        }
    };

 
    const renderOrderPanel = (tab: Panel, index: number) => {
        const { label, marketName } = tab;
        const active = currentTabIndex === index;
        const cn = classnames('make-order__header__button', {
            'active': active,
        });

        return (
            <button 
                className={cn}
                key={index}
                role="tab"
                onClick={createOnTabChangeHandler(index, tab)}
                tabIndex={index}>
                {label}
                &nbsp;{marketName}
            </button>
        );
    };
    
    const OrderPanelRender = () => {
        return (
            <div className="make-order__header" role="tablist">
                {panels.map(renderOrderPanel)}
            </div>
        );
    };

    const renderTabContent = (tab: Panel, index: number) => {
        const cn: string = classnames('make-order__body', {
            'make-order__body__active': hideMode === HideMode.hide ? currentTabIndex === index : false,
        });
        return (
            <div className={cn} key={`${tab.label}-${index}`}>
                {tab.content}
            </div>
        );
    };

    const contents = React.useMemo(
        () =>
            hideMode === HideMode.hide
                ? panels.map(renderTabContent)
                : panels.filter((panel, index) => index === currentTabIndex).map(renderTabContent),
        [currentTabIndex, hideMode, panels, renderTabContent]
    );

    return (
        <React.Fragment>
            {OrderPanelRender()}
            {contents}
        </React.Fragment>
    );
};
