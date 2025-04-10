/* tslint:disable */
import * as React from 'react';
import { FillSpinner } from "react-spinners-kit";
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
    formatWithSeparators,
    Order,
    OrderProps,
    Decimal,
} from '../../components';
import { FilterPrice } from '../../filters';
import { IntlProps } from '../../';
import {
    alertPush,
    MemberLevels,
    memberLevelsFetch,
    RootState,
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids,
    selectMemberLevels,
    selectMobileDeviceState,
    selectUserInfo,
    selectFeeGroup,
    feeGroupFetch,
    FeeGroup,
    selectMemberFees,
    memberFeesFetch,
    MemberFees,
    selectUserLoggedIn,
    selectWallets,
    setCurrentPrice,
    User,
    Wallet,
    walletsFetch,
} from '../../modules';
import {
    Market,
    selectCurrentMarket,
    selectCurrentMarketFilters,
    selectMarketTickers,
} from '../../modules/public/markets';
import {
    orderExecuteFetch,
    selectOrderExecuteLoading,
} from '../../modules/user/orders';

interface ReduxProps {
    currentMarket?: Market;
    currentMarketFilters: FilterPrice[];
    executeLoading: boolean;
    marketTickers: {
        [key: string]: {
            last: string;
        },
    };
    bids: string[][];
    asks: string[][];
    wallets: Wallet[];
    currentPrice?: number;
    isMobileDevice: boolean;
    memberLevels: MemberLevels;
    user: User;
    userLoggedIn: boolean;
    userFeeGroup: FeeGroup;
    userFeeMember: MemberFees[];
}

interface StoreProps {
    orderSide: string;
    priceLimit: number | null;
    width: number;
}

interface DispatchProps {
    walletsFetch: typeof walletsFetch;
    memberLevelsFetch: typeof memberLevelsFetch;
    setCurrentPrice: typeof setCurrentPrice;
    orderExecute: typeof orderExecuteFetch;
    pushAlert: typeof alertPush;
    feeGroupFetch: typeof feeGroupFetch;
    memberFeesFetch: typeof memberFeesFetch;
}

interface OwnProps {
    defaultTabIndex?: number;
}

type Props = ReduxProps & DispatchProps & OwnProps & IntlProps;

class OrderInsert extends React.PureComponent<Props, StoreProps> {
    
    constructor(props: Props) {
        super(props);

        this.state = {
            orderSide: 'buy',
            priceLimit: null,
            width: 0,
        };

        this.orderRef = React.createRef();
    }

    private orderRef;

    public componentDidMount() {
         
        if (!this.props.wallets.length) {
            this.props.walletsFetch();
        }

        if (!this.props.memberLevels) {
            this.props.memberLevelsFetch();
        }
        this.props.feeGroupFetch();
        this.props.memberFeesFetch();
    }

    public componentDidUpdate() {
        if (this.orderRef.current && this.state.width !== this.orderRef.current.clientWidth) {
            this.setState({
                width: this.orderRef.current.clientWidth,
            });
        }
    }

    public componentWillReceiveProps(next: Props) {
        const { userLoggedIn } = this.props;

        if (userLoggedIn && !next.wallets.length) {
            this.props.walletsFetch();
        }

        if (+next.currentPrice && next.currentPrice !== this.state.priceLimit) {
            this.setState({
                priceLimit: +next.currentPrice,
            });
        }
    }

    public getContent = () => {
        const {
            asks,
            bids,
            currentMarket,
            currentMarketFilters,
            defaultTabIndex,
            executeLoading,
            isMobileDevice,
            marketTickers,
            wallets,
            userLoggedIn,
            userFeeGroup,
            userFeeMember,
            //user,
            //memberLevels,
        } = this.props;
        const { priceLimit } = this.state;

        const walletBase = this.getWallet(currentMarket.base_unit, wallets);
        const walletQuote = this.getWallet(currentMarket.quote_unit, wallets);

        const currentTicker = marketTickers[currentMarket.id];
        const defaultCurrentTicker = { last: '0' };

        //const allowed = memberLevels && (user.level >= memberLevels.trading.minimum_level);

        const comission = this.feeCalculate(userFeeGroup, userFeeMember);
 
            return (
                <Order
                    asks={asks}
                    bids={bids}
                    disabled={executeLoading}
                    marketId={currentMarket.id}
                    from={currentMarket.quote_unit}
                    availableBase={this.getAvailableValue(walletBase)}
                    availableQuote={this.getAvailableValue(walletQuote)}
                    onSubmit={this.handleSubmit}
                    priceMarketBuy={Number((currentTicker || defaultCurrentTicker).last)}
                    priceMarketSell={Number((currentTicker || defaultCurrentTicker).last)}
                    priceLimit={priceLimit}
                    to={currentMarket.base_unit}
                    handleSendType={this.getOrderType}
                    currentMarketAskPrecision={currentMarket.amount_precision}
                    currentMarketBidPrecision={currentMarket.price_precision}
                    currentMarketMinPrice={currentMarket.min_price}
                    currentMarketMaxPrice={currentMarket.max_price}
                    currentMarketMinAmount={currentMarket.min_amount}
                    orderTypes={this.formattedOrderTypes()}
                    width={this.state.width}
                    listenInputPrice={this.listenInputPrice}
                    defaultTabIndex={defaultTabIndex}
                    currentMarketFilters={currentMarketFilters}
                    isMobileDevice={isMobileDevice}
                    translate={this.translate}
                    membersFeeMaker={comission?.maker}
                    membersFeeTaker={comission?.taker}
                    userLoggedIn={userLoggedIn}
                />
            );
    }
  
