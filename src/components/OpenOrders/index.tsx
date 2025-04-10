import React from 'react';
import { FillSpinner } from "react-spinners-kit";
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { CalendarIcon } from '../../assets/images/CalendarIcon';
import { OverlayTrigger } from 'react-bootstrap';
import { NoResultData, Pagination, DropdownFilter, Tooltip } from '../../components';
import { Decimal } from '../../components/Decimal';
import { localeDate, setTradeColor } from '../../helpers';
import DatePicker from 'react-date-picker';
import { Button } from '@mui/material';
import {
    Market,
    ordersHistoryCancelFetch,
    RootState,
    selectCancelAllFetching,
    selectCancelFetching,
    selectCurrentPageIndex,
    selectMarkets,
    selectOrdersFirstElemIndex,
    selectOrdersHistory,
    selectOrdersHistoryLoading,
    selectOrdersLastElemIndex,
    selectOrdersNextPageExists,
    userOrdersHistoryFetch,
    selectCurrentMarket,
} from '../../modules';
import { OrderCommon } from '../../modules/types';

interface OrdersProps {
    type: string;
}

interface ReduxProps {
    marketsData: Market[];
    currentMarket: Market | undefined;
    pageIndex: number;
    firstElemIndex: number;
    list: OrderCommon[];
    fetching: boolean;
    lastElemIndex: number;
    nextPageExists: boolean;
    cancelAllFetching: boolean;
    cancelFetching: boolean;
}

interface DispatchProps {
    ordersHistoryCancelFetch: typeof ordersHistoryCancelFetch;
    userOrdersHistoryFetch: typeof userOrdersHistoryFetch;
}

interface OrdersState {
    filters: {
        [key: string]: any
    };
}

const paginationLimit = 25;

type Props = OrdersProps & ReduxProps & DispatchProps & IntlProps;

class OpenOrdersComponent extends React.PureComponent<Props, OrdersState>  {
    constructor(props: Props | Readonly<Props>) {
        
        super(props);
        this.state = {
            filters: {},
        }
    }

    private fetchUserOrdersHistory(marketId: string) {
        const { type } = this.props;
        const { filters } = this.state;
    
        const fromTimestamp = filters.dateFrom ? new Date(filters.dateFrom).getTime() / 1000 : undefined;
        const toTimestamp = filters.dateTo ? new Date(filters.dateTo).getTime() / 1000 : undefined;
    
        this.props.userOrdersHistoryFetch({
            pageIndex: 0,
            type,
            limit: paginationLimit,
            market: marketId,
            ...(fromTimestamp && { time_from: fromTimestamp }),
            ...(toTimestamp && { time_to: toTimestamp }),
        });
    }    

    public componentDidMount() {
        const { currentMarket } = this.props;
        this.fetchUserOrdersHistory(currentMarket?.id);
    }

    public componentDidUpdate(prevProps: Props) {
        const { currentMarket } = this.props;

        // Check if currentMarket has changed
        if (currentMarket?.id !== prevProps.currentMarket?.id) {
            this.fetchUserOrdersHistory(currentMarket.id);
        }
    }

