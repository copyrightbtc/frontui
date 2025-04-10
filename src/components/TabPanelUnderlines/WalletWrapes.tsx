import * as React from 'react';
 
export type OnTabChangeCallback = (index: number, label?: string | JSX.Element) => void;

type OnCurrentTabChange = (index: number) => void;

export interface WallWrap {
    content: React.ReactNode;
    label: string | JSX.Element;
}

export interface WalletWrapesProps {
    panels: WallWrap[];
    onTabChange?: OnTabChangeCallback;
    onCurrentTabChange?: OnCurrentTabChange;
    currentTabIndex: number;
}

/**
 * Component for switching between different tabs on one page.
 */
export const WalletWrapes: React.FC<WalletWrapesProps> = ({
    panels,
    currentTabIndex,
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
        (index: number, tab: WallWrap) => () => {
            if (onCurrentTabChange) {
                onCurrentTabChange(index);
            }
            if (onTabChange) {
                onTabChange(index, tab.label);
            }
        },
        [onCurrentTabChange, onTabChange]
    );
    const noHeaderRoutes = [
        '/wallets',
    ];
    const shouldRenderHeader = noHeaderRoutes.some(r => location.pathname.includes(r)) && location.pathname !== '/';

    const handleOrderTypeChange = React.useCallback(
        (index: number) => {
            const currentLabels = dropdownLabels();

            const activeIndex = panels.findIndex((tab) => tab.label === currentLabels[index]);

            createOnTabChangeHandler(activeIndex, panels[activeIndex])();
        },
        [createOnTabChangeHandler, dropdownLabels, panels]
    );

    const renderWalletWrapes = React.useCallback(
        (tab: WallWrap, index: number) => {
            const { label } = tab; 

            return (
                <div
                    key={index}
                    onClick={createOnTabChangeHandler(index, tab)}
                    role="tab"
                    tabIndex={index}>
                    {label}
                </div>
            );
        },
        [createOnTabChangeHandler, currentTabIndex]
    );

    const tabPanelRender = React.useCallback(() => {
        return (
            <div>
                {!shouldRenderHeader ? 
                    <React.Fragment>
                        {panels.map(renderWalletWrapes)}
                    </React.Fragment>
                : null }
            </div> 
        );
    }, [handleOrderTypeChange, panels, renderWalletWrapes]);

    const renderTabContent = React.useCallback(
        (tab: WallWrap, index: number) => {

            return (
                <div className="wallets-page__renders__wrapper" key={`${tab.label}-${index}`}>
                    {tab.content}
                </div>
            );
        },
        [currentTabIndex]
    );

    const contents = React.useMemo(
        () => panels.filter((panel, index) => index === currentTabIndex).map(renderTabContent),
        [currentTabIndex, panels, renderTabContent]
    );

    return (
        <div className="wallets-page__renders">
            {tabPanelRender()}
            {contents}
        </div>
    );
};
