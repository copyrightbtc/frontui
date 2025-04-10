import React from 'react';
import { FillSpinner } from "react-spinners-kit";
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { CalendarIcon } from '../../assets/images/CalendarIcon';
import { NoResultData, Pagination, DropdownFilter } from '../../components';
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
//import { getTriggerSign } from '../OpenOrders/helpers';

interface OrdersProps {
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
    orderType: boolean;
    status: boolean;
    filters: {
        [key: string]: any
    }; 
}

const paginationLimit = 25;

type Props = OrdersProps & ReduxProps & DispatchProps & IntlProps;

class OrdersComponent extends React.PureComponent<Props, OrdersState>  {
    constructor(props: Props | Readonly<Props>) {
        
        super(props);
        this.state = {
            orderType: false,
            status: false,
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
            updateList = list.filter(o => o.state === 'wait' || o.state === 'trigger_wait');
        }

        return (
            <div className={`profile-history__wrapper ${updateList.length ? '' : 'profile-history__wrapper-empty'}`}>
                {this.renderFilterRow()}
                {fetching && <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div>}
                {updateList.length ? this.renderContent(updateList) : null}
                {!updateList.length && !fetching ? <NoResultData /> : null}
            </div>
        );
    }

    private renderFilterRow = () => {
        const today = new Date().toISOString().split('T')[0];    
        return (
            <div className="filter-elements">
                <div className="filter-elements__left">
                    <div className="filter-cell__dates">
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
                        <hr/>
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
                    <div className="filter-cell">
                        <DropdownFilter
                            fixedWidth={150}
                            placeholder=""
                            suffix={this.props.intl.formatMessage({ id: 'page.body.filters.market' })}
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
                    <div className="filter-cell">
                        <DropdownFilter
                            fixedWidth={170}
                            placeholder=""
                            suffix={this.props.intl.formatMessage({ id: 'page.body.filters.orderType' })}
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
                    </div>
                    {this.props.type !== 'open' && 
                    <div className="filter-cell">
                        <DropdownFilter
                            fixedWidth={170}
                            placeholder=""
                            suffix={this.props.intl.formatMessage({ id: 'page.body.filters.state' })}
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
        const { firstElemIndex, lastElemIndex, pageIndex, nextPageExists } = this.props;
        
        return (
            <React.Fragment>
                <div className="table-main with-hover">
                    {this.renderHeaders()}
                    <tbody>{this.retrieveData(list)}</tbody>
                </div>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    page={pageIndex}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                />
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
            ...(fromTimestamp && { time_from: fromTimestamp }),
            ...(toTimestamp && { time_to: toTimestamp }),
        });
    };

    private renderHeaders = () => {
        return (
            <thead>
                <tr>
                    <th>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.date' })}</th>
                    <th>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.market' })}</th>
                    <th>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.side' })}</th>
                    <th>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.orderType' })}</th>
                    <th>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.avgPrice' })}</th>
                    <th>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.price' })}</th>
                    <th>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.amount' })}</th>
                    <th>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.value' })}</th>
                    <th>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.filled' })}</th>
                    <th>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.status' })}</th>
                    <th></th>
                </tr>
            </thead>
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
            trigger_price,
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
        const actualPrice = this.getPrice(ord_type, status, avg_price, trigger_price, price);
        const total = +actualPrice * +origin_volume;
        const executedVolume = Number(origin_volume) - Number(remaining_volume);
        const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);

        return [
            <tr>
                <td>
                    <div key={id} className="date-split">
                        <div className="date">{localeDate(date, 'date')}</div>
                        <div className="time">{localeDate(date, 'time')}</div>
                    </div>
                </td>
                <td>
                    <div key={id} className="bold">
                        {marketName}
                    </div>
                </td>
                <td>
                    <div style={{ color: setTradeColor(side).color }} key={id}>{orderSide}</div>
                </td>
                <td>
                    <div key={id}>{orderType}</div>
                </td>
                <td>
                    <div>{avg_price ? <Decimal key={id} fixed={currentMarket.price_precision} thousSep=",">{avg_price}</Decimal> : '-'}</div>
                </td>
                <td>
                    <div>{price ? <Decimal key={id} fixed={currentMarket.price_precision} thousSep=",">{price}</Decimal> : '-'}</div>
                </td>
                <td>
                    <Decimal key={id} fixed={currentMarket.amount_precision} thousSep=",">{origin_volume}</Decimal>
                </td>
                <td>
                    {total}
                </td>
                <td> 
                    <div className={`${+filled === 100 ? 'filled-order' : ''}`} key={id}>
                        <Decimal fixed={2} thousSep=",">{+filled}</Decimal>%
                    </div>
                </td>
                <td>
                    <div key={id}>{status}</div>
                </td>
                <td>
                    <div>{(state === 'wait' || state === 'trigger_wait') && 
                        <div className="iconbutton-cancel"><CloseIcon key={id} onClick={this.handleCancel(id)} /></div>
                        }
                    </div>
                </td>
            </tr>
        ];
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

    private getPrice = (ord_type, status, avg_price, trigger_price, price) => {
        if (ord_type === 'market' || status === 'done') {
            return avg_price;
        } else if (status === 'trigger_wait') {
            return trigger_price;
        } else {
            return price;
        }
    };

    private setOrderStatus = (status: string) => {
        switch (status) {
            case 'done':
                return (
                    <div>
                        <FormattedMessage id={`page.body.openOrders.content.status.done`} />
                    </div>
                );
            case 'cancel':
            case 'trigger_cancel':
            case 'execution_reject':
                return (
                    <div className="order-danger">
                        <FormattedMessage id={`page.body.openOrders.content.status.${status}`} />
                    </div>
                );
            case 'wait':
            case 'trigger_wait':
                return (
                    <div className="order-success">
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

export const OrdersElement = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(OrdersComponent) as any; // tslint:disable-line