    public render() {
        const { type, list, fetching } = this.props;

        let updateList = list;

        if (type === 'open') {
            updateList = list.filter(o => o.state === 'wait');
        }

        return (
            <div className={`trade-orders${updateList.length ? '' : ' empty'}`}>
                {this.renderFilterRow()}
                {fetching && <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div>}
                {updateList.length ? this.renderContent(updateList) : null}
                {!updateList.length && !fetching ? 
                <div className='empty-container'>
                    {type === 'open' ? 
                    <NoResultData class="themes" title={this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.nodata' })}/> :
                    <NoResultData class="themes" title={this.props.intl.formatMessage({ id: 'page.body.trade.header.allOrders.nodata' })}/> }
                    </div> : null}
            </div>
        );
    }

    private renderFilterRow = () => {
        const today = new Date().toISOString().split('T')[0];    
        return (
            <div className="filter-elements">
                <div className="filter-elements__left">
                    <div className="filter-cell__dates themes">
                        <div className="cell-date">
                            <DatePicker
                                className="input-date"  
                                onChange={this.handleDateFrom}
                                value={this.state.filters?.dateFrom || ''}
                                maxDate = {new Date(this.state.filters?.dateTo || new Date(today))}
                                format="dd-MM-y"
                                calendarIcon={<CalendarIcon />}
                                dayPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.dd' })}
                                monthPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.mm' })}
                                yearPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.yy' })}
                            />
                        </div>
                        <hr/>
                        <div className="cell-date">
                            <DatePicker
                                className="input-date"  
                                onChange={this.handleDateTo}
                                value={this.state.filters?.dateTo || ''}
                                minDate={new Date(this.state.filters?.dateFrom || null)}
                                maxDate={new Date(today)}
                                format="dd-MM-y"
                                calendarIcon={<CalendarIcon />}
                                dayPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.dd' })}
                                monthPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.mm' })}
                                yearPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.yy' })}
                            />
                        </div>
                    </div>
                    <div className="filter-cell themes">
                        <DropdownFilter
                            fixedWidth={200}
                            placeholder=""
                            suffix={this.props.intl.formatMessage({ id: 'page.body.filters.side' })}
                            emptyTitle={this.props.intl.formatMessage({id: 'search.options.empty'})}
                            options={[
                                { value: 'all', label: this.props.intl.formatMessage({ id: 'page.body.filters.all' }) },
                                { value: 'done', label: this.props.intl.formatMessage({id: 'page.body.trade.header.newOrder.content.tabs.buy' }) },
                                { value: 'wait', label: this.props.intl.formatMessage({id: 'page.body.trade.header.newOrder.content.tabs.sell' }) },
                            ]}
                            onSelect={this.selectOrderSides}
                            value={this.state.filters?.sides || {
                                value: 'all',
                                label: this.props.intl.formatMessage({ id: 'page.body.filters.all' })
                            }}
                        />
                    </div>
                    {this.props.type !== 'open' && 
                    <div className="filter-cell themes">
                        <DropdownFilter
                            placeholder=""
                            fixedWidth={160}
                            suffix={this.props.intl.formatMessage({ id: 'page.body.filters.orderType' })}
                            emptyTitle={this.props.intl.formatMessage({id: 'search.options.empty'})}
                            options={[
                                { value: 'all', label: this.props.intl.formatMessage({ id: 'page.body.filters.all' }) },
                                { value: 'limit', label: this.props.intl.formatMessage({id: 'page.body.filters.orderType.limit' }) },
                                { value: 'market', label: this.props.intl.formatMessage({id: 'page.body.filters.orderType.market' }) },
                            ]}
                            onSelect={this.selectOrderType}
                            value={this.state.filters?.orderType || {
                                value: 'all',
                                label: this.props.intl.formatMessage({ id: 'page.body.filters.all' })
                            }}
                        />
                    </div>}
                    {this.props.type !== 'open' && 
                    <div className="filter-cell themes">
                        <DropdownFilter
                            placeholder=""
                            fixedWidth={160}
                            suffix={this.props.intl.formatMessage({ id: 'page.body.filters.state' })}
                            emptyTitle={this.props.intl.formatMessage({id: 'search.options.empty'})}
                            options={[
                                { value: 'all', label: this.props.intl.formatMessage({ id: 'page.body.filters.all' }) },
                                { value: 'done', label: this.props.intl.formatMessage({id: 'page.body.openOrders.content.status.done' }) },
                                { value: 'wait', label: this.props.intl.formatMessage({id: 'page.body.openOrders.content.status.wait' }) },
                                { value: 'cancel', label: this.props.intl.formatMessage({id: 'page.body.openOrders.content.status.cancel' }) },
                            ]}
                            onSelect={this.selectOrderState}
                            value={this.state.filters?.status || {
                                value: 'all',
                                label: this.props.intl.formatMessage({ id: 'page.body.filters.all' })
                            }}
                        />
                    </div>}
                </div>
                <div className="filter-elements__right">
                    <Button 
                        className="search-button" 
                        onClick={this.handleSearch}
                    >
                        {this.props.intl.formatMessage({ id: 'page.body.filters.search' })}
                    </Button>
                    <Button 
                        className="reset-button" 
                        onClick={this.handleReset}
                    >
                        {this.props.intl.formatMessage({ id: 'page.body.filters.reset' })}
                    </Button>
                </div>
            </div>
        );
    }

    private handleDateFrom = (value: Date) => {
        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                dateFrom: value,
            },
        }));
    };
    private handleDateTo = (value: Date) => {
        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                dateTo: value,
            },
        }));
    };
    
    private selectOrderType = (option: {
        label: string;
        value: string;
    }) => {
        this.setState({
            filters: {
                ...this.state.filters,
                orderType: option
            }
        });
    }

    private selectOrderState = (option: {
        label: string;
        value: string;
    }) => {
        this.setState({
            filters: {
                ...this.state.filters,
                status: option
            }
        });
    }

    private selectOrderSides = (option: {
        label: string;
        value: string;
    }) => {
        this.setState({
            filters: {
                ...this.state.filters,
                sides: option
            }
        });
    }

    private handleSearch = () => {
        const { filters } = this.state;
    
        const fromTimestamp = filters.dateFrom ? new Date(filters.dateFrom).getTime() / 1000 : undefined;
        const toTimestamp = filters.dateTo ? new Date(filters.dateTo).getTime() / 1000 : undefined;
    
        const filterParams = {
            pageIndex: 0,
            type: this.props.type,
            limit: paginationLimit,
            market: filters.market && filters.market.value !== 'all' ? filters.market.value : undefined,
            ord_type: filters.orderType && filters.orderType.value !== 'all' ? filters.orderType.value : undefined,
            state: filters.status && filters.status.value !== 'all' ? filters.status.value : undefined,
            side: filters.sides && filters.sides.value !== 'all' ? filters.sides.value : undefined,
            time_from: fromTimestamp,
            time_to: toTimestamp,
        };
    
        this.props.userOrdersHistoryFetch(filterParams);
    };

    private handleReset = () => {
        this.setState({ filters: {} }, () => {
            const filterParams = {
                pageIndex: 0,
                type: this.props.type,
                limit: paginationLimit,
            };
            this.props.userOrdersHistoryFetch(filterParams);
        });
    };

    public renderContent = list => {
        const { 
            firstElemIndex, 
            lastElemIndex, 
            pageIndex, 
            nextPageExists,
            type,
        } = this.props;
  
        let updateList = list;

        if (type === 'open') {
            updateList = list.filter(o => o.state === 'wait');
        }
        
        return (
            <div className="trade-orders__table">
                {this.renderHeaders()}
                <div className='trade-orders__table__body'>
                    {this.retrieveData(list)}
                    {updateList.length > 25 ?
                    <Pagination
                        firstElemIndex={firstElemIndex}
                        lastElemIndex={lastElemIndex}
                        page={pageIndex}
                        nextPageExists={nextPageExists}
                        onClickPrevPage={this.onClickPrevPage}
                        onClickNextPage={this.onClickNextPage}
                    /> : null} 
                </div>
            </div>
        );
    };

    private onClickPrevPage = () => {
        const { pageIndex, type } = this.props;
        const { filters } = this.state;
    
        const fromTimestamp = filters.dateFrom ? new Date(filters.dateFrom).getTime() / 1000 : undefined;
        const toTimestamp = filters.dateTo ? new Date(filters.dateTo).getTime() / 1000 : undefined;

        this.props.userOrdersHistoryFetch({
            pageIndex: Number(pageIndex) - 1,
            type,
            limit: paginationLimit,
            market: filters.market && filters.market.value !== 'all' ? filters.market.value : undefined,
            ord_type: filters.orderType && filters.orderType.value !== 'all' ? filters.orderType.value : undefined,
            side: filters.sides && filters.sides.value !== 'all' ? filters.sides.value : undefined,
            state: filters.status && filters.status.value !== 'all' ? filters.status.value : undefined,
            ...(fromTimestamp && { time_from: fromTimestamp }),
            ...(toTimestamp && { time_to: toTimestamp }),
        });
    };

    private onClickNextPage = () => {
        const { pageIndex, type } = this.props;
        const { filters } = this.state;
    
        const fromTimestamp = filters.dateFrom ? new Date(filters.dateFrom).getTime() / 1000 : undefined;
        const toTimestamp = filters.dateTo ? new Date(filters.dateTo).getTime() / 1000 : undefined;

        this.props.userOrdersHistoryFetch({
            pageIndex: Number(pageIndex) + 1,
            type,
            limit: paginationLimit,
                        market: filters.market && filters.market.value !== 'all' ? filters.market.value : undefined,
            ord_type: filters.orderType && filters.orderType.value !== 'all' ? filters.orderType.value : undefined,
            side: filters.sides && filters.sides.value !== 'all' ? filters.sides.value : undefined,
            state: filters.status && filters.status.value !== 'all' ? filters.status.value : undefined,
            ...(fromTimestamp && { time_from: fromTimestamp }),
            ...(toTimestamp && { time_to: toTimestamp }),
        });
    };

    private renderHeaders = () => {
        return (
            <div className='trade-orders__table__head'>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.date'})}</div>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.market'})}</div>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.side'})}</div>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.orderType'})}</div>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.price'})}</div>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.amount'})}</div>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.total'})}</div>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.filled'})}</div>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.amountRemaining'})}</div>
                {this.props.type === 'open' && <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.totalRemaining'})}</div>}
                {this.props.type !== 'open' && <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.status'})}</div>}
                <div className='cells closebut'></div>
            </div>
        );
    };

    private retrieveData = list => {
        return list.map(item => this.renderOrdersHistoryRow(item));
    };

    private renderOrdersHistoryRow = item => {
        const {
            id,
            market,
            ord_type,
            price,
            avg_price,
            remaining_volume,
            origin_volume,
            side,
            state,
            updated_at,
            created_at,
        } = item;
        const { marketsData, currentMarket } = this.props;

        const thisMarket = marketsData.find(m => m.id === market)
            || { name: market, price_precision: 0, amount_precision: 0 };

        const orderType = this.getType(ord_type);
        const orderSide = this.getSide(side);
        const marketName = thisMarket ? thisMarket.name : market;
        const date = updated_at || created_at;
        const status = this.setOrderStatus(state);
        const actualPrice = this.getPrice(ord_type, status, avg_price, price);
        const total = +actualPrice * +origin_volume;
        const totalRemaining = +remaining_volume * +price;
        const executedVolume = Number(origin_volume) - Number(remaining_volume);
        const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
        const curMarket = marketsData.find(i => i.id === market);

        const switching = currentMarket.name === marketName;
        
        return (
            <div key={id} className="trade-orders__table__body__row">
                <div className="cells date-split">
                    <div className="date">{localeDate(date, 'date')}</div>
                    <div className="time">{localeDate(date, 'time')}</div>
                </div>
                <div className="cells bold">
                    {marketName.toUpperCase()}
                </div>
                <div className="cells" style={{ color: setTradeColor(side).color }}>{orderSide}</div>
                <div className="cells">{orderType}</div>
                <div className="cells">
                    <Decimal fixed={thisMarket.price_precision} thousSep=",">{actualPrice}</Decimal> 
                    <div className="coin-name">{
                        ord_type === 'market' || status === 'done' ? 
                            <OverlayTrigger 
                                placement="auto"
                                delay={{ show: 250, hide: 300 }} 
                                overlay={<Tooltip title="page.body.openOrders.header.avgPrice.tooltip.description" />}>
                                    <div className="dotted">{curMarket?.quote_unit?.toUpperCase()}</div>
                            </OverlayTrigger> 
                        : curMarket?.quote_unit?.toUpperCase()
                    }</div>
                </div>
                <div className="cells"><Decimal fixed={thisMarket.amount_precision} thousSep=",">{origin_volume}</Decimal><div className="coin-name">{curMarket?.base_unit?.toUpperCase()}</div></div>
                <div className="cells"><Decimal fixed={thisMarket.price_precision} thousSep=",">{total}</Decimal><div className="coin-name">{curMarket?.quote_unit?.toUpperCase()}</div></div>
                <div className={`cells filling${+filled === 100 ? '' : ' full'}`}><Decimal fixed={2} thousSep=",">{+filled}</Decimal>%</div>
                <div className="cells"><Decimal fixed={thisMarket.amount_precision} thousSep=",">{remaining_volume}</Decimal><div className="coin-name">{curMarket?.base_unit?.toUpperCase()}</div></div>                    
                {this.props.type === 'open' && <div className="cells"><Decimal fixed={thisMarket.price_precision} thousSep=",">{totalRemaining}</Decimal><div className="coin-name">{curMarket?.quote_unit?.toUpperCase()}</div></div>}
                {this.props.type !== 'open' && <div className='cells'>{status}</div>}
                <div className="cells closebut">
                    {(state === 'wait') ? <div className="iconbutton-cancel"><CloseIcon key={id} onClick={this.handleCancel(id)} /></div> : null}
                </div>
            </div>
        );
    };

    private getSide = (side: string) => {
        if (!side) {
            return '';
        }

        return this.props.intl.formatMessage({ id: `page.body.openOrders.header.side.${side}` });
    };

    private getType = (orderType: string) => {
        if (!orderType) {
            return '';
        }

        return this.props.intl.formatMessage({ id: `page.body.trade.header.openOrders.content.type.${orderType}` });
    };

    private getPrice = (ord_type, status, avg_price, price) => {
        if (ord_type === 'market' || status === 'done') {
            return avg_price;
        } else {
            return price;
        }
    };

    private setOrderStatus = (status: string) => {
        switch (status) {
            case 'done':
                return (
                    <div className="order-success">
                        <FormattedMessage id={`page.body.openOrders.content.status.done`} />
                    </div>
                );
            case 'cancel':
            case 'reject':
                return (
                    <div className="order-danger">
                        <FormattedMessage id={`page.body.openOrders.content.status.${status}`} />
                    </div>
                );
            case 'wait':
                return (
                    <div>
                        <FormattedMessage id={`page.body.openOrders.content.status.${status}`} />
                    </div>
                );
            default:
                return status;
        }
    };

    private handleCancel = (id: number) => () => {
        const { cancelAllFetching, cancelFetching, type, list } = this.props;
        if (cancelAllFetching || cancelFetching) {
            return;
        }
        this.props.ordersHistoryCancelFetch({ id, type, list });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    marketsData: selectMarkets(state),
    pageIndex: selectCurrentPageIndex(state),
    firstElemIndex: selectOrdersFirstElemIndex(state, paginationLimit),
    list: selectOrdersHistory(state),
    fetching: selectOrdersHistoryLoading(state),
    lastElemIndex: selectOrdersLastElemIndex(state, paginationLimit),
    nextPageExists: selectOrdersNextPageExists(state),
    cancelAllFetching: selectCancelAllFetching(state),
    cancelFetching: selectCancelFetching(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        ordersHistoryCancelFetch: payload => dispatch(ordersHistoryCancelFetch(payload)),
        userOrdersHistoryFetch: payload => dispatch(userOrdersHistoryFetch(payload)),
    });

export const OpenOrders = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(OpenOrdersComponent) as any; // tslint:disable-line
