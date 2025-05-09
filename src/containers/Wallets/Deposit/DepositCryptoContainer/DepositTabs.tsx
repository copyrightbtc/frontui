import classnames from 'classnames';
import * as React from 'react';
import { Tabs, Button } from '@mui/material';
import { useIntl } from 'react-intl'; 
import { selectMobileDeviceState } from 'src/modules';
import { useReduxSelector } from 'src/hooks';

export enum HideMode {
    hide = 'hide',
    unmount = 'unmount',
}

export type OnTabChangeCallback = (index: number, label?: string | JSX.Element) => void;

type OnCurrentTabChange = (index: number) => void;

export interface Tab {
    content: React.ReactNode;
    label: string | JSX.Element;
}

export interface DepositTabsProps {
    panels: Tab[];
    fixed?: boolean;
    hideMode?: HideMode;
    onTabChange?: OnTabChangeCallback;
    onCurrentTabChange?: OnCurrentTabChange;
    currentTabIndex: number;
    onSelect?: (value: string) => void;
}

/**
 * Component for switching between different tabs on one page.
 */
export const DepositTabs: React.FC<DepositTabsProps> = ({
    hideMode = HideMode.hide,
    panels,
    currentTabIndex,
    onCurrentTabChange,
    onTabChange,
}) => {
    const isMobileDevice = useReduxSelector(selectMobileDeviceState);

    const { formatMessage } = useIntl();
    const translate = (id: string) => formatMessage({ id });

    const createOnTabChangeHandler = React.useCallback(
        (index: number, tab: Tab) => () => {
            if (onCurrentTabChange) {
                onCurrentTabChange(index);
            }
            if (onTabChange) {
                onTabChange(index, tab.label);
            }
        },
        [onCurrentTabChange, onTabChange]
    );

    const renderDepositTabs = React.useCallback(
        (tab: Tab, index: number) => {
            const { label } = tab;

            const active = currentTabIndex === index;
            const cn = classnames('networks-tabs', {
                'networks-tabs__active': active
            });

            return (
                <Button
                    className={cn}
                    key={index}
                    onClick={createOnTabChangeHandler(index, tab)}
                    role="tab"
                    tabIndex={index}>
                    {label}
                </Button>
            );
        },
        [createOnTabChangeHandler, currentTabIndex]
    );

    const tabPanelRender = () => {
        return (
            <Tabs
                value={0}
                variant="scrollable"
                allowScrollButtonsMobile
                scrollButtons
                className='networks-arrows'
                sx={{ '& .MuiTabs-indicator': { display: 'none' } }}
            >
                {panels.map(renderDepositTabs)}
            </Tabs>
        );
    };

    const renderTabContent = React.useCallback(
        (tab: Tab, index: number) => {
            const cn: string = classnames('networks-panel-content', {
                'networks-panel-content__active': hideMode === HideMode.hide ? currentTabIndex === index : false,
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
        <div className="networks-panel">
            {Number(contents.length) === 1 || isMobileDevice ? null : <h6>{translate('page.body.wallets.tabs.deposit.ccy.blockchain.networks')}</h6>}
            {Number(contents.length) !== 1 ? tabPanelRender() : null}
            {contents}
        </div>
    );
};
