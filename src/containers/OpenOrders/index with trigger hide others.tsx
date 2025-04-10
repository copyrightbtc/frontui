import classnames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FillSpinner } from "react-spinners-kit";
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useOpenOrdersFetch } from 'src/hooks';
import { Decimal, OpenOrders } from '../../components';
import { localeDate, setTradeColor } from '../../helpers';
import { NoResultData } from 'src/components';
import {
    openOrdersCancelFetch,
    ordersCancelAllFetch,
    selectCurrentMarket,
    selectMarkets,
    selectOpenOrdersFetching,
    selectOpenOrdersList,
    selectOrdersHideOtherPairsState,
    toggleOpenOrdersPairsSwitcher,
} from '../../modules';
import { OrderCommon } from '../../modules/types';
import { getTriggerSign } from './helpers';

export const OpenOrdersComponent: React.FC = (): React.ReactElement => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const hideOtherPairs = useSelector(selectOrdersHideOtherPairsState);
    const currentMarket = useSelector(selectCurrentMarket);
    const list = useSelector(selectOpenOrdersList);
    const fetching = useSelector(selectOpenOrdersFetching);
    const markets = useSelector(selectMarkets);

    const translate = React.useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    useOpenOrdersFetch(currentMarket, hideOtherPairs);

    const headersKeys = useMemo(() => [
        'Date',
        'Market',
        'Side',
        'Type',
        'Price',
        'Amount',
        'Total',
        'Trigger',
        'Filled',
        'Amount remaining',
        '',
    ], []);

    const renderHeaders = useMemo(() => [
        translate('page.body.trade.header.openOrders.content.date'),
        translate('page.body.trade.header.openOrders.content.market'),
        translate('page.body.openOrders.header.sideside'), 
        translate('page.body.trade.header.openOrders.content.type'),
        translate('page.body.trade.header.openOrders.content.price'),
        translate('page.body.trade.header.openOrders.content.amount'),
        translate('page.body.trade.header.openOrders.content.total'),
        translate('page.body.trade.header.openOrders.content.trigger'),
        translate('page.body.trade.header.openOrders.content.filled'),
        translate('page.body.openOrders.header.amountRemaining'),
        '',
    ], []);

    const renderData = useCallback(data => {
        if (!data.length) {
            return [[[''], [''], [''], <NoResultData class="themes" title={formatMessage({ id: 'page.body.trade.header.openOrders.nodata' })}/>]];
        }

        return data.map((item: OrderCommon) => {
            const { id, price, created_at, remaining_volume, origin_volume, side, ord_type, market, trigger_price } = item;
            const executedVolume = Number(origin_volume) - Number(remaining_volume);
            const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
            const curMarket = markets.find(i => i.id === market);
            const priceFixed = curMarket?.price_precision || 0;
            const amountFixed = curMarket?.amount_precision || 0;

            return [
                <div key={id} className='cells date-split'>
                    <div className="date">{localeDate(created_at, 'date')}</div>
                    <div className="time">{localeDate(created_at, 'time')}</div>
                </div>,
                <div key={id} className="cells bold">{curMarket?.name.toUpperCase()}</div>,
                <div className="cells" style={{ color: setTradeColor(side).color }} key={id}>{side === 'buy' ? 
                    translate('page.body.openOrders.content.side.buy') : 
                    translate('page.body.openOrders.content.side.sell')}
                </div>,
                <div key={id} className="cells">{ord_type ? translate(`page.body.trade.header.openOrders.content.type.${ord_type}`) : '-'}</div>,
                <div key={id} className="cells"><Decimal fixed={priceFixed} thousSep=",">{price}</Decimal></div>,
                <div key={id} className="cells"><Decimal fixed={amountFixed} thousSep=",">{+remaining_volume}</Decimal></div>,
                <div key={id} className="cells"><Decimal fixed={amountFixed} thousSep=",">{+origin_volume * +price}</Decimal> <div className="coin-name">{curMarket?.quote_unit?.toUpperCase()}</div></div>,
                <div key={id} className="cells">
                    {trigger_price ? (
                        <React.Fragment>
                            <div>{translate('page.body.trade.header.openOrders.lastPrice')}</div>&nbsp;{getTriggerSign(ord_type, side)}&nbsp;&nbsp;
                            <div style={{ color: setTradeColor(side).color }}>{Decimal.format(trigger_price, priceFixed, ',')}</div>
                        </React.Fragment>
                    ) : '-'}
                </div>,
                <div className='cells filling' key={id}><Decimal fixed={2} thousSep=",">{+filled}</Decimal>%</div>,
                <div key={id} className="cells"><Decimal fixed={amountFixed} thousSep=",">{+remaining_volume * +price}</Decimal></div>,
                side,
            ];
        });
    }, [markets]);

    const handleCancel = useCallback((index: number) => {
        const orderToDelete = list[index];
        dispatch(openOrdersCancelFetch({ order: orderToDelete, list }));
    }, [list]);

    const handleCancelAll = useCallback(() => {
        currentMarket && dispatch(ordersCancelAllFetch({ market: currentMarket.id }));
    }, [currentMarket]);

    const classNames = useMemo(() => 
        classnames('trade-orders', {
                'empty': !list.length,
                'loading': fetching,
            },
        ),
    [list, fetching]);

    const handleToggleCheckbox = React.useCallback(event => {
        event.preventDefault();
        dispatch(toggleOpenOrdersPairsSwitcher(!hideOtherPairs));
    }, [hideOtherPairs]);

    const renderContent = useMemo(() => {
        if (fetching) {
            return (
                <div className="open-order-loading">
                    <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div>
                </div>
            );
        }

        return (
            <OpenOrders
                headersKeys={headersKeys}
                headers={renderHeaders}
                data={renderData(list)}
                onCancel={handleCancel}
            />
        );
    }, [fetching, list, markets]);

    return (
        <div className={classNames}>
            <div className="grid-item__header">
                <div className='trade-orders__header'>
                    {translate('page.body.trade.header.openOrders')}
                    <FormControlLabel
                        label={translate('page.body.trade.header.openOrders.hideOtherPairs')}
                        control={
                        <Checkbox
                            checked={hideOtherPairs} 
                            onClick={handleToggleCheckbox} 
                            required
                            sx={{ '& .MuiSvgIcon-root': { 
                                fontSize: 18,
                                color: 'var(--color-blue)',
                                } 
                            }}
                        />
                        }
                    />
                </div>
                <div className="cancel-orders themes" onClick={handleCancelAll}>
                    <span>{translate('page.body.openOrders.header.button.cancelAll')}</span>
                    <div className="cancel-orders__close" />
                </div>
            </div>
            {renderContent}
        </div>
    );
}
