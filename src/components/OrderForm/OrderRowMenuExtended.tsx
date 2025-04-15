import classnames from 'classnames';
import * as React from "react";

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
}

export const OrderRowMenuExtended: React.FC<TabPanelUnderlinesProps> = ({
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
            return (
                <div key={`${tab.label}-${index}`}>
                    {tab.content}
                </div>
            );
        },
        [currentTabIndex]
    );

    return (
        <React.Fragment>
            {TabPanelRender()}
            {panels.map(renderTabContent)}
        </React.Fragment>
    );
};
