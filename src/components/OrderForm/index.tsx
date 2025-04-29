import classnames from 'classnames';
import * as React from 'react';
import DecimalJS from 'decimal.js';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom'; 
import { DepositPlusIcon } from "src/assets/images/DepositPlusIcon";
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip } from '../../components';
import {
    FilterPrice,
    PriceValidation,
    validatePriceStep,
} from '../../filters';
import {
    AMOUNT_PERCENTAGE_ARRAY,
    SET_MAXIMUM_AMOUNT_ARRAY,
} from '../../constants';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';
import { OrderInput as OrderInputMobile } from '../../mobile/components';
import { Decimal } from '../Decimal';
import { OrderRowMenu } from './OrderRowMenu';
import { OrderProps } from '../Order';
import { OrderInput } from '../OrderInput';
import { PercentageSlider } from '../PercentageSlider';
import { PercentageButton } from '../PercentageButton';

type OnSubmitCallback = (order: OrderProps) => void;
type RowOrderElement = number | string | React.ReactNode;
type FormType = 'buy' | 'sell';

export interface OrderFormProps {
    priceMarket: number;
    priceLimit?: number;
    type: FormType;
    orderTypes?: RowOrderElement[];
    orderTypesIndex: RowOrderElement[];
    className?: string;
    marketId: string;
    from: string;
    to: string;
    available?: number;
    currentMarketAskPrecision: number;
    currentMarketMinPrice: string;
    currentMarketMaxPrice: string;
    currentMarketMinAmount: string;
    membersFeeMaker: string;
    membersFeeTaker: string;
    currentMarketBidPrecision: number;
    bestAsk?: string;
    bestBid?: string;
    disabled?: boolean;
    onSubmit: OnSubmitCallback;
    /**
     * start handling change price
     */
    listenInputPrice?: () => void;
    totalPrice: number;
    amount: string;
    isMobileDevice?: boolean;
    currentMarketFilters: FilterPrice[];
    handleAmountChange: (amount: string, type: FormType) => void;
    handleTotalChange: (total: string, price: string, type: FormType) => void;
    handleChangeAmountByButton: (value: number, orderType: string | React.ReactNode, price: string, type: string) => void;
    translate: (id: string, value?: any) => string;
    userLoggedIn: boolean;
}

interface OrderFormState {
    orderType: string | React.ReactNode;
    price: string;
    priceMarket: number;
    isPriceValid: PriceValidation;
    amountFocused: boolean;
    totalFocused: boolean;
    priceFocused: boolean;
    side: string;
    index: number;
    sliderValue: number;
}

const handleSetValue = (value: string | number | undefined, defaultValue: string) => (
    value || defaultValue
);

export class OrderForm extends React.PureComponent<OrderFormProps, OrderFormState> {

    constructor(props: OrderFormProps) {
        super(props);
        this.state = {
            side: this.props.type,
            index: 0,
            orderType: 'Limit',
            price: '',
            priceMarket: this.props.priceMarket,
            isPriceValid: {
                valid: true,
                priceStep: 0,
            },
            priceFocused: false,
            amountFocused: false,
            totalFocused: false,
            sliderValue: AMOUNT_PERCENTAGE_ARRAY[0],
        };
        
        this.handleChangeAmountByButton = this.handleChangeAmountByButton.bind(this);
    }

    public componentWillReceiveProps(next: OrderFormProps) {
        const nextPriceLimitTruncated = Decimal.format(next.priceLimit, this.props.currentMarketBidPrecision);

        if ((this.state.orderType as string).toLowerCase().includes('limit') && next.priceLimit && nextPriceLimitTruncated !== this.state.price) {
            this.handlePriceChange(nextPriceLimitTruncated);
        }

        if (this.state.priceMarket !== next.priceMarket) {
            this.setState({
                priceMarket: next.priceMarket,
            });
        }

        if (this.props.to !== next.to || this.props.from !== next.from) {
            this.setState({ price: ''});
            this.props.handleAmountChange('', next.type);
        }

        if (this.props.marketId !== next.marketId) {
            this.setState({
                orderType: 'Limit',
                index: 0,
            });
        }
    }

