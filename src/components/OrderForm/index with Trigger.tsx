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
    ORDER_TYPES_WITH_TRIGGER,
    TRIGGER_BUY_PRICE_MULT,
    TRIGGER_BUY_PRICE_ADJUSTED_TYPES,
} from '../../constants';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';
import { OrderInput as OrderInputMobile } from '../../mobile/components';
import { Decimal } from '../Decimal';
import { OrderRowMenu } from './OrderRowMenu';
import { OrderProps } from '../Order';
import { OrderInput } from '../OrderInput';
import { PercentageSlider } from '../PercentageSlider';
import { getTriggerSign } from 'src/containers/OpenOrders/helpers';
import { PercentageButton } from '../PercentageButton';

type OnSubmitCallback = (order: OrderProps) => void;
type RowOrderElement = number | string | React.ReactNode;
type FormType = 'buy' | 'sell';

export interface OrderFormProps {
    /**
     * Price that is applied during total order amount calculation when type is Market
     */
    priceMarket: number;
    /**
     * Price that is applied during total order amount calculation when type is Market
     */
    priceLimit?: number;
    /**
     * Price that is applied when user clicks orderbook row
     */
    trigger?: number;
    /**
     * Type of form, can be 'buy' or 'sell'
     */
    type: FormType;
    /**
     * Available types of order
     */
    orderTypes?: RowOrderElement[];
    /**
     * Available types of order without translations
     */
    orderTypesIndex: RowOrderElement[];
    /**
     * Additional class name. By default element receives `cr-order` class
     * @default empty
     */
    className?: string;
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
     * Amount of money in a wallet
     */
    available?: number;
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
    /**
     * Best ask price
     */
    bestAsk?: string;
    /**
     * Best boid price
     */
    bestBid?: string;
    /**
     * Whether order is disabled to execute
     */
    disabled?: boolean;
    /**
     * Callback that is called when form is submitted
     */
    onSubmit: OnSubmitCallback;
    /**
     * start handling change price
     */
    listenInputPrice?: () => void;
    /**
     * start handling change trigger price
     */
    listenInputTrigger?: () => void;
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
    trigger: string;
    isPriceValid: PriceValidation;
    isTriggerValid: PriceValidation;
    amountFocused: boolean;
    totalFocused: boolean;
    priceFocused: boolean;
    triggerFocused: boolean;
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
            trigger: '',
            isPriceValid: {
                valid: true,
                priceStep: 0,
            },
            isTriggerValid: {
                valid: true,
                priceStep: 0,
            },
            priceFocused: false,
            amountFocused: false,
            totalFocused: false,
            triggerFocused: false,
            sliderValue: AMOUNT_PERCENTAGE_ARRAY[0],
        };
        
        this.handleChangeAmountByButton = this.handleChangeAmountByButton.bind(this);
    }

    public componentWillReceiveProps(next: OrderFormProps) {
        const nextPriceLimitTruncated = Decimal.format(next.priceLimit, this.props.currentMarketBidPrecision);

        if ((this.state.orderType as string).toLowerCase().includes('limit') && next.priceLimit && nextPriceLimitTruncated !== this.state.price) {
            this.handlePriceChange(nextPriceLimitTruncated);
        }

        const nextTriggerTruncated = Decimal.format(next.trigger, this.props.currentMarketBidPrecision);

        if (['Stop-loss', 'Take-profit'].includes(String(this.state.orderType)) && next.trigger && nextTriggerTruncated !== this.state.trigger) {
            this.handleTriggerChange(nextTriggerTruncated);
        }

        if (this.state.priceMarket !== next.priceMarket) {
            this.setState({
                priceMarket: next.priceMarket,
            });
        }

        if (this.props.to !== next.to || this.props.from !== next.from) {
            this.setState({ price: '', trigger: '' });
            this.props.handleAmountChange('', next.type);
        }

        if (this.props.marketId !== next.marketId) {
            this.setState({
                orderType: 'Limit',
            });
        }
    }

    public renderPrice = () => {
        const { price, priceFocused, isPriceValid } = this.state;
        const { from, isMobileDevice, currentMarketBidPrecision, translate, currentMarketMinPrice } = this.props;

        const priceText = translate('page.body.trade.header.newOrder.content.price');
        const priceErrorClass = classnames('error-message', {
            'error-message--visible': (priceFocused || isMobileDevice) && !isPriceValid.valid,
        });

        return (
            <div className='make-order-form__field'>
                {isMobileDevice ? (
                    <OrderInputMobile
                        className={Number(price) !== 0 && Number(price) < Number(currentMarketMinPrice) ? 'iserrored' : ''}
                        label={priceText}
                        placeholder={translate('page.mobile.order.price.placeholder', { currency: from ? from.toUpperCase() : '' })}
                        value={price || ''}
                        isFocused={priceFocused}
                        precision={currentMarketBidPrecision}
                        handleChangeValue={this.handlePriceChange}
                        handleFocusInput={this.handleFieldFocus}
                    />
                ) : (
                    <OrderInput
                        className={Number(price) !== 0 && Number(price) < Number(currentMarketMinPrice) ? 'iserrored' : ''}
                        currency={from}
                        label={priceText}
                        placeholder={`≥${currentMarketMinPrice}`}
                        value={price || ''}
                        isFocused={priceFocused}
                        isWrong={!isPriceValid.valid}
                        handleChangeValue={this.handlePriceChange}
                        handleFocusInput={this.handleFieldFocus}
                    />
                )}
                <div className={priceErrorClass}>
                    {translate('page.body.trade.header.newOrder.content.filterPrice', { priceStep: isPriceValid.priceStep })}
                </div>
            </div>
        );
    }

    public renderTrigger = () => {
        const { orderType, triggerFocused, trigger, isTriggerValid } = this.state;
        const { type, from, isMobileDevice, currentMarketBidPrecision, translate } = this.props;

        const triggerErrorClass = classnames('error-message', {
            'error-message--visible': (triggerFocused || isMobileDevice) && !isTriggerValid.valid,
        });
        const triggerText = translate(`page.body.trade.header.newOrder.content.triggerPrice`, { sign: getTriggerSign(String(orderType).toLowerCase(), type) });

        return (
            <div className='make-order-form__field'>
                {isMobileDevice ? (
                    <OrderInputMobile
                        label={triggerText}
                        placeholder={
                            translate(
                                `page.mobile.order.trigger.placeholder.${(orderType as string).includes('Stop') ? 'stop' : 'take'}`, { currency: from ? from.toUpperCase() : '' },
                            )
                        }
                        value={trigger || ''}
                        isFocused={triggerFocused}
                        precision={currentMarketBidPrecision}
                        handleChangeValue={this.handleTriggerChange}
                        handleFocusInput={this.handleFieldFocus}
                    />
                ) : (
                    <OrderInput
                        currency={from}
                        label={'Stop'}
                        placeholder={triggerText}
                        value={trigger || ''}
                        isFocused={triggerFocused}
                        isWrong={!isTriggerValid.valid}
                        handleChangeValue={this.handleTriggerChange}
                        handleFocusInput={this.handleFieldFocus}
                    />
                )}
                <div className={triggerErrorClass}>
                    {translate('page.body.trade.header.newOrder.content.filterPrice', { priceStep: isTriggerValid.priceStep })}
                </div>
            </div>
        );
    }

    public getPriceInputs = () => {
        const { orderType, priceMarket } = this.state;
        const { from, totalPrice, amount, currentMarketBidPrecision, translate } = this.props;

        switch (orderType) {
            case 'Limit':
                return this.renderPrice();
            case 'Stop-loss':
            case 'Take-profit':
                return this.renderTrigger();
            case 'Stop-limit':
            case 'Take-limit':
                return (
                    <div className="cr-price-inputs">
                        <div className="cr-price-inputs__trigger">
                            {this.renderTrigger()}
                        </div>
                        {this.renderPrice()}
                    </div>
                );
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
                                    {handleSetValue(Decimal.format(safePrice, currentMarketBidPrecision, ','), '0.00')}
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

    public getTotal = () => {
        const { orderType, price, trigger, side } = this.state;
        const { totalPrice, amount } = this.props;
        const safeAmount = Number(amount) || 0;

        if (orderType === 'Market') {
            return totalPrice;
        } else if ((orderType as string).toLowerCase().includes('limit')) {
            return new DecimalJS(safeAmount).times((Number(price))).toString() || 0;
        } else if (side === 'buy') {
            return TRIGGER_BUY_PRICE_MULT * safeAmount * (Number(trigger) || 0);
        } else {
            return safeAmount * (Number(trigger) || 0);
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

        const availablePrecision = type === 'buy' ? currentMarketBidPrecision : currentMarketAskPrecision;
        const availableCurrency = type === 'buy' ? from : to;

        const amountText = this.props.translate('page.body.trade.header.newOrder.content.amount');
        const totalText = this.props.translate('page.body.trade.header.newOrder.content.total');
        const submitButtonText = translate(`page.body.trade.header.newOrder.content.tabs.${type}`);

        const typeClass = classnames({
            'buy-type': type === 'buy',
            'sell-type': type === 'sell',
        });

        const amountErrorClass = classnames('error-message', {
            'error-message--visible': Number(total) > Number(available),
        });
 
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
                            className={Number(amount) !== 0 && Number(amount) < Number(currentMarketMinAmount)
                                || Number(amount) > Number(available) ? 'iserrored' : ''
                            }
                            label={amountText}
                            placeholder={translate('page.mobile.order.amount.placeholder', { currency: to ? to.toUpperCase() : '' })}
                            value={amount || ''}
                            isFocused={amountFocused}
                            precision={currentMarketAskPrecision}
                            handleChangeValue={this.handleAmountChange}
                            handleFocusInput={this.handleFieldFocus}
                        />
                    ) : (
                        <OrderInput
                            className={Number(amount) !== 0 && Number(amount) < Number(currentMarketMinAmount) 
                                || Number(total) > Number(available) ? 'iserrored' : ''
                            }
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
                            placeholder={`≥${currentMarketMinAmount}`}
                            value={amount || ''}
                            isFocused={amountFocused}
                            handleChangeValue={this.handleAmountChange}
                            handleFocusInput={this.handleFieldFocus}
                        />
                    )}
                    <div className={amountErrorClass}>
                        {translate('page.body.trade.header.newOrder.content.filterAmount', { amountReached: availableCurrency.toUpperCase() })}
                    </div>
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
                            <OrderInputMobile
                                className={Number(total) !== 0 && 
                                    Number(total) < Number(new DecimalJS(Number(currentMarketMinAmount)).times(Number(currentMarketMinPrice)).toString()) 
                                    || Number(total) > Number(available) ? 'iserrored' : ''}
                                label={totalText}
                                placeholder={`≥ ${new DecimalJS(Number(currentMarketMinAmount)).times(Number(currentMarketMinPrice)).toString()}`}
                                value={total || ''}
                                isFocused={totalFocused}
                                precision={currentMarketAskPrecision}
                                handleChangeValue={this.handleTotalChange}
                                handleFocusInput={this.handleFieldFocus}
                            />
                        ) : (
                            <OrderInput
                                className={Number(total) !== 0 && 
                                    Number(total) < Number(new DecimalJS(Number(currentMarketMinAmount)).times(Number(currentMarketMinPrice)).toString()) 
                                    || Number(total) > Number(available) ? 'iserrored' : ''}
                                currency={from}
                                label={totalText}
                                placeholder={`≥ ${new DecimalJS(Number(currentMarketMinAmount)).times(Number(currentMarketMinPrice)).toString()}`}
                                value={total || ''}
                                isFocused={totalFocused}
                                handleChangeValue={this.handleTotalChange}
                                handleFocusInput={this.handleFieldFocus}
                            />
                        )}
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
                <div className="make-order-form__datas">
                    <OverlayTrigger 
                        placement="auto"
                        delay={{ show: 250, hide: 300 }} 
                        overlay={<Tooltip className="themes" title="page.body.trade.header.newOrder.content.total.tooltip" />}>
                            <div className="name dotted">{translate(`page.body.trade.header.newOrder.content.total.${type}`)}</div>
                    </OverlayTrigger>
                    <div className="datas">
                        {Decimal.format(total, currentMarketAskPrecision)}
                        <span>{type === 'buy' ? to.toUpperCase() : from.toUpperCase()}</span>
                    </div>
                </div>
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
                            {userLoggedIn ? this.calculateFeeAmount(Number(total), Number(membersFeeMaker)) || '-.--' : '-.--'}
                            <span>{type === 'buy' ? to.toUpperCase() : from.toUpperCase()}</span>
                        </div>
                    </div> : null}
                    <div className="make-order-form__datas">
                        <OverlayTrigger 
                            placement="auto"
                            delay={{ show: 250, hide: 300 }} 
                            overlay={<Tooltip className="themes" title="page.body.trade.header.newOrder.content.maker.tooltip" />}>
                                <div className="name dotted">{translate('page.body.trade.header.newOrder.content.taker')}</div>
                        </OverlayTrigger>
                        <div className="datas">
                        {userLoggedIn ? this.calculateFeeAmount(Number(total), Number(membersFeeTaker)) || '-.--' : '-.--'}
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
            /*{
                content: orderType === 'Stop-limit' && index === 2,
                label: 'Stop limit',
            },
            {
                content: orderType === 'Take-profit' && index === 3,
                label: 'Take profit',
            },*/
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
        const { orderType } = this.state;
        const { type, translate } = this.props;

        const priceText = translate('page.body.trade.header.newOrder.content.price');
        const amountText = translate('page.body.trade.header.newOrder.content.amount');
        const totalText = translate('page.body.trade.header.newOrder.content.total')
        const triggerText = translate(`page.body.trade.header.newOrder.content.triggerPrice`, { sign: getTriggerSign(String(orderType).toLowerCase(), type) });

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
            case triggerText:
                this.setState(prev => ({
                    triggerFocused: !prev.triggerFocused,
                }));
                this.props.listenInputTrigger && this.props.listenInputTrigger();
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

    private handleTriggerChange = (value: string) => {
        const { currentMarketBidPrecision, currentMarketFilters } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(currentMarketBidPrecision))) {
            this.setState({
                trigger: convertedValue,
                isTriggerValid: validatePriceStep(convertedValue, currentMarketFilters),
            });
        }

        this.props.listenInputTrigger && this.props.listenInputTrigger();
    };

    private handleAmountChange = (value: string) => {
        const { currentMarketAskPrecision } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(currentMarketAskPrecision))) {
            this.props.handleAmountChange(convertedValue, this.props.type);
        }
    };

    private handleTotalChange = (value: string) => {
        const { currentMarketAskPrecision } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(currentMarketAskPrecision))) {
            this.props.handleTotalChange(convertedValue, this.state.price, this.props.type);
        }
    }

    private handleChangeAmountByButton = (value: number) => {
        const { orderType, price, trigger, side } = this.state;
        const ordType = (orderType as string).toLowerCase()

        let priceToUse = ordType.includes('limit') || orderType === 'Market' ? price : trigger;

        if (side === 'buy' && TRIGGER_BUY_PRICE_ADJUSTED_TYPES.includes(ordType)) {
            priceToUse = (Number(priceToUse) * TRIGGER_BUY_PRICE_MULT).toString()
        }

        this.props.handleChangeAmountByButton(value, orderType, priceToUse, this.props.type);
    };

    private handleSubmit = () => {
        const { available, type, amount } = this.props;
        const { price, priceMarket, orderType, trigger } = this.state;

        const order = {
            type,
            orderType,
            amount,
            available: available || 0,
            ...((orderType as string).toLowerCase().includes('limit') && { price: orderType === 'Market' ? priceMarket : price }),
            ...(ORDER_TYPES_WITH_TRIGGER.includes(orderType as string) && { trigger }),
        };

        this.props.onSubmit(order);
        this.handlePriceChange('');
        this.handleTriggerChange('');
        this.props.handleAmountChange('', this.props.type);
    };

    private checkButtonIsDisabled = (): boolean => {
        const total = this.getTotal();
        const { disabled, available, amount, totalPrice } = this.props;
        const { isPriceValid, orderType, priceMarket, price, trigger, isTriggerValid } = this.state;
        const safePrice = totalPrice / Number(amount) || priceMarket;

        const invalidAmount = Number(amount) <= 0;

        const invalidLimitPrice = (orderType as string).toLowerCase().includes('limit') && (Number(price) <= 0 || !isPriceValid.valid);
        const invalidTriggerPrice = ORDER_TYPES_WITH_TRIGGER.includes(orderType as string) && (Number(trigger) <= 0 || !isTriggerValid.valid);
        const invalidMarketPrice = safePrice <= 0 && orderType === 'Market';
        const invalidTotalAmount = Number(total) > Number(available)

        return disabled || !available || invalidAmount || invalidLimitPrice || invalidMarketPrice || invalidTriggerPrice || invalidTotalAmount;
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            this.handleSubmit();
        }
    };
}