    private feeCalculate = (userFeeGroup: FeeGroup, userFeeMember: MemberFees[]) => {
        return userFeeMember?.find(item => item.group === userFeeGroup.group) as MemberFees;
    };

    public render() {
        const { 
            currentMarket, 
            executeLoading, 
         } = this.props;

        if (!currentMarket) {
            return null;
        }
        return (
            <div className={'make-orders'} ref={this.orderRef}>
                {this.getContent()}
                {executeLoading && <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div>}
            </div>
        ); 
    }

    private handleSubmit = (value: OrderProps) => {
        const { currentMarket } = this.props;

        if (!currentMarket) {
            return;
        }

        const {
            amount,
            available,
            orderType,
            price,
            type,
        } = value;

        this.props.setCurrentPrice(0);

        const withPrice = typeof price !== 'undefined';
        const actualOrderPrice = withPrice ? price : '';

        const resultData = {
            market: currentMarket.id,
            side: type,
            volume: amount.toString(),
            ord_type: (orderType as string).toLowerCase().replace('-', '_'),
            ...(withPrice && { price: price.toString() }),
        };

        let orderAllowed = true;

        if (+resultData.volume < +currentMarket.min_amount) {
            this.props.pushAlert({
                message: [this.translate(
                    'error.order.create.minAmount',
                    {
                        amount: Decimal.format(currentMarket.min_amount, currentMarket.amount_precision, ',' ),
                        currency: currentMarket.base_unit.toUpperCase(),
                    },
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (withPrice && +price < +currentMarket.min_price) {
            this.props.pushAlert({
                message: [this.translate(
                    'error.order.create.minPrice',
                    {
                        price: Decimal.format(currentMarket.min_price, currentMarket.price_precision, ','),
                        currency: currentMarket.quote_unit.toUpperCase(),
                    },
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (+currentMarket.max_price && withPrice && +price > +currentMarket.max_price) {
            this.props.pushAlert({
                message: [this.translate(
                    'error.order.create.maxPrice',
                    {
                        price: Decimal.format(currentMarket.max_price, currentMarket.price_precision, ','),
                        currency: currentMarket.quote_unit.toUpperCase(),
                    },
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if ((+available < (+amount * +actualOrderPrice) && resultData.side === 'buy') ||
            (+available < +amount && resultData.side === 'sell')) {
            this.props.pushAlert({
                message: [this.translate(
                    'error.order.create.available',
                    {
                        available: formatWithSeparators(String(available), ','),
                        currency: resultData.side === 'buy' ? (
                            currentMarket.quote_unit.toUpperCase()
                        ) : (
                            currentMarket.base_unit.toUpperCase()
                        ),
                    },
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (orderAllowed) {
            this.props.orderExecute(resultData);
        }
    };

    private getWallet(currency: string, wallets: Wallet[]) {
        const currencyLower = currency.toLowerCase();

        return wallets.find(w => w.currency === currencyLower) as Wallet;
    };

    private formattedOrderTypes = () => this.props.currentMarket?.features?.order_types.filter(ot => ot !== 'fok').map(ot => {
        const result = ot.substring(0, 1)?.toUpperCase() + ot.substring(1);
        return result.replace('_', '-');
    });

    private getOrderType = (index: number, label: string) => {
        this.setState({
            orderSide: label.toLowerCase(),
        });
    };

    private getAvailableValue(wallet?: Wallet) {
        return wallet && wallet.balance ? Number(wallet.balance) : 0;
    }

    private listenInputPrice = () => {
        this.setState({
            priceLimit: null,
        });
        this.props.setCurrentPrice(0);
    };

    private translate = (id: string, value?: any) => this.props.intl.formatMessage({ id }, { ...value });
}

const mapStateToProps = (state: RootState) => ({
    bids: selectDepthBids(state),
    asks: selectDepthAsks(state),
    currentMarket: selectCurrentMarket(state),
    currentMarketFilters: selectCurrentMarketFilters(state),
    executeLoading: selectOrderExecuteLoading(state),
    marketTickers: selectMarketTickers(state),
    wallets: selectWallets(state),
    currentPrice: selectCurrentPrice(state),
    userLoggedIn: selectUserLoggedIn(state),
    isMobileDevice: selectMobileDeviceState(state),
    memberLevels: selectMemberLevels(state),
    user: selectUserInfo(state),
    userFeeGroup: selectFeeGroup(state),
    userFeeMember: selectMemberFees(state),
});

const mapDispatchToProps = dispatch => ({
    walletsFetch: () => dispatch(walletsFetch()),
    memberLevelsFetch: () => dispatch(memberLevelsFetch()),
    orderExecute: payload => dispatch(orderExecuteFetch(payload)),
    pushAlert: payload => dispatch(alertPush(payload)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    feeGroupFetch: () => dispatch(feeGroupFetch()),
    memberFeesFetch: () => dispatch(memberFeesFetch(),)
});

// tslint:disable-next-line no-any
const OrderComponent = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderInsert as any)) as any;

export {
    OrderComponent,
};