    public renderPrice = () => {
        const { price, priceFocused, isPriceValid } = this.state;
        const { from, isMobileDevice, currentMarketBidPrecision, translate, currentMarketMinPrice } = this.props;

        const finalPrice = parseFloat(Number(price).toFixed(currentMarketBidPrecision)); 
         
        const priceText = translate('page.body.trade.header.newOrder.content.price');
        const priceErrorClass = (priceFocused || isMobileDevice) && !isPriceValid.valid;

        return (
            <div className='make-order-form__field'>
                {isMobileDevice ? (
                    <OrderInputMobile
                        className={Number(price) !== 0 && Number(price) < Number(currentMarketMinPrice) ? 'iserrored' : ''}
                        currency={from}
                        fixedLabel={priceText}
                        placeholder={`${this.props.translate('page.body.trade.header.newOrder.content.minimum')} ${currentMarketMinPrice}`}
                        value={finalPrice || ''}
                        isFocused={priceFocused}
                        isWrong={!isPriceValid.valid}
                        precision={currentMarketBidPrecision}
                        handleChangeValue={this.handlePriceChange}
                        handleFocusInput={this.handleFieldFocus}
                    />
                ) : (
                    <OrderInput
                        className={Number(price) !== 0 && Number(price) < Number(currentMarketMinPrice) ? 'iserrored' : ''}
                        currency={from}
                        label={priceText}
                        placeholder={`≥ ${currentMarketMinPrice}`}
                        value={finalPrice || ''}
                        isFocused={priceFocused}
                        isWrong={!isPriceValid.valid}
                        handleChangeValue={this.handlePriceChange}
                        handleFocusInput={this.handleFieldFocus}
                    />
                )}
                {priceErrorClass && 
                    <div className="error-message error-message--visible">
                        {translate('page.body.trade.header.newOrder.content.filterPrice', { priceStep: isPriceValid.priceStep })}
                    </div>}
            </div>
        );
    }

    public getPriceInputs = () => {
        const { orderType, priceMarket } = this.state;
        const { from, totalPrice, amount, currentMarketBidPrecision, translate } = this.props;

        switch (orderType) {
            case 'Limit':
                return this.renderPrice();
            case 'Market':
                const safePrices = new DecimalJS(Number(amount)).toString();

                const safePrice = totalPrice / Number(safePrices) || priceMarket;
                const priceText = translate('page.body.trade.header.newOrder.content.price');

                return (
                    <div className="make-order-form__field">
                        <div className="orders-type-field">
                        <label className="relate">{priceText}</label>
                            <fieldset className="make-order-form__field__market-order">
                                <div className="market-order__price">
                                    {handleSetValue(Decimal.format(safePrice, currentMarketBidPrecision), '0.00')}
                                </div>
                                <div className="market-order__coin-name">
                                    {from.toUpperCase()}
                                </div>
                            </fieldset>
                        </div>
                    </div>
                );
            default:
                break;
        }
    }

