import classnames from 'classnames';
import React from 'react';

export enum FixedHideMenu {
    hide = 'hide',
    unmount = 'unmount',
}

export type FixedTabChangeCallback = (index: number, label?: string) => void;

export interface FixedTab {
    content: React.ReactNode;
    disabled?: boolean;
    hidden?: boolean;
    label: string;
    icon?: React.ReactNode;
}

export interface FixedPanelProps {
    panels: FixedTab[];
    fixed?: boolean;
    fixedHideMenu?: FixedHideMenu;
    currentTabIndex: number;
    optionalHead?: React.ReactNode;
    isMobileDevice?: boolean;
}
 
export const FixedMenupanel: React.FC<FixedPanelProps> = ({ 
    fixedHideMenu = FixedHideMenu.hide,
    panels, 
    currentTabIndex, 
}) => {
    const renderTabContent = React.useCallback(
        (tab: FixedTab, index: number) => {
            const cn: string = classnames('grid-tabs', {
                'grid-tabs__active': fixedHideMenu === FixedHideMenu.hide ? currentTabIndex === index : false,
            });

            return (
                <div className={cn} key={`${tab.label}-${index}`}>
                    {tab.content}
                </div>
            );
        },
        [currentTabIndex, fixedHideMenu]
    );
 
    const contents = React.useMemo(
        () =>
            fixedHideMenu === FixedHideMenu.hide
                ? panels.map(renderTabContent)
                : panels.filter((panel, index) => index === currentTabIndex).map(renderTabContent),
        [currentTabIndex, fixedHideMenu, panels, renderTabContent]
    );
    
 
    return (
        <React.Fragment>
            {contents}
        </React.Fragment>
    );
};