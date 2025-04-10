import classnames from 'classnames';
import React, { useEffect, useState, useRef } from "react";
 
export type OnUnderChangeCallback = (index: number, label?: string | JSX.Element) => void;

type OnCurrentTabChange = (index: number) => void;

export interface Panel {
    content: React.ReactNode;
    label: string | JSX.Element;
}

export interface TabPanelUnderlinesProps {
    panels: Panel[];
    themes?: boolean;
    borders?: boolean;
    onTabChange?: OnUnderChangeCallback;
    onCurrentTabChange?: OnCurrentTabChange;
    currentTabIndex: number;
    optionalHead?: React.ReactNode;
    tradeClass?: boolean;
}

export const TabPanelUnderlines: React.FC<TabPanelUnderlinesProps> = ({
    themes,
    borders,
    panels,
    optionalHead,
    currentTabIndex,
    onCurrentTabChange,
    onTabChange,
    tradeClass,
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

    const renderTabPanelUnderlines = React.useCallback(
        (tab: Panel, index: number) => {
            const { label } = tab;

            const active = currentTabIndex === index;
            const cn = classnames('button-underlines__button', {
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
    
    const TabPanelUnderlinesRender = () => {
        return (
            <div className={classnames('button-underlines__wrapper', {
                    'borders': borders,
                    'additional-header':optionalHead,
                })} role="tablist">
                    <div className="w-buttons">
                    {panels.map(renderTabPanelUnderlines)}
                        <div
                            className="button-underlines__line"
                            style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
                        />
                    </div>
                  {optionalHead && <div className="add-header">{optionalHead}</div>}
            </div>
        );
    };

    const renderTabContent = React.useCallback(
        (tab: Panel, index: number) => {
 
            return (
                <div className={'underlines-container__body'} key={`${tab.label}-${index}`}>
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
            className={classnames('underlines-container', {
                'themes': themes,
                'trade-slide': tradeClass
            })}>
                {TabPanelUnderlinesRender()}
            {contents}
        </div>
    );
};