    public getTotalAvalaible = () => {
        const { orderType, price } = this.state;
        const {
            to,
            from,
            totalPrice,
            amount,
            translate,
            type,
            available,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
        } = this.props;

        switch (orderType) {
            case 'Limit':
                const totalAvailBuy = (Number(available) / Number(price)).toFixed(currentMarketAskPrecision);
                const totalAvailSell = (Number(available) * Number(price)).toFixed(currentMarketBidPrecision);
                return (
                    <div className="make-order-form__datas">
                        <OverlayTrigger 
                            placement="auto"
                            delay={{ show: 250, hide: 300 }} 
                            overlay={<Tooltip className="themes" title="page.body.trade.header.newOrder.content.total.tooltip" />}>
                                <div className="name dotted">{translate(`page.body.trade.header.newOrder.content.total.${type}`)}</div>
                        </OverlayTrigger>
                        <div className="datas">
                            {type === 'buy' ? 
                                totalAvailBuy == "NaN" || totalAvailBuy == "Infinity" ? '-.--' : Decimal.format(totalAvailBuy, currentMarketAskPrecision, ',') : 
                                totalAvailSell == "NaN" || totalAvailSell == "Infinity" || totalAvailSell == Decimal.format(0, currentMarketBidPrecision, ',') ? '-.--' : Decimal.format(totalAvailSell, currentMarketBidPrecision, ',')
                            }
                            <span>{type === 'buy' ? to.toUpperCase() : from.toUpperCase()}</span>
                        </div>
                    </div>
                );
            case 'Market':
                const safePrices = new DecimalJS(Number(amount)).toString();
                const safePrice = totalPrice / Number(safePrices);
                const safeTotalPriceBuy = (safePrice * Number(safePrices)).toFixed(currentMarketAskPrecision);
                const safeTotalPriceSell = (safePrice * Number(safePrices)).toFixed(currentMarketBidPrecision);

                return (
                    <div className="make-order-form__datas">
                        <div className="name">
                            {translate('page.body.trade.header.newOrder.content.total.get')}
                        </div>
                        <div className="datas">
                            {type === 'buy' ? 
                                safeTotalPriceBuy == "NaN" || safeTotalPriceBuy == "Infinity" ? '-.--' : Decimal.format(safeTotalPriceBuy, currentMarketAskPrecision, ',') : 
                                safeTotalPriceSell == "NaN" || safeTotalPriceSell == "Infinity" ? '-.--' : Decimal.format(safeTotalPriceSell, currentMarketBidPrecision, ',')
                            }
                            <span>{type === 'buy' ? to.toUpperCase() : from.toUpperCase()}</span>
                        </div>
                    </div>
                );
            default:
                break;
        }
    }
    
    
    public getTotal = () => {
        const { orderType, price } = this.state;
        const { totalPrice, amount, currentMarketBidPrecision } = this.props;
        const safeAmount = Number(amount) || 0;
        const mathResult = new DecimalJS(safeAmount).times((Number(price) || 0));
        const finalTotal = parseFloat(mathResult.toFixed(currentMarketBidPrecision)); 

        if (orderType === 'Market') {
            return totalPrice;
        } else if ((orderType as string).toLowerCase().includes('limit')) {
            return Number(finalTotal);
        }
    }

