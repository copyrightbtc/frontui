import classnames from 'classnames';
import * as React from "react";

export enum HideMode {
    hide = 'hide',
    unmount = 'unmount',
}

export type OnUnderChangeCallback = (index: number, label?: string | JSX.Element) => void;

type OnCurrentTabChange = (index: number) => void;

export interface Panel {
    content: React.ReactNode;
    label: string | JSX.Element;
}

export interface TabPanelUnderlinesProps {
    panels: Panel[];
    borders?: boolean;
    onTabChange?: OnUnderChangeCallback;
    onCurrentTabChange?: OnCurrentTabChange;
    currentTabIndex: number;
    hideMode?: HideMode;
}

export const OrderRowMenu: React.FC<TabPanelUnderlinesProps> = ({
    hideMode = HideMode.hide,
    borders,
    panels,
    currentTabIndex,
    onCurrentTabChange,
    onTabChange,
}) => {

    const createOnTabChangeHandler = React.useCallback(
        (index: number, tab: Panel) => () => {
            if (onCurrentTabChange) {
                onCurrentTabChange(index);
            }
            if (onTabChange) {
                onTabChange(index, tab.label);
            }
        },
        [onCurrentTabChange, onTabChange]
    );

    const renderTabPanel = React.useCallback(
        (tab: Panel, index: number) => {
            const { label } = tab;

            const active = currentTabIndex === index;
            const cn = classnames('orders-type-menu__tabs', {
                'active-tab': active,
            });

            return (
                <button
                    className={cn}
                    key={index}
                    onClick={createOnTabChangeHandler(index, tab)}
                    tabIndex={index}>
                    {label}
                </button>
            );
        },
        [createOnTabChangeHandler, currentTabIndex]
    );
    
    const TabPanelRender = () => {
        return (
            <div className={classnames('orders-type-menu', {
                    'borders': borders,
                })} role="tablist">
                    {panels.map(renderTabPanel)}
            </div>
        );
    };
 
    const renderTabContent = React.useCallback(
        (tab: Panel, index: number) => {
            const cn: string = classnames('orders-type-menu__body', {
                'orders-type-menu__body__active': hideMode === HideMode.hide ? currentTabIndex === index : false,
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
            {TabPanelRender()}
            {contents}
        </React.Fragment>
    );
};
