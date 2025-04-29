import * as React from 'react';
import DecimalJS from 'decimal.js';
import { Decimal, OrderForm } from '../';
import { OrderFormExtended } from 'src/components/OrderForm/OrderFormExtended';
import { OrderPanel } from './OrderPanel';
import { OrderPanelEtended } from './OrderPanelEtended';
import { FilterPrice } from '../../filters';
import { getAmount, getTotalPrice } from '../../helpers';

export type FormType = 'buy' | 'sell';

export type RowOrderElement = number | string | React.ReactNode;

export interface OrderProps {
    type: FormType;
    orderType: string | React.ReactNode;
    price: number | string;
    amount: number | string;
    available: number;
}

export type OnSubmitCallback = (order: OrderProps) => void;

export interface OrderComponentProps {
    /**
     * Amount of money in base currency wallet
     */
    availableBase: number;
    /**
     * Amount of money in quote currency wallet
     */
    availableQuote: number;
    /**
     * Callback which is called when a form is submitted
     */
    onSubmit: OnSubmitCallback;
    /**
     * If orderType is 'Market' this value will be used as price for buy tab
     */
    priceMarketBuy: number;
    /**
     * If orderType is 'Market' this value will be used as price for sell tab
     */
    priceMarketSell: number;
    /**
     * If orderType is 'Limit' this value will be used as price
     */
    priceLimit?: number;
    /**
     * Current market id
     */
    marketId: string;
    /**
     * Name of currency for price field
     */
    from: string;
    /**
     * Name of currency for amount field
     */
    to: string;
    /**
     * Whether order is disabled to execute
     */
    disabled?: boolean;
    handleSendType?: (index: number, label: string) => void;
    /**
     * Index of tab to switch on
     */
    /**
     * Precision of amount, total, available, fee value
     */
    currentMarketAskPrecision: number;
    currentMarketMinPrice: string;
    currentMarketMaxPrice: string;
    currentMarketMinAmount: string;

    membersFeeMaker: string;
    membersFeeTaker: string;
    /**
     * Precision of price value
     */
    currentMarketBidPrecision: number;
    orderTypes?: RowOrderElement[];
    orderTypesIndex?: RowOrderElement[];
    /**
     *
     */
    width?: number;
    /**
     * proposals for buy
     */
    bids: string[][];
    /**
     * proposals for sell
     */
    asks: string[][];
    /**
     * start handling change price
     */
    listenInputPrice?: () => void;
    /**
     * default tab index
     */
    defaultTabIndex?: number;
    isMobileDevice?: boolean;
    currentMarketFilters: FilterPrice[];
    translate: (id: string, value?: any) => string;
    userLoggedIn: boolean;
}

interface State {
    index: number;
    amountSell: string;
    amountBuy: string;
}

const defaultOrderTypes: RowOrderElement[] = [
    'Limit',
    'Market',
    /*'Stop-limit',
    'Take-profit',
    'Stop-loss',
    'Take-limit',*/
];

const splitBorder = 449;
const defaultWidth = 635;

export class Order extends React.Component<OrderComponentProps, State> {
    public state = {
        index: 0,
        amountSell: '',
        amountBuy: '',
    };

    // public componentWillReceiveProps(nextProps) {
        // const { defaultTabIndex } = this.props;

        // if (defaultTabIndex !== undefined) {
            // this.handleChangeTab(nextProps.defaultTabIndex);
        // }
    // }

    public componentDidMount() {
        const { defaultTabIndex } = this.props;

        if (defaultTabIndex !== undefined) {
            this.handleChangeTab(defaultTabIndex);
        }
    }

    public render() {
        const {
            width = defaultWidth,
        } = this.props;

        if (width < splitBorder) {
            return (
                <div className="make-order__wrapper">
                    <OrderPanel
                        panels={this.getPanels()}
                        onTabChange={this.handleChangeTab}
                        currentTabIndex={this.state.index}
                    /> 
                </div>
            );
        }

        return (
            <div className="make-order__wrapper make-order__wrapper--extended">
                <OrderPanelEtended
                    panels={this.getPanels()}
                />
            </div>
        );
    }

