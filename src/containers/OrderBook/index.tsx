import classNames from 'classnames';
import * as React from 'react';
import _ from 'lodash';
import { FillSpinner } from "react-spinners-kit";
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { IntlProps } from '../../';
import { CombinedOrderBook, Decimal } from '../../components';
import { colors } from '../../constants';
import { accumulateVolume, calcMaxVolume, sortBids, sortAsks } from '../../helpers';
import { ArrowOrderNegative } from '../../assets/images/ArrowOrderNegative';
import { ArrowOrderPositive } from '../../assets/images/ArrowOrderPositive';
import {
    Market,
    PublicTrade,
    RootState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids,
    selectDepthLoading,
    selectLastRecentTrade,
    selectMarketTickers,
    selectMobileDeviceState,
    selectOpenOrdersList,
    setCurrentPrice,
    depthIncrementSubscribeResetLoading,
    Ticker,
} from '../../modules';
import { OrderCommon } from '../../modules/types';

interface ReduxProps {
    asks: string[][];
    bids: string[][];
    colorTheme: string;
    currentMarket?: Market;
    currentPrice?: number;
    lastRecentTrade?: PublicTrade;
    openOrdersList: OrderCommon[];
    orderBookLoading: boolean;
    isMobileDevice: boolean;
}

interface DispatchProps {
    setCurrentPrice: typeof setCurrentPrice;
    depthIncrementSubscribeResetLoading: typeof depthIncrementSubscribeResetLoading;
}

interface State {
    width: number;
}

interface OwnProps {
    marketTickers: {
        [key: string]: Ticker;
    };
    forceLarge?: boolean;
    size: number;
}

type Props = ReduxProps & DispatchProps & OwnProps & IntlProps;

// render big/small breakpoint
const breakpoint = 634;

class OrderBookContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            width: 0,
        };

        this.orderRef = React.createRef();
    }

    private orderRef;

    public componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    public componentDidUpdate(prevProps: Props) {
        this.handleResize();

        if (!prevProps.orderBookLoading && this.props.orderBookLoading) {
            setTimeout(() => {
                if (this.props.orderBookLoading) {
                    this.props.depthIncrementSubscribeResetLoading();
                }
            }, 5000);
        }
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    public shouldComponentUpdate(nextProps: Props) {
        const {
            asks,
            bids,
            currentMarket,
            marketTickers,
            orderBookLoading,
            openOrdersList,
        } = this.props;
        const { width } = this.state;
        const defaultTicker = {
            last: 0,
            price_change_percent: '+0.00%',
        };

        const currentMarketTicker = currentMarket && marketTickers ? marketTickers[currentMarket.id] : defaultTicker;
        const nextCurrentMarketTicker = currentMarket && nextProps.marketTickers ? nextProps.marketTickers[currentMarket.id] : defaultTicker;

        return (
            !_.isEqual(nextProps.asks, asks) ||
            !_.isEqual(nextProps.bids, bids) ||
            (nextProps.currentMarket && nextProps.currentMarket.id) !== (currentMarket && currentMarket.id) ||
            (this.orderRef.current && this.orderRef.current.clientWidth !== width) ||
            !_.isEqual(currentMarketTicker, nextCurrentMarketTicker) ||
            (orderBookLoading !== nextProps.orderBookLoading) ||
            !_.isEqual(nextProps.openOrdersList, openOrdersList)
        );
    }

    public render() {
        const { asks, bids, forceLarge, orderBookLoading } = this.props;
        const isLarge = forceLarge || (this.state.width > breakpoint);

        const cn = classNames('order-book-container ', {
            'order-book-container--data-loading': orderBookLoading,
            'order-book-container--no-data-first': (!asks.length && !isLarge) || (!bids.length && isLarge),
            'order-book-container--no-data-second': (!bids.length && !isLarge) || (!asks.length && isLarge),
        });

        return (
            <div className={cn} ref={this.orderRef}>
                {orderBookLoading ? (
                    <div className="order-book-container__loader">
                        <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div>
                    </div>
                ) : this.orderBook(sortBids(bids), sortAsks(asks), isLarge)}
            </div>
        );
    }

    private orderBook = (bids, asks, isLarge: boolean) => {
        const { colorTheme, currentMarket } = this.props;
        const asksData = isLarge ? asks : asks.slice(0).reverse();

        return (
            <CombinedOrderBook
                maxVolume={calcMaxVolume(bids, asks)}
                orderBookEntryAsks={accumulateVolume(asks)}
                orderBookEntryBids={accumulateVolume(bids)}
                rowBackgroundColorAsks={colors[colorTheme]?.orderBook.asks}
                rowBackgroundColorBids={colors[colorTheme]?.orderBook.bids}
                dataAsks={this.renderOrderBook(asksData, 'asks', '', isLarge, currentMarket)}
                dataBids={this.renderOrderBook(bids, 'bids', '', isLarge, currentMarket)}
                headers={this.renderHeaders()}
                lastPrice={this.lastPrice()}
                onSelectAsks={this.handleOnSelectAsks}
                onSelectBids={this.handleOnSelectBids}
                isLarge={isLarge}
                noDataAsks={!asksData.length ? true : false}
                noDataBids={!bids.length ? true : false}
                noDataMessage={this.props.intl.formatMessage({id: 'page.noDataToShow.orderbook'})}
                bestAsk={this.bestOBPrice(asks)}
                bestBid={this.bestOBPrice(bids)}
            />
        );
    };

    private bestOBPrice = (list: string[][]) => list[0] && list[0][0];

    public lastPrice() {
        const { 
            currentMarket, 
            lastRecentTrade, 
            marketTickers 
        } = this.props;

        if (currentMarket) {
            let lastPrice = '';
            let priceChangeSign: '' | 'positive' | 'negative' = '';

            if (lastRecentTrade?.market === currentMarket.id) {
                lastPrice = lastRecentTrade.price;

                if (Number(lastRecentTrade.price_change) >= 0) {
                    priceChangeSign = 'positive';
                } else if (Number(lastRecentTrade.price_change) < 0) {
                    priceChangeSign = 'negative';
                }
            } else {
                const currentTicker = currentMarket && this.getTickerValue(currentMarket, marketTickers);
                lastPrice = currentTicker.last;


                if (currentTicker.price_change_percent.includes('+')) {
                    priceChangeSign = 'positive';
                } else if (currentTicker.price_change_percent.includes('-')) {
                    priceChangeSign = 'negative';
                }
            }

            const cn = classNames('', {
                'negative': priceChangeSign === 'negative',
                'positive': priceChangeSign === 'positive',
            });

            return (
                <React.Fragment>
                    <div className={cn}>
                        <span>{Decimal.format(lastPrice, currentMarket.price_precision, ',')}
                            <div className='icon-order'>{priceChangeSign === 'negative' ? <ArrowOrderNegative /> : <ArrowOrderPositive />}</div>
                        </span>
                    </div>
                </React.Fragment>
            );
        } else {
            return (
                <div className="negative">
                    <span>-.--</span>
                </div>
            );
        }
    }

    private renderHeaders = () => {
        const { currentMarket, intl, isMobileDevice } = this.props;
        const formattedBaseUnit = (currentMarket && currentMarket.base_unit) ? `(${currentMarket.base_unit.toUpperCase()})` : '';
        const formattedQuoteUnit = (currentMarket && currentMarket.quote_unit) ? `(${currentMarket.quote_unit.toUpperCase()})` : '';

        if (isMobileDevice) {
            return [
                `${intl.formatMessage({id: 'page.body.trade.orderbook.header.price'})}\n${formattedQuoteUnit}`,
                `${intl.formatMessage({id: 'page.body.trade.orderbook.header.amount'})}\n${formattedQuoteUnit}`,
            ];
        }

        return [
            `${intl.formatMessage({id: 'page.body.trade.orderbook.header.price'})}\n${formattedQuoteUnit}`,
            `${intl.formatMessage({id: 'page.body.trade.orderbook.header.amount'})}\n${formattedBaseUnit}`,
            `${intl.formatMessage({id: 'page.body.trade.orderbook.header.volume'})}\n${formattedQuoteUnit}`,
        ];
    };

    private renderOrderBook = (array: string[][], side: string, message: string, isLarge: boolean, currentMarket?: Market) => {
        const { isMobileDevice } = this.props;
        //let total = accumulateVolume(array);
        const priceFixed = currentMarket ? currentMarket.price_precision : 0;
        const amountFixed = currentMarket ? currentMarket.amount_precision : 0;

        if (isMobileDevice) {
            return this.getOrderBookData(isLarge, side, array, priceFixed, amountFixed, message);
        }

        return array.length ? array.map((item, i) => {
            const [price, volume] = item;
            const totalAmount = Number(volume) * Number(price);

            switch (side) {
                case 'asks':
                    //total = isLarge ? accumulateVolume(array) : accumulateVolume(array.slice(0).reverse()).slice(0).reverse();

                    return [
                        (<div className="sell_price" key={i}>{Decimal.format(price, priceFixed, ',')}</div>),
                        (<div key={i}>{Decimal.format(volume, amountFixed, ',')}</div>),
                        (<div key={i}>{Decimal.format(totalAmount, priceFixed, ',')}</div>),
                    ];
                default:
                    if (isLarge) {
                        return [
                            (<div key={i}>{Decimal.format(totalAmount, priceFixed, ',')}</div>),
                            (<div key={i}>{Decimal.format(volume, amountFixed, ',')}</div>),
                            (<div key={i}>{Decimal.format(price, priceFixed, ',')}</div>),
                        ];
                    } else {
                        return [
                            (<div className="buy_price" key={i}>{Decimal.format(price, priceFixed, ',')}</div>),
                            (<div key={i}>{Decimal.format(volume, amountFixed, ',')}</div>),
                            (<div key={i}>{Decimal.format(totalAmount, priceFixed, ',')}</div>),
                        ];
                    }
            }
        }) : [[[''], message]];
    };

    private getOrderBookData = (isLarge, side, array, priceFixed, amountFixed, message) => {
        return array.length ? array.map((item, i) => {
            const [price, volume] = item;
            const totalAmount = Number(volume) * Number(price);

            switch (side) {
                case 'asks':
                    //total = isLarge ? accumulateVolume(array) : accumulateVolume(array.slice(0).reverse()).slice(0).reverse();

                    return [
                        (<div className="sell_price" key={i}>{Decimal.format(price, priceFixed, ',')}</div>),
                        (<div key={i}>{Decimal.format(totalAmount, priceFixed, ',')}</div>),
                    ];
                default:
                    if (isLarge) {
                        return [
                            (<div key={i}>{Decimal.format(totalAmount, priceFixed, ',')}</div>),
                            (<div key={i}>{Decimal.format(price, priceFixed, ',')}</div>),
                        ];
                    } else {
                        return [
                            (<div key={i}>{Decimal.format(price, priceFixed, ',')}</div>),
                            (<div className="buy_price" key={i}>{Decimal.format(totalAmount, priceFixed, ',')}</div>),
                        ];
                    }
            }
        }) : [[[''], message]];
    };

    private handleOnSelectBids = (index: string) => {
        const { currentPrice, bids } = this.props;
        const priceToSet = bids[Number(index)] && Number(bids[Number(index)][0]);

        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };

    private handleOnSelectAsks = (index: string) => {
        const { asks, currentPrice, forceLarge } = this.props;
        const isLarge = forceLarge || this.state.width >= breakpoint;
        const asksData = isLarge ? asks : asks.slice(0).reverse();
        const priceToSet = asksData[Number(index)] && Number(asksData[Number(index)][0]);

        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };

    private getTickerValue = (currentMarket: Market, tickers: { [key: string]: Ticker }) => {
        const defaultTicker = { amount: '0', low: '0', last: '0', high: '0', volume: '0', open: '0', price_change_percent: '+0.00%' };

        return tickers[currentMarket.id] || defaultTicker;
    };

    private handleResize = () => {
        if (this.orderRef.current && this.state.width !== this.orderRef.current.clientWidth) {
            this.setState({
                width: this.orderRef.current.clientWidth,
            });
        }
    };
}

const mapStateToProps = (state: RootState) => ({
    bids: selectDepthBids(state),
    asks: selectDepthAsks(state),
    colorTheme: selectCurrentColorTheme(state),
    orderBookLoading: selectDepthLoading(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
    lastRecentTrade: selectLastRecentTrade(state),
    marketTickers: selectMarketTickers(state),
    openOrdersList: selectOpenOrdersList(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
        depthIncrementSubscribeResetLoading: () => dispatch(depthIncrementSubscribeResetLoading()),
    });

export const OrderBook = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer)) as any;
export type OrderBookProps = ReduxProps;
