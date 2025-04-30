import React from 'react';
import { FillSpinner } from "react-spinners-kit";
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { OverlayTrigger } from 'react-bootstrap';
import { NoResultData, Pagination, Tooltip } from '../../../components';
import { Decimal } from '../../../components/Decimal';
import { localeDate, setTradeColor } from '../../../helpers';
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
} from '../../../modules';
import { OrderCommon } from '../../../modules/types';

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

const paginationLimit = 10;

type Props = OrdersProps & ReduxProps & DispatchProps & IntlProps;

class OrdersItemComponent extends React.PureComponent<Props>  {
    constructor(props: Props | Readonly<Props>) {
        super(props);
    }

    private fetchUserOrdersHistory(marketId: string) {
        const { type } = this.props;
    
        this.props.userOrdersHistoryFetch({
            pageIndex: 0,
            type,
            limit: paginationLimit,
            market: marketId,
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
            <div className={`trade-orders-mobile${updateList.length ? '' : ' empty'}`}>
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
            <div className='trade-orders-mobile__wrapper'>
                {this.retrieveData(list)}
                {updateList.length > 10 ?
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    page={pageIndex}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                /> : null} 
            </div>
        );
    };

    private onClickPrevPage = () => {
        const { pageIndex, type } = this.props;

        this.props.userOrdersHistoryFetch({
            pageIndex: Number(pageIndex) - 1,
            type,
            limit: paginationLimit,
        });
    };

    private onClickNextPage = () => {
        const { pageIndex, type } = this.props;

        this.props.userOrdersHistoryFetch({
            pageIndex: Number(pageIndex) + 1,
            type,
            limit: paginationLimit,
        });
    };

    private renderHeaders = () => {
        return (
            <div className='trade-orders-mobile__table__head'>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.date'})}</div>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.market'})}</div>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.side'})}</div>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.openOrders.header.orderType'})}</div>
                <div className='cells'>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.price'})}</div> 
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
        const { marketsData } = this.props;

        const thisMarket = marketsData.find(m => m.id === market)
            || { name: market, price_precision: 0, amount_precision: 0 };

        const orderType = this.getType(ord_type);
        const orderSide = this.getSide(side);
        const marketName = thisMarket ? thisMarket.name : market;
        const date = updated_at || created_at;
        const status = this.setOrderStatus(state);
        const actualPrice = this.getPrice(ord_type, status, avg_price, price);
        const executedVolume = Number(origin_volume) - Number(remaining_volume);
        const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
        
        return (
            <div key={id} className="trade-orders-mobile__order">
                <div className="order-block type">
                    <div className="cells" style={{ color: setTradeColor(side).color }}>{orderType}/{orderSide}</div>
                    <div className={`cells filling${+filled === 100 ? '' : ' full'}`}><Decimal fixed={2} thousSep=",">{+filled}</Decimal>%</div>
                </div>
                <div className="order-block">
                    <div className="cells name">
                        {marketName.toUpperCase()}
                    </div>
                    <div className="cells">
                        <span>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.amount'})}</span>
                        <div className='numbers'>{parseFloat(Number(origin_volume).toFixed(thisMarket.amount_precision))}</div>
                    </div>
                    <div className="cells">
                        <span>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.content.price'})}</span>
                        <div className='numbers'>
                            {ord_type === 'market' || status === 'done' ? 
                                <OverlayTrigger 
                                    placement="auto"
                                    delay={{ show: 250, hide: 300 }} 
                                    overlay={<Tooltip title="page.body.openOrders.header.avgPrice.tooltip.description" />}>
                                        <div className="dotted">{parseFloat(Number(actualPrice).toFixed(thisMarket.price_precision))}</div>
                                </OverlayTrigger> 
                            : parseFloat(Number(actualPrice).toFixed(thisMarket.price_precision))}
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

export const OrdersItem = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(OrdersItemComponent) as any; // tslint:disable-line
