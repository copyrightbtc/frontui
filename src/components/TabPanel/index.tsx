import classnames from 'classnames';
import * as React from 'react';
import { DropdownComponent } from '../Dropdown';

export enum HideMode {
    hide = 'hide',
    unmount = 'unmount',
}

export type OnTabChangeCallback = (index: number, label?: string | JSX.Element) => void;

type OnCurrentTabChange = (index: number) => void;

export interface Tab {
    content: React.ReactNode;
    disabled?: boolean;
    hidden?: boolean;
    label: string | JSX.Element;
}

export interface TabPanelProps {
    panels: Tab[];
    fixed?: boolean;
    hideMode?: HideMode;
    onTabChange?: OnTabChangeCallback;
    onCurrentTabChange?: OnCurrentTabChange;
    currentTabIndex: number;
    optionalHead?: React.ReactNode;
    isDropdown?: boolean;
}

/**
 * Component for switching between different tabs on one page.
 */
export const TabPanel: React.FC<TabPanelProps> = ({
    fixed,
    hideMode = HideMode.hide,
    panels,
    optionalHead,
    currentTabIndex,
    isDropdown,
    onCurrentTabChange,
    onTabChange,
}) => {
    const dropdownLabels = React.useCallback(() => {
        if (!panels.length) {
            return [];
        }

        const tabNames = panels.map((panel) => panel.label).filter((label) => label !== panels[currentTabIndex].label);
        tabNames.unshift(panels[currentTabIndex].label);

        return tabNames;
    }, [currentTabIndex, panels]);

    const createOnTabChangeHandler = React.useCallback(
        (index: number, tab: Tab) => () => {
            if (!tab.disabled) {
                if (onCurrentTabChange) {
                    onCurrentTabChange(index);
                }
                if (onTabChange) {
                    onTabChange(index, tab.label);
                }
            }
        },
        [onCurrentTabChange, onTabChange]
    );

    const handleOrderTypeChange = React.useCallback(
        (index: number) => {
            const currentLabels = dropdownLabels();

            const activeIndex = panels.findIndex((tab) => tab.label === currentLabels[index]);

            createOnTabChangeHandler(activeIndex, panels[activeIndex])();
        },
        [createOnTabChangeHandler, dropdownLabels, panels]
    );

    const renderTabPanel = React.useCallback(
        (tab: Tab, index: number) => {
            const { disabled, hidden, label } = tab;

            const active = currentTabIndex === index;
            const cn = classnames('tab', {
                'tab__active': active,
                'tab__disabled': disabled,
                'tab__hidden': hidden,
            });

            return (
                <div
                    className={cn}
                    key={index}
                    onClick={createOnTabChangeHandler(index, tab)}
                    role="tab"
                    tabIndex={index}>
                    {label}
                    {active && <span className="tab__pointer" />}
                </div>
            );
        },
        [createOnTabChangeHandler, currentTabIndex]
    );

    const tabPanelRender = React.useCallback(() => {
        if (isDropdown) {
            return (
                <div className="tab-panel__dropdown">
                    <DropdownComponent
                        list={dropdownLabels()}
                        className="base-dropdown"
                        onSelect={handleOrderTypeChange}
                        placeholder=""
                    />
                </div>
            );
        } else {
            return (
                <div className={'tab-panel__navigation-container-navigation'} role="tablist">
                    {panels.map(renderTabPanel)}
                </div>
            );
        }
    }, [dropdownLabels, handleOrderTypeChange, isDropdown, panels, renderTabPanel]);

    const renderTabContent = React.useCallback(
        (tab: Tab, index: number) => {
            const cn: string = classnames('tab-content', {
                'tab-content__active': hideMode === HideMode.hide ? currentTabIndex === index : false,
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
        <div
            className={classnames('tab-panel', {
                'tab-panel__fixed': fixed,
            })}>
            <div className="tab-panel__navigation-container">
                {tabPanelRender()}
                {optionalHead && <div className="tab-panel__optinal-head">{optionalHead}</div>}
            </div>
            {contents}
        </div>
    );
};