    public render() {
        const {
            type,
            from,
            to,
            available,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            currentMarketMinAmount,
            amount,
            isMobileDevice,
            translate,
            membersFeeMaker,
            membersFeeTaker,
            currentMarketMinPrice,
            userLoggedIn
        } = this.props;
        const { amountFocused, totalFocused, orderType } = this.state;

        const total = this.getTotal();
        const finalAmount = parseFloat(Number(amount).toFixed(currentMarketAskPrecision)); 

        const feesTotalMaker = this.calculateFeeAmount(Number(total), Number(membersFeeMaker));
        const feesTotalTaker = this.calculateFeeAmount(Number(total), Number(membersFeeTaker));

        const availablePrecision = type === 'buy' ? currentMarketBidPrecision : currentMarketAskPrecision;
        const availableCurrency = type === 'buy' ? from : to;

        const amountText = this.props.translate('page.body.trade.header.newOrder.content.amount');
        const totalText = this.props.translate('page.body.trade.header.newOrder.content.total');
        const submitButtonText = translate(`page.body.trade.header.newOrder.content.tabs.${type}`);

        const buyInputAmountError = Number(amount) !== 0 && 
            Number(amount) < Number(currentMarketMinAmount) || orderType === 'Market' && (Number(amount) > Number(available)) ? 'iserrored' : '';

        const sellInputAmountError = Number(amount) !== 0 && 
            Number(amount) < Number(currentMarketMinAmount) || Number(amount) > Number(available) ? 'iserrored' : '';

        const inputAmountError = type === 'buy' ? buyInputAmountError : sellInputAmountError;

        const buyInputTotalError = Number(total) !== 0 && 
            Number(total) < Number(new DecimalJS(Number(currentMarketMinAmount)).times(Number(currentMarketMinPrice)).toString()) 
            || Number(amount) > Number(available) ? 'iserrored' : '';

        const sellInputTotalError = Number(total) !== 0 && 
            Number(total) < Number(new DecimalJS(Number(currentMarketMinAmount)).times(Number(currentMarketMinPrice)).toString()) ? 'iserrored' : '';

        const inputTotalError = type === 'buy' ? buyInputTotalError : sellInputTotalError;

        const typeClass = classnames({
            'buy-type': type === 'buy',
            'sell-type': type === 'sell',
        });

        const amountErrorClassSell = Number(amount) > Number(available);
        const totalErrorClassBuy = Number(total) > Number(available);
 
        return (
            <div className={classnames('make-order-form', typeClass)} onKeyPress={this.handleEnterPress}>
                <OrderRowMenu
                    panels={this.renderTabs()}
                    onTabChange={this.handleOrderTypeChange}
                    currentTabIndex={this.state.index}
                    borders={true}
                />
                {this.getPriceInputs()}
                <div className='make-order-form__field'>
                    {isMobileDevice ? (
                        <OrderInputMobile
                            className={inputAmountError}
                            fixedLabel={amountText}
                            placeholder={`${this.props.translate('page.body.trade.header.newOrder.content.minimum')} ${currentMarketMinAmount}`}
                            value={finalAmount || ''}
                            isFocused={amountFocused}
                            precision={currentMarketAskPrecision}
                            handleChangeValue={this.handleAmountChange}
                            handleFocusInput={this.handleFieldFocus}
                            currency={to}
                        />
                    ) : (
                        <OrderInput
                            className={inputAmountError}
                            suffix={
                                SET_MAXIMUM_AMOUNT_ARRAY.map((value, index) => 
                                    <PercentageButton
                                        value={value}
                                        key={index}
                                        onClick={this.handleChangeAmountByButton}
                                    />)
                            }
                            currency={to}
                            label={amountText}
                            placeholder={`≥ ${currentMarketMinAmount}`}
                            value={finalAmount || ''}
                            isFocused={amountFocused}
                            handleChangeValue={this.handleAmountChange}
                            handleFocusInput={this.handleFieldFocus}
                        />
                    )}
                    {type === 'sell' ?
                        amountErrorClassSell && 
                            <div className="error-message error-message--visible">
                                {translate('page.body.trade.header.newOrder.content.filterAmount', { amountReached: availableCurrency.toUpperCase() })}
                            </div>
                            :  
                        totalErrorClassBuy && orderType === 'Market' && 
                            <div className="error-message error-message--visible ssssss">
                                {translate('page.body.trade.header.newOrder.content.filterAmount', { amountReached: availableCurrency.toUpperCase() })}
                            </div>
                    }
                </div>
                <div className="make-order-form__percentage-slider">
                    <PercentageSlider
                        values={AMOUNT_PERCENTAGE_ARRAY}
                        value={this.state.sliderValue}
                        onChange={(value) => {
                            this.setState({
                                sliderValue: value
                            });
                            // Run amount change handler
                            this.handleChangeAmountByButton(value);
                        }}
                    />
                </div>
                {orderType === 'Limit' && (
                    <div className='make-order-form__field'>
                        {isMobileDevice ? (
                            <OrderInput
                                className={inputTotalError}
                                currency={from}
                                fixedLabel={totalText}
                                placeholder={`${this.props.translate('page.body.trade.header.newOrder.content.minimum')} ${new DecimalJS(Number(currentMarketMinAmount)).times(Number(currentMarketMinPrice)).toString()}`}
                                value={total || ''}
                                isFocused={totalFocused}
                                handleChangeValue={this.handleTotalChange}
                                handleFocusInput={this.handleFieldFocus}
                            />
                        ) : (
                            <OrderInput
                                className={inputTotalError}
                                currency={from}
                                label={totalText}
                                placeholder={`≥ ${new DecimalJS(Number(currentMarketMinAmount)).times(Number(currentMarketMinPrice)).toString()}`}
                                value={total || ''}
                                isFocused={totalFocused}
                                handleChangeValue={this.handleTotalChange}
                                handleFocusInput={this.handleFieldFocus}
                            />
                        )}
                        {type === 'buy' && 
                            totalErrorClassBuy && 
                                <div className="error-message error-message--visible">
                                    {translate('page.body.trade.header.newOrder.content.filterAmount', { amountReached: availableCurrency.toUpperCase() })}
                                </div>
                        }
                    </div>
                )}
                <div className="make-order-form__datas">
                    <div className="name">
                        {translate('page.body.trade.header.newOrder.content.available')}
                    </div>
                    <div className="datas">
                        {available ? Decimal.format(available, availablePrecision, ',') : '-.--'}
                        <span>{availableCurrency.toUpperCase()}</span>
                        <Link to={`/wallets/spot/${availableCurrency}/deposit`} className="deposit-link">
                            <DepositPlusIcon />
                        </Link>
                    </div>
                </div>
                {this.getTotalAvalaible()}
                <div className="make-order-form__button">
                    {userLoggedIn ?
                        <Button
                            className={type === 'buy' ? 'order-button buy' : 'order-button sell'}
                            disabled={this.checkButtonIsDisabled()}
                            onClick={this.handleSubmit}
                        >
                            {submitButtonText || type} {to.toUpperCase()}
                        </Button>
                    :   
                        <Button
                            className={type === 'buy' ? 'order-button buy' : 'order-button sell'}
                            href='/signin'
                        >
                            {translate('page.body.trade.header.newOrder.content.tabs.tradewithus')}
                        </Button>
                    }
                </div>
                <div className='make-order-form__infos'>
                    {orderType !== 'Market' ?
                        <div className="make-order-form__datas">
                        <OverlayTrigger 
                            placement="auto"
                            delay={{ show: 250, hide: 300 }} 
                            overlay={<Tooltip className="themes" title="page.body.trade.header.newOrder.content.maker.tooltip" />}>
                                <div className="name dotted">{translate('page.body.trade.header.newOrder.content.maker')}</div>
                        </OverlayTrigger>
                        <div className="datas">
                            {userLoggedIn ? 
                                Number(total) !== 0 ?
                                    type === 'buy' ? parseFloat(Number(feesTotalMaker).toFixed(currentMarketAskPrecision)) : 
                                    parseFloat(Number(feesTotalMaker).toFixed(currentMarketBidPrecision)) : '-.--' : '-.--'}
                            <span>{type === 'buy' ? to.toUpperCase() : from.toUpperCase()}</span>
                        </div>
                    </div> : null}
                    <div className="make-order-form__datas">
                        <OverlayTrigger 
                            placement="auto"
                            delay={{ show: 250, hide: 300 }} 
                            overlay={<Tooltip className="themes" title="page.body.trade.header.newOrder.content.taker.tooltip" />}>
                                <div className="name dotted">{translate('page.body.trade.header.newOrder.content.taker')}</div>
                        </OverlayTrigger>
                        <div className="datas">
                            {userLoggedIn ? 
                                Number(total) !== 0 ?
                                    type === 'buy' ? parseFloat(Number(feesTotalTaker).toFixed(currentMarketAskPrecision)) : 
                                        parseFloat(Number(feesTotalTaker).toFixed(currentMarketBidPrecision)) : '-.--' : '-.--'}
                            <span>{type === 'buy' ? to.toUpperCase() : from.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div className='make-order-form__infos'>
                    <div className="make-order-form__datas">
                        <OverlayTrigger 
                            placement="auto"
                            delay={{ show: 250, hide: 300 }} 
                            overlay={<Tooltip className="themes" title="page.body.trade.header.newOrder.content.minamount.tooltip" />}>
                                <div className="name dotted">{translate('page.body.trade.header.newOrder.content.minamount')}</div>
                        </OverlayTrigger>
                        <div className="datas">
                            {Number(currentMarketMinAmount)}
                            <span>{to.toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="make-order-form__datas">
                        <OverlayTrigger 
                            placement="auto"
                            delay={{ show: 250, hide: 300 }} 
                            overlay={<Tooltip className="themes" title="page.body.trade.header.newOrder.content.mintotal.tooltip" />}>
                                <div className="name dotted">{translate('page.body.trade.header.newOrder.content.mintotal')}</div>
                        </OverlayTrigger>
                        <div className="datas">
                            {new DecimalJS(Number(currentMarketMinAmount)).times(Number(currentMarketMinPrice)).toString()}
                            <span>{from.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private calculateFeeAmount = (total: number, fee: number) => {
        const result = new DecimalJS(total).times(fee).times(100).div(100);

        return result.toString();
    }

    private renderTabs = () => {
        const { orderType, index } = this.state; 

        return [
            {
                content: orderType === 'Limit' ? index === 0 : null,
                label: 'Limit',
            },
            {
                content: orderType === 'Market' ? index === 1 : null,
                label: 'Market',
            },
        ];
    };
 
    private handleOrderTypeChange = (index: number) => {
        const { orderTypesIndex } = this.props;
        this.setState({
            orderType: orderTypesIndex[index],
            index: index
        });
    };

    private handleFieldFocus = (field?: string) => {
        const { translate } = this.props;

        const priceText = translate('page.body.trade.header.newOrder.content.price');
        const amountText = translate('page.body.trade.header.newOrder.content.amount');
        const totalText = translate('page.body.trade.header.newOrder.content.total');

        switch (field) {
            case priceText:
                this.setState(prev => ({
                    priceFocused: !prev.priceFocused,
                }));
                this.props.listenInputPrice && this.props.listenInputPrice();
                break;
            case amountText:
                this.setState(prev => ({
                    amountFocused: !prev.amountFocused,
                }));
                break;
            case totalText:
                this.setState(prev => ({
                    totalFocused: !prev.totalFocused,
                }));
                break;
            default:
                break;
        }
    };

    private handlePriceChange = (value: string) => {
        const { currentMarketBidPrecision, currentMarketFilters } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(currentMarketBidPrecision))) {
            this.setState({
                price: convertedValue,
                isPriceValid: validatePriceStep(convertedValue, currentMarketFilters),
            });
        }

        this.props.listenInputPrice && this.props.listenInputPrice();
    }; 

    private handleAmountChange = (value: string) => {
        const { currentMarketAskPrecision } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(currentMarketAskPrecision))) {
            this.props.handleAmountChange(convertedValue, this.props.type);
        }
    };

    private handleTotalChange = (value: string) => {
        const { currentMarketBidPrecision } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(currentMarketBidPrecision))) {
            this.props.handleTotalChange(convertedValue, this.state.price, this.props.type);
        }
    }

    private handleChangeAmountByButton = (value: number) => {
        const { orderType, price } = this.state;
        const ordType = (orderType as string).toLowerCase()

        let priceToUse = ordType.includes('limit') || orderType === 'Market' ? price : null;

        this.props.handleChangeAmountByButton(value, orderType, priceToUse, this.props.type);
    };

    private handleSubmit = () => {
        const { available, type, amount } = this.props;
        const { price, priceMarket, orderType } = this.state;

        const order = {
            type,
            orderType,
            amount,
            available: available || 0,
            ...((orderType as string).toLowerCase().includes('limit') && { price: orderType === 'Market' ? priceMarket : price }),
        };

        this.props.onSubmit(order);
        this.handlePriceChange('');
        this.props.handleAmountChange('', this.props.type);
    };

    private checkButtonIsDisabled = (): boolean => {
        const total = this.getTotal();
        const { disabled, available, amount, totalPrice, type } = this.props;
        const { isPriceValid, orderType, priceMarket, price } = this.state;
        const safePrice = totalPrice / Number(amount) || priceMarket;

        const invalidAmount = Number(amount) <= 0;
        const invalidLimitPrice = (orderType as string).toLowerCase().includes('limit') && (Number(price) <= 0 || !isPriceValid.valid);
        const invalidMarketPrice = safePrice <= 0 && orderType === 'Market';
        const invalidTotalAmount = type === 'buy' ? Number(total) > Number(available) : Number(amount) > Number(available);

        return disabled || !available || invalidAmount || invalidLimitPrice || invalidMarketPrice || invalidTotalAmount;
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            this.handleSubmit();
        }
    };
}
