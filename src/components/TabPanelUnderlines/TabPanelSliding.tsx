import classnames from 'classnames';
import React, { useEffect, useState, useRef } from "react";
 
export type OnUnderChangeCallback = (index: number, label?: string | JSX.Element) => void;

type OnCurrentTabChange = (index: number) => void;

export interface Panel {
    content: React.ReactNode;
    label: string | JSX.Element;
}

export interface TabPanelSlidingProps {
    panels: Panel[];
    themes?: boolean;
    borders?: boolean;
    onTabChange?: OnUnderChangeCallback;
    onCurrentTabChange?: OnCurrentTabChange;
    currentTabIndex: number;
    optionalHead?: React.ReactNode;
}

export const TabPanelSliding: React.FC<TabPanelSlidingProps> = ({
    themes,
    borders,
    panels,
    optionalHead,
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
    
    const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
    const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  
    const tabsRef = useRef([]); 
  
    useEffect(() => {
      if (currentTabIndex === null) {
        return;
      }
  
      function setTabPosition() {
        const currentTab = tabsRef.current[currentTabIndex] as HTMLElement;
        setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
        setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
      }
  
      setTabPosition();
      window.addEventListener('resize', setTabPosition);
  
      return () => window.removeEventListener('resize', setTabPosition);
    }, [currentTabIndex]);

    const renderTabPanelSliding = React.useCallback(
        (tab: Panel, index: number) => {
            const { label } = tab;

            const active = currentTabIndex === index;
            const cn = classnames('button-sliding__button', {
                'active-tab': active,
            });

            return (
                <button
                    className={cn}
                    key={index}
                    ref={(el) => (tabsRef.current[index] = el)}
                    onClick={createOnTabChangeHandler(index, tab)}
                    tabIndex={index}>
                    {label}
                </button>
            );
        },
        [createOnTabChangeHandler, currentTabIndex]
    );
    
    const TabPanelSlidingRender = () => {
        return (
            <div
                className={classnames('button-sliding__wrapper', {
                    'borders': borders,
                    'additional-header':optionalHead,
                })} role="tablist">
                <div className="w-buttons">
                    <div
                        className={`button-sliding__line ${currentTabIndex === 0 ? 'first' : ''}${currentTabIndex === 1 ? 'second' : ''}${currentTabIndex === 2 ? 'third' : ''}`}
                        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
                    />
                    <div className="w-buttons__inner">
                        {panels.map(renderTabPanelSliding)}
                    </div>
                </div>
                {optionalHead && <div className="add-header">{optionalHead}</div>}
            </div>
        );
    };

    const renderTabContent = React.useCallback(
        (tab: Panel, index: number) => {
 
            return (
                <div className={'buttonsliding-container__body'} key={`${tab.label}-${index}`}>
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
        <div
            className={classnames('buttonsliding-container', {
                'themes': themes,
            })}>
                {TabPanelSlidingRender()}
            {contents}
        </div>
    );
};
