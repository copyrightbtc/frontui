import React, { useEffect, useState, useRef } from "react";
import { useIntl } from 'react-intl';
import { Market } from '../../modules';
import { Decimal } from '../Decimal';
import { CryptoIcon } from '../CryptoIcon';
import { NoResultData } from 'src/components';
 
interface Props {
    currentBidUnit: string;
    currentBidUnitsList: string[];
    markets: Market[];
    redirectToTrading: (key: string) => void;
    setCurrentBidUnit: (key: string) => void;
}
 
type CustomProps = Props; 

export const TickerTable: React.FC<CustomProps> = ({
    currentBidUnit,
    markets,
    setCurrentBidUnit,
    currentBidUnitsList,
    redirectToTrading,
}) => { 

    const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
    const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  
    const tabsRef = useRef([]); 
  
    useEffect(() => {
      if (currentBidUnit === null) {
        return;
      }
  
      function setTabPosition() {
        const currentTab = tabsRef.current[currentBidUnit] as HTMLElement;
        setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
        setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
      }
  
      setTabPosition();
      window.addEventListener('resize', setTabPosition);
  
      return () => window.removeEventListener('resize', setTabPosition);
    }, [currentBidUnit]);

    const { formatMessage } = useIntl();

    const renderItem = React.useCallback(
        (market, index: number) => {
            const marketChangeColor = +(market.change || 0) < 0 ? 'negative' : 'positive';
            const icons = market.base_unit;
            return (
                <div className="ticker-table__wrapper__body__row" key={index} onClick={() => redirectToTrading(market.id)}>
                    <div className="cell icons">
                        <CryptoIcon code={icons.toUpperCase()} />
                        {market && market.name}
                    </div>
                    <div className="cell"> 
                        <Decimal fixed={market.price_precision} thousSep=",">{market.last}</Decimal>
                    </div>
                    <div className="cell"> 
                        <span className={marketChangeColor}>{market.price_change_percent}</span>
                    </div>
                    <div className="cell"> 
                        <Decimal fixed={market.price_precision} thousSep=",">{market.high}</Decimal>
                    </div>
                    <div className="cell"> 
                        <Decimal fixed={market.price_precision} thousSep=",">{market.low}</Decimal>
                    </div>
                    <div className="cell"> 
                        <Decimal fixed={market.amount_precision} thousSep=",">{market.amount}</Decimal>
                    </div> 
                </div>
            );
        },
        [redirectToTrading, formatMessage]
    );

    return (
        <div className="ticker-table"> 
            <div className="button-underlines">
                <div className="button-underlines__wrapper">
                    {currentBidUnitsList.map((item, i) => {
                      return (
                        <button
                            key={i}
                            ref={(el) => (tabsRef.current[item] = el)}
                            onClick={() => setCurrentBidUnit(item)}
                            className={`button-underlines__button ${item === currentBidUnit && 'active-tab'}`}
                            >
                            {item ? item.toUpperCase() : formatMessage({ id: 'page.body.marketsTable.filter.all' })}
                        </button>
                      );
                    })}
                    <div
                        className="button-underlines__line"
                        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
                    />
                </div>
            </div>
            <div className="ticker-table__wrapper">
                <div className="ticker-table__wrapper__head">
                    <div className="cell">{formatMessage({ id: 'page.body.marketsTable.header.pair' })}</div>
                    <div className="cell">{formatMessage({ id: 'page.body.marketsTable.header.lastPrice' })}</div>
                    <div className="cell">{formatMessage({ id: 'page.body.marketsTable.header.change' })}</div>
                    <div className="cell">{formatMessage({ id: 'page.body.marketsTable.header.high' })}</div>
                    <div className="cell">{formatMessage({ id: 'page.body.marketsTable.header.low' })}</div>
                    <div className="cell">{formatMessage({ id: 'page.body.trade.toolBar.turnover' })}</div>
                </div>
                <div className="ticker-table__wrapper__body">
                    {markets[0] ? (
                        markets.map(renderItem)
                    ) : (
                        <NoResultData />
                    )}
                </div>
            </div>
        </div>
    );
  }
  