    public getPanel = (type: FormType) => {
        const {
            marketId,
            availableBase,
            availableQuote,
            disabled,
            priceMarketBuy,
            priceMarketSell,
            priceLimit,
            from,
            to,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            currentMarketMinPrice,
            currentMarketMaxPrice,
            currentMarketMinAmount,
            asks,
            bids,
            currentMarketFilters,
            isMobileDevice,
            listenInputPrice,
            translate,
            orderTypes,
            orderTypesIndex,
            membersFeeMaker,
            membersFeeTaker,
            userLoggedIn,
            width = defaultWidth,
        } = this.props;
        
        const { amountSell, amountBuy } = this.state;

        const proposals = this.isTypeSell(type) ? bids : asks;
        const available = this.isTypeSell(type) ? availableBase : availableQuote;
        const priceMarket = this.isTypeSell(type) ? priceMarketSell : priceMarketBuy;
        const disabledData = this.isTypeSell(type) ? {} : { disabled };
        const amount = this.isTypeSell(type) ? amountSell : amountBuy;
        const preLabel = this.isTypeSell(type) ? (
            translate('page.body.trade.header.newOrder.content.tabs.sell')
        ) : (
            translate('page.body.trade.header.newOrder.content.tabs.buy')
        );
        const marketName = to.toUpperCase();

        const label = this.isTypeSell(type) ? 'Sell' : 'Buy';
        if (width < splitBorder) {
            return {
                content: (
                    <OrderForm
                        marketId={marketId}
                        type={type}
                        from={from}
                        {...disabledData}
                        to={to}
                        available={available}
                        priceMarket={priceMarket}
                        priceLimit={priceLimit}
                        onSubmit={this.props.onSubmit}
                        orderTypes={orderTypes || defaultOrderTypes}
                        orderTypesIndex={orderTypesIndex || defaultOrderTypes}
                        currentMarketAskPrecision={currentMarketAskPrecision}
                        currentMarketBidPrecision={currentMarketBidPrecision}
                        currentMarketMinPrice={currentMarketMinPrice}
                        currentMarketMaxPrice={currentMarketMaxPrice}
                        currentMarketMinAmount={currentMarketMinAmount}
                        totalPrice={getTotalPrice(amount, priceMarket, proposals)}
                        amount={amount}
                        bestAsk={this.bestOBPrice(asks)}
                        bestBid={this.bestOBPrice(bids)}
                        listenInputPrice={listenInputPrice}
                        handleAmountChange={this.handleAmountChange}
                        handleTotalChange={this.handleTotalChange}
                        handleChangeAmountByButton={this.handleChangeAmountByButton}
                        currentMarketFilters={currentMarketFilters}
                        isMobileDevice={isMobileDevice}
                        translate={translate}
                        membersFeeMaker={membersFeeMaker}
                        membersFeeTaker={membersFeeTaker}
                        userLoggedIn={userLoggedIn}
                    />
                ),
                label: preLabel || label,
                marketName: marketName,
            };
        }
        return {
            content: (
                <OrderFormExtended
                    marketId={marketId}
                    type={type}
                    from={from}
                    {...disabledData}
                    to={to}
                    available={available}
                    priceMarket={priceMarket}
                    priceLimit={priceLimit}
                    onSubmit={this.props.onSubmit}
                    orderTypes={orderTypes || defaultOrderTypes}
                    orderTypesIndex={orderTypesIndex || defaultOrderTypes}
                    currentMarketAskPrecision={currentMarketAskPrecision}
                    currentMarketBidPrecision={currentMarketBidPrecision}
                    currentMarketMinPrice={currentMarketMinPrice}
                    currentMarketMaxPrice={currentMarketMaxPrice}
                    currentMarketMinAmount={currentMarketMinAmount}
                    totalPrice={getTotalPrice(amount, priceMarket, proposals)}
                    amount={amount}
                    bestAsk={this.bestOBPrice(asks)}
                    bestBid={this.bestOBPrice(bids)}
                    listenInputPrice={listenInputPrice}
                    handleAmountChange={this.handleAmountChange}
                    handleTotalChange={this.handleTotalChange}
                    handleChangeAmountByButton={this.handleChangeAmountByButton}
                    currentMarketFilters={currentMarketFilters}
                    isMobileDevice={isMobileDevice}
                    translate={translate}
                    membersFeeMaker={membersFeeMaker}
                    membersFeeTaker={membersFeeTaker}
                    userLoggedIn={userLoggedIn}
                />
            ),
            label: null,
        };
    };

    /*private getOrderTypes = () => {
         const { orderTypes } = this.props;

        if (orderTypes && orderTypes.length) {
            return orderTypes.sort((a, b) => defaultOrderTypes.indexOf(a) < defaultOrderTypes.indexOf(b) ? -1 : 1);
        } 

        return defaultOrderTypes;
    };*/

    private getPanels = () => {
        return [this.getPanel('buy'), this.getPanel('sell')];
    };

    private handleChangeTab = (index: number, label?: string) => {
        if (this.props.handleSendType && label) {
          this.props.handleSendType(index, label);
        }

        this.setState({
            index: index,
        });
    };

    private handleAmountChange = (amount, type) => {
        if (type === 'sell') {
            this.setState({ amountSell: amount });
        } else {
            this.setState({ amountBuy: amount });
        }
    };

    private handleTotalChange = (total, price, type) => {
        if(type === 'sell') {
            this.setState({ amountSell: new DecimalJS(Number(total)).div(Number(price)).toString() });
        } else {
            this.setState({ amountBuy: new DecimalJS(Number(total)).div(Number(price)).toString() });
        }
    }

    private handleChangeAmountByButton = (value, orderType, price, type) => {
        const { bids, asks, availableBase, availableQuote } = this.props;
        const proposals = this.isTypeSell(type) ? bids : asks;
        const available = this.isTypeSell(type) ? availableBase : availableQuote;
        let newAmount = '';

        switch (type) {
            case 'buy':
                switch (orderType) {
                    case 'Market':
                        newAmount = available ? (
                            Decimal.format(getAmount(Number(available), proposals, value), this.props.currentMarketAskPrecision)
                        ) : '';

                        break;
                    default:
                        newAmount = available && +price ? (
                            Decimal.format(available / +price * value, this.props.currentMarketAskPrecision)
                        ) : '';

                        break;
                }
                break;
            case 'sell':
                newAmount = available ? (
                    Decimal.format(available * value, this.props.currentMarketAskPrecision)
                ) : '';

                break;
            default:
                break;
        }

        if (type === 'sell') {
            this.setState({ amountSell: newAmount });
        } else {
            this.setState({ amountBuy: newAmount });
        }
    };

    private isTypeSell = (type: string) => type === 'sell';

    private bestOBPrice = (list: string[][]) => list[0] && list[0][0];
}
