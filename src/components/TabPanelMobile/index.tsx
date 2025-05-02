import classnames from 'classnames';
import * as React from 'react';
import { DropdownComponent } from '../Dropdown';

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
    borders?: boolean;
    onTabChange?: OnTabChangeCallback;
    onCurrentTabChange?: OnCurrentTabChange;
    currentTabs: number;
    optionalHead?: React.ReactNode;
    morePanel?: React.ReactNode;
    isDropdown?: boolean;
}

/**
 * Component for switching between different tabs on one page.
 */
export const TabPanelMobile: React.FC<TabPanelProps> = ({
    borders,
    panels,
    currentTabs,
    isDropdown,
    optionalHead,
    morePanel,
    onCurrentTabChange,
    onTabChange,
}) => {
    const dropdownLabels = React.useCallback(() => {
        if (!panels.length) {
            return [];
        }

        const tabNames = panels.map((panel) => panel.label).filter((label) => label !== panels[currentTabs].label);
        tabNames.unshift(panels[currentTabs].label);

        return tabNames;
    }, [currentTabs, panels]);

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

    const handleOrderTypeChange = (index: number) => {
        const currentLabels = dropdownLabels();

        const activeIndex = panels.findIndex((tab) => tab.label === currentLabels[index]);

        createOnTabChangeHandler(activeIndex, panels[activeIndex])();
    };

    const renderTabPanel = (tab: Tab, index: number) => {
        const { disabled, label } = tab;

        const active = currentTabs === index;
        const cn = classnames('tabmobile', {
            'tabmobile__active': active,
            'tabmobile__disabled': disabled,
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
    };

    const TabPanelRender = () => {
        if (isDropdown) {
            return (
                <div className="tabmobile-panel__dropdown">
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
                <div className={classnames('tabmobile-panel', {
                        'borders': borders,
                    })} role="tablist">
                        {panels.map(renderTabPanel)}
                        {morePanel && <div className="tabmobile-panel-more">{morePanel}</div>}
                </div>
            )};
    };

    const renderTabContent = React.useCallback(
        (tab: Tab, index: number) => {
            return (
                <div className='tabmobile-panel__content' key={`${tab.label}-${index}`}>
                    {tab.content}
                </div>
            );
        },
        [currentTabs]
    );

    return (
        <React.Fragment>
            {TabPanelRender()}
            {optionalHead && <div className="tabmobile-panel-add-header">{optionalHead}</div>}
            {panels.map(renderTabContent)}
        </React.Fragment>
    );
};
