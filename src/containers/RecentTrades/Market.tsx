import React, { useMemo } from 'react';
import classnames from 'classnames';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { NoResultData } from '../../components';
import { localeDate } from '../../helpers';
import { RecentTradesTable } from './RecentTradesTable';
import {
    selectCurrentMarket,
    selectCurrentPrice,
    setCurrentPrice,
} from '../../modules';
import { TradeTableCell } from './RecentTradesTableCell';
import { recentTradesFetch } from '../../modules/public/recentTrades';

const handleHighlightValue = (prevValue: string, curValue: string) => {
    let highlighted = '';
    let val = curValue;
    let prev = prevValue;

    while (val !== prev && val.length > 0) {
        highlighted = val[val.length - 1] + highlighted;
        val = val.slice(0, -1);
        prev = prev.slice(0, -1);
    }

    return (
        <div>{val}{highlighted}</div>
    );
};

const RecentTradesMarket = ({ recentTrades }) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const currentMarket = useSelector(selectCurrentMarket);
    const currentPrice = useSelector(selectCurrentPrice);

    const headers = React.useMemo(() => {
        return (
            <div className='recent-trades__table__head'>
                <div className='cells'>
                    {formatMessage({ id: 'page.body.trade.header.recentTrades.content.price' })}
                </div>
                <div className='cells'>
                    {formatMessage({ id: 'page.body.trade.header.recentTrades.content.amount' })}
                </div>
                <div className='cells'>
                    {formatMessage({ id: 'page.body.trade.header.recentTrades.content.time' })}
                </div>
            </div>
        );
    }, [formatMessage]); 

    const getTrades = React.useCallback(() => {
        const priceFixed = currentMarket ? currentMarket.price_precision : 0;
        const amountFixed = currentMarket ? currentMarket.amount_precision : 0;

        const renderRow = (item, i) => {
            const { created_at, taker_type, price, amount } = item;
            const higlightedDate = handleHighlightValue(String(localeDate(recentTrades[i - 1] ? recentTrades[i - 1].created_at : '', 'time')), String(localeDate(created_at, 'time')));

            return recentTrades ? [
                <TradeTableCell
                    price={price}
                    priceFixed={priceFixed}
                    takerType={taker_type}
                    prevValue={recentTrades[i - 1] ? recentTrades[i - 1].price : 0}
                    amountFixed={amountFixed}
                    id={i}
                    type="price"
                />,
                <TradeTableCell amount={amount} amountFixed={amountFixed} type="amount"/>,
                <TradeTableCell higlightedDate={higlightedDate} type="date"/>,
            ]: undefined;
        };

        return (recentTrades.length > 0)
            ? recentTrades.map(renderRow)
            : [[]];
    }, [currentMarket, recentTrades]);

    const handleOnSelect = React.useCallback((index: string) => {
        const priceToSet = recentTrades[Number(index)] ? Number(recentTrades[Number(index)].price) : 0;
    
        if (currentPrice !== priceToSet) {
            dispatch(setCurrentPrice(priceToSet));
        }
    }, [currentPrice, recentTrades]);
    
    React.useEffect(() => {
        if (currentMarket) {
            dispatch(recentTradesFetch(currentMarket));
        }
    }, [currentMarket]);

    const className = classnames('recent-trades__table__body', {
        'empty' : !recentTrades.length,
    });

    const renderTable = useMemo(() => {
        return (
             <React.Fragment>
                {headers}
                <div className={className}>
                    {recentTrades.length >= 1 ? 
                    <RecentTradesTable
                        data={getTrades()}
                        onSelect={handleOnSelect}
                    />
                : <NoResultData class="themes" title={formatMessage({ id: 'page.body.trade.header.recentTrades.nodata' })}/>}
                </div>
             </React.Fragment>             
        );
    }, [recentTrades, currentMarket])

    return (
        <div className="recent-trades__table">
            {renderTable}
        </div>
    );
};

export {
    RecentTradesMarket,
    handleHighlightValue,
};
