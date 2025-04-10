import * as React from 'react';
import classnames from 'classnames';
import { FillSpinner } from "react-spinners-kit";
import { NoResultData } from '../../components';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { RecentTradesTable } from './RecentTradesTable';
import { DEFAULT_MARKET } from '../../constants';
import { localeDate } from '../../helpers';
import {
    fetchHistory,
    selectCurrentMarket,
    selectCurrentPrice,
    selectHistory,
    selectHistoryLoading,
    setCurrentPrice,
} from '../../modules';
import { handleHighlightValue } from './Market';
import { TradeTableCell } from './RecentTradesTableCell';

const timeFrom = String(Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000));

export const RecentTradesYours = () => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const list = useSelector(selectHistory);
    const fetching = useSelector(selectHistoryLoading);
    const currentMarket = useSelector(selectCurrentMarket) || DEFAULT_MARKET;
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


    const renderRow = (item, i) => {
        const { id, created_at, price, amount, taker_type } = item;
        const priceFixed = currentMarket ? currentMarket.price_precision : 0;
        const amountFixed = currentMarket ? currentMarket.amount_precision : 0;
        const higlightedDate = handleHighlightValue(String(localeDate([...list][i - 1] ? [...list][i - 1].created_at : '', 'time')), String(localeDate(created_at, 'time')));

        return [
            <TradeTableCell
                price={price}
                priceFixed={priceFixed}
                prevValue={[...list][i - 1] ? [...list][i - 1].price : 0}
                amountFixed={amountFixed}
                takerType={taker_type}
                id={id}
                type="price"
            />,
            <TradeTableCell amount={amount} amountFixed={amountFixed} type="amount"/>,
            <TradeTableCell higlightedDate={higlightedDate} type="date"/>,
        ];
    };

    const retrieveData = () => {
        return list.length > 0
            ? list.map(renderRow)
            : [[]];
    };

    const className = classnames('recent-trades__table__body', {
        'empty' : !list.length,
    });
    
    const renderContent = () => {
        return (
            <React.Fragment>
            {headers}
            <div className={className}>
                {list.length >= 1 ? 
                <RecentTradesTable
                    data={retrieveData()}
                    onSelect={handleOnSelect}
                />
            : <NoResultData class="themes" title={formatMessage({ id: 'page.body.trade.header.recentTrades.nodata' })}/>}
            </div>
         </React.Fragment>   
        );
    };

    const handleOnSelect = (index: string) => {
        const priceToSet = list[Number(index)] ? Number(list[Number(index)].price) : 0;

        if (currentPrice !== priceToSet) {
            dispatch(setCurrentPrice(priceToSet));
        }
    };

    React.useEffect(() => {
        dispatch(fetchHistory({
            type: 'trades',
            page: 0,
            time_from: timeFrom,
            market: currentMarket.id,
        }));
    }, [dispatch, currentMarket.id]);

    return (
        <div className="recent-trades__table">
            {fetching ? <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div> : renderContent()}
        </div>
    );
};
