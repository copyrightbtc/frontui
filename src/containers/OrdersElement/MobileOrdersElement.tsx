import React from 'react';
import { FillSpinner } from "react-spinners-kit";
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { compose } from 'redux';
import { IntlProps } from '../../';
import Accordion from 'react-bootstrap/Accordion';
import { MoreHoriz } from 'src/assets/images/MoreHoriz';
import { ArrowDownward } from 'src/assets/images/ArrowDownward';
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
} from '../../modules';
import { OrderCommon } from '../../modules/types';

interface MobileOrdersProps {
    type: string;
}

interface ReduxProps {
    marketsData: Market[];
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

type Props = MobileOrdersProps & ReduxProps & DispatchProps & IntlProps;

class MobileOrdersComponent extends React.PureComponent<Props, OrdersState>  {
    constructor(props: Props | Readonly<Props>) {
        
        super(props);
        this.state = {
            filters: {}, 
        }
    } 

    public componentDidMount() {
        const { type } = this.props;
        const { filters } = this.state;

        const fromTimestamp = filters.dateFrom ? new Date(filters.dateFrom).getTime() / 1000 : undefined;
        const toTimestamp = filters.dateTo ? new Date(filters.dateTo).getTime() / 1000 : undefined;

        this.props.userOrdersHistoryFetch({
            pageIndex: 0,
            type,
            limit: paginationLimit,
            ...(fromTimestamp && { time_from: fromTimestamp }),
            ...(toTimestamp && { time_to: toTimestamp })
        });
    }

    public render() {
        const { type, list, fetching } = this.props;

        let updateList = list;

        if (type === 'open') {
            updateList = list.filter(o => o.state === 'wait');
        }

        return (
            <div className={`mobile-history-page${updateList.length ? '' : ' mobile-history-page--empty'}`}>
                {fetching && <div className="spinner-loader-center fixed"><FillSpinner size={19} color="var(--color-accent)"/></div>}
                {updateList.length && !fetching ? this.renderFilterRow() : null}
                {updateList.length ? this.renderContent(updateList) : null}
                {!updateList.length && !fetching ? <NoResultData class="themes"/> : null}
            </div>
        );
    }

    private renderFilterRow = () => {
        const today = new Date().toISOString().split('T')[0];    
        return (
            <Accordion className='moreinfo-filters'>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        {this.props.intl.formatMessage({ id: 'page.body.profile.content.action.more.filters'})}
                        <ArrowDownward className="arrow" />
                    </Accordion.Header>
                    <Accordion.Body>
                    <div className="filter-elements">
                        <div className="filter-elements__top">
                            <div className="filter-cell__dates themes">
                                <div className="cell-date">
                                    <div className="suffix-date">{this.props.intl.formatMessage({ id: 'page.body.filters.dateFrom' })}</div>
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
                                <em>|</em>
                                <div className="cell-date">
                                    <div className="suffix-date">{this.props.intl.formatMessage({ id: 'page.body.filters.dateTo' })}</div>
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
                            <div className="filter-cell themes">
                                <DropdownFilter
                                    placeholder=""
                                    suffix={this.props.intl.formatMessage({ id: 'page.body.filters.market' })}
                                    emptyTitle={this.props.intl.formatMessage({id: 'search.options.empty'})}
                                    options={[
                                        {
                                            value: 'all',
                                            label: this.props.intl.formatMessage({ id: 'page.body.filters.all' })
                                        },
                                        ...this.props.marketsData.map(m => ({
                                            value: m.id,
                                            label: m.name
                                        })),
                                        
                                    ]}
                                    onSelect={this.selectMarket}
                                    value={this.state.filters?.market || {
                                        value: 'all',
                                        label: this.props.intl.formatMessage({ id: 'page.body.filters.all' })
                                    }}
                                />
                            </div>
                            {this.props.type !== 'open' && 
                            <div className="filter-cell themes">
                                <DropdownFilter
                                    placeholder=""
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
                        <div className="filter-elements__bottom">
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
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
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
    
    private selectMarket = (option: {
        label: string;
        value: string;
    }) => {
        this.setState({
            filters: {
                ...this.state.filters,
                market: option
            }
        });
    }

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
            side: filters.sides && filters.sides.value !== 'all' ? filters.sides.value : undefined,
            state: filters.status && filters.status.value !== 'all' ? filters.status.value : undefined,
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
        const { firstElemIndex, lastElemIndex, pageIndex, nextPageExists, type } = this.props;
        
        let updateList = list;

        if (type === 'open') {
            updateList = list.filter(o => o.state === 'wait');
        }
        
        return (
            <React.Fragment>
                <div className="trade-orders-mobile__wrapper">
                    {this.retrieveData(list)}
                </div>
                {updateList.length > paginationLimit ?
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    page={pageIndex}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                /> : null}
            </React.Fragment>
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
        const currentMarket = this.props.marketsData.find(m => m.id === market)
            || { name: '', price_precision: 0, amount_precision: 0 };

        const orderType = this.getType(ord_type);
        const orderSide = this.getSide(side);
        const marketName = currentMarket ? currentMarket.name : market;
        const date = updated_at || created_at;
        const status = this.setOrderStatus(state);
        const actualPrice = this.getPrice(ord_type, status, avg_price, price);
        const total = +actualPrice * +origin_volume;
        const totalRemaining = +remaining_volume * +price;
        const executedVolume = Number(origin_volume) - Number(remaining_volume);
        const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
        const curMarket = this.props.marketsData.find(i => i.id === market);

        return (
            <div key={id} className="trade-orders-mobile__order">
                <div key={id} className="trade-orders-mobile__order__top">
                    <div className="order-block type">
                        <div className="cells" style={{ color: setTradeColor(side).color }}>{orderType}/{orderSide}</div>
                        <div className={`cells filling${+filled === 100 ? '' : ' full'}`}><Decimal fixed={2} thousSep=",">{+filled}</Decimal>%</div>
                    </div>
                    <div className="order-block">
                        <div className="cells name">
                            {marketName.toUpperCase()}
                        </div>
                        <div className="cells trad">
                            <span>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.amount'})}</span>
                            <div className='numbers'>{parseFloat(Number(origin_volume).toFixed(currentMarket.amount_precision))}</div>
                        </div>
                        <div className="cells trad">
                            <span>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.price'})}</span>
                            <div className='numbers'>
                                {orderType === 'Market' || status === 'done' ? 
                                    <OverlayTrigger 
                                        placement="auto"
                                        delay={{ show: 250, hide: 300 }} 
                                        overlay={<Tooltip title="page.body.openOrders.header.avgPrice.tooltip.description" />}>
                                            <div className="dotted">{parseFloat(Number(actualPrice).toFixed(currentMarket.price_precision))}</div>
                                    </OverlayTrigger> 
                                : parseFloat(Number(actualPrice).toFixed(currentMarket.price_precision))}
                            </div>
                        </div>
                    </div>
                    <div className="order-block last">
                        <div className="cells dates">
                            <div className="date">{localeDate(date, 'date')}</div>
                            <div className="time">{localeDate(date, 'time')}</div>
                        </div>
                        {state !== 'wait' ? 
                            <div className='cells status'>{status}</div> : 
                            <div className="cells status">
                                <div key={id} className="cancel-wrappe" onClick={this.handleCancel(id)}>
                                    {this.props.intl.formatMessage({ id: 'page.body.p2p.dispute.cancel'})}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <Accordion className='moreinfo-trades'>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>
                            <MoreHoriz className="dotes" />
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="order-block__full">
                                <span>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.total'})}</span>
                                {parseFloat(Number(total).toFixed(currentMarket.price_precision))}&nbsp;{curMarket?.quote_unit?.toUpperCase()}
                            </div>
                            <div className="order-block__full">
                                <span>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.amountRemaining'})}</span>
                                {parseFloat(Number(remaining_volume).toFixed(currentMarket.amount_precision))}&nbsp;{curMarket?.base_unit?.toUpperCase()}
                            </div>
                            <div className="order-block__full">
                                <span>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.totalRemaining'})}</span>
                                {parseFloat(Number(totalRemaining).toFixed(currentMarket.price_precision))}&nbsp;{curMarket?.quote_unit?.toUpperCase()}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
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

export const MobileOrdersElement = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(MobileOrdersComponent) as any; // tslint:disable-line
