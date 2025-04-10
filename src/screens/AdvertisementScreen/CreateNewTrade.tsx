import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'; 
import { Button, IconButton } from '@mui/material';
import { DEFAULT_FIAT_PRECISION } from '../../constants';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { BigPlusIcon } from "../../assets/images/BigPlusIcon";
import { ReloadIcon } from "../../assets/images/ReloadIcon";
import { CSSTransition } from "react-transition-group";
import Input from "../../components/SelectP2PFilter/Input";
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip, Decimal } from '../../components';
import { CryptoIcon } from '../../components/CryptoIcon';
import { LikeIcon } from "../../assets/images/LikeIcon";
import { DocumentsVerIcon } from "../../assets/images/DocumentsVerIcon";
import { formatNumber } from "../../components/P2PTrading/Utils";
import { Advertisement } from "../../modules/public/advertisement";
import { useDispatch, useSelector } from "react-redux";
import { paymentsFetch, selectPayments, selectWallets, selectUserLoggedIn, selectUserInfo, selectCurrencies, Currency } from "../../modules";
import { MAX_LIMIT_CURRENCY } from "../../modules/constant";
import { P2PTradeCreate } from "../../modules/user/p2pTrade/types";
import { useIntl } from "react-intl";
import { DepositPlusIcon } from "src/assets/images/DepositPlusIcon";

interface Props {
    advertisement: Advertisement;
    onClose: () => void;
    onSubmit: (data: P2PTradeCreate) => void;
}

export const CreateNewTrade = ({ advertisement, onClose, onSubmit }: Props) => { 
    const history = useHistory();
    const isLoggedIn = useSelector(selectUserLoggedIn);
    const user = useSelector(selectUserInfo);
    
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<{ trade?: number, receive?: number, payment_method?: number }>({});
    const [error, setError] = useState<{ trade?: string, receive?: string, payment_method?: string }>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const dispatch = useDispatch();
    const userPayments = useSelector(selectPayments);

    const intl = useIntl();
    const wallets = useSelector(selectWallets);
    const currencies = useSelector(selectCurrencies);
    const advertiser = advertisement.advertiser;
    const avtChar = advertiser?.username.charAt(0).toUpperCase();
    const isBuy = advertisement.side === "sell";
    const payments = isBuy ? advertisement.payments : userPayments;
    const coinWallet = wallets.find(item => item.currency === advertisement.coin_currency);
    const coinPrecision: Currency = React.useMemo(() => currencies.find(item => item.id === advertisement.coin_currency), [currencies]);

    useEffect(() => {
        if (!payments.length) {
            dispatch(paymentsFetch({ page: 1, limit: 250 }));
        }
    }, [payments])

    const buyLimitMin = Number(advertisement.price) * Number(advertisement.min_amount);
    const buyLimitMax = Number(advertisement.price) * Number(advertisement.max_amount);
    
    const validateErrorCreate = (data: { trade?: number, receive?: number, payment_method?: number } = formData, _isSubmitted = isSubmitted) => {
        const _error = {} as { trade?: string, receive?: string, payment_method?: string };
        if (_isSubmitted) {
            if (!data.payment_method || data.payment_method <= 0) {
                _error.payment_method = intl.formatMessage({ id: "page.body.p2p.trade.message.payment_required" });
            }
        }; 
        
        const limitData = isBuy ? data.receive : data.trade;
        if ((limitData ?? 0) > Number(advertisement.max_amount) || (limitData ?? 0) < Number(advertisement.min_amount)) {
            _error[isBuy ? "trade" : "receive"] = `${intl.formatMessage({ id: "page.body.p2p.trade.message.order_limit" })}: ${Decimal.format(buyLimitMin, 2, ',')} ${advertisement.fiat_currency.toUpperCase()} - ${Decimal.format(buyLimitMax, 2, ',')} ${advertisement.fiat_currency.toUpperCase()}`;
        };
 
        if (!isBuy && (data.trade ?? 0) > Number(coinWallet?.balance ?? 0)) {
            _error.trade = intl.formatMessage({id: 'page.body.p2p.trade.message.insufficient_balance'});
        };
        
        setError(_error);
        return _error;
    }
 

    const onSetMax = () => {
        if (isBuy) {
            onChangeData("trade", Number(advertisement.max_amount) * Number(advertisement.price));
        } else {
            onChangeData("trade", (coinWallet?.balance) ?? 0);
        }
    }

    const onChangeData = (field: keyof typeof formData, data: any) => {
        const _formData = { ...formData, [field]: data };
        if (field === "trade") {
            if (isBuy) {  
                _formData.receive = parseFloat((Number(data) / Number(advertisement.price)).toFixed(coinPrecision?.precision));
            } else {
                _formData.receive = parseFloat((Number(data) * Number(advertisement.price)).toFixed(DEFAULT_FIAT_PRECISION));
            }
        }
        if (field === "receive") {
            if (isBuy) {
                _formData.trade = parseFloat((Number(data) * Number(advertisement.price)).toFixed(DEFAULT_FIAT_PRECISION));
            } else {
                _formData.trade = parseFloat((Number(data) / Number(advertisement.price)).toFixed(coinPrecision?.precision));
            }
        }
        validateErrorCreate(_formData);
        setFormData(_formData);
    }

    const handleSubmit = () => {
        const _error = validateErrorCreate(formData, true);
        setIsSubmitted(true);
        if (Object.keys(_error).length > 0) {
            return;
        }
        onSubmit({
            advertisement: advertisement.id,
            price: Number(advertisement.price),
            amount: isBuy ? Number(formData.receive) : Number(formData.trade),
            payment: Number(formData.payment_method),
        });
    }
 
    const isFormDirty = () => {
        return Object.keys(formData).some((key) => !!formData[key]);
    }
    const positiveFeedbackCount = advertiser?.positive_feedback_count ?? 0;
    const negativeFeedbackCount = advertiser?.negative_feedback_count ?? 0;
    const totalFeedback = (positiveFeedbackCount) + (negativeFeedbackCount);
    const positiveFeedbackRate = positiveFeedbackCount > 0 ? Math.round((positiveFeedbackCount) * 100 * 100 / totalFeedback) / 100 : 0;
    
    const errorBalance = error.trade && !isBuy && Number(advertisement.min_amount ?? 0) > Number(coinWallet?.balance ?? 0) || error.trade && !isBuy && Number(formData.trade ?? 0) > Number(coinWallet?.balance ?? 0);
    const selectedPaymentMethod = payments.find((payment) => payment.id === formData.payment_method);

    const placeholderCoin = advertisement.coin_currency === 'usdt'
    || advertisement.coin_currency === 'usdc' ? '0.00' : '0.00000000';

    return (
        <div className="p2pscreen__create-trade">
            <div className="p2pscreen__create-trade__left">
                <div className="p2pscreen__create-trade__head">
                    <div className="advert-datas">
                        <div className="avatar">
                            {avtChar}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <Link className="name" to={`/p2p/advertiser/${advertiser?.uid}`}>{advertiser.username ?? intl.formatMessage({ id: "page.body.profile.username.anonymous" })}</Link>
                                <OverlayTrigger 
                                    placement="auto"
                                    delay={{ show: 250, hide: 300 }} 
                                    overlay={<Tooltip className="themes" title="page.body.p2p.advertisement.content.tooltip.percents" />}>
                                        <p><LikeIcon />{positiveFeedbackRate ?? 0}%</p>
                                </OverlayTrigger>
                            </div>
                            <div className="flex flex-row">
                                { advertiser?.trades_count_30d === 1 ? (
                                    <span>{formatNumber(advertiser?.trades_count_30d ?? 0)} {intl.formatMessage({ id: "page.body.p2p.advertisement.content.infoorder" })}</span> 
                                    ) : <span>{formatNumber(advertiser?.trades_count_30d ?? 0)} {intl.formatMessage({ id: "page.body.p2p.advertisement.content.infoorders" })}</span> 
                                } 
                                <span>{advertiser?.success_rate_30d ?? 0}% {intl.formatMessage({ id: "page.body.p2p.advertisement.content.infocompletion" })}</span>    
                            </div>
                        </div> 
                    </div> 
                </div> 
                <div className="content">
                    <div className="content__info">
                        <div className="flex flex-col">
                            <span>{advertisement.paytime} min</span>
                            <p>{intl.formatMessage({ id: "page.body.p2p.trade.create.payment_limit" })}</p>
                        </div>
                        <div className="flex flex-col">
                            <span>{advertisement.amount} {advertisement.coin_currency.toUpperCase()}</span>
                            <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.available" })}</p>
                        </div>
                    </div>
                    <div className="content__description">
                        <p>{intl.formatMessage({ id: "page.body.p2p.trade.create.desc" })}</p>
                        <span>{advertisement.description ?? ""}</span>
                    </div>
                </div>
            </div>
            <div className="p2pscreen__create-trade__right">
                <div className="p2pscreen__create-trade__head">
                    <div className="flex-row">
                        <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.price" })}</span>
                        <span className={`trade-price ${isBuy ? "buy" : "sell"}`}> 
                            {Decimal.format(advertisement.price, 2, ',')} {advertisement.fiat_currency.toUpperCase()}
                        </span>
                    </div>
                     
                </div> 
                <div className="payment-options">
                     <Input
                        type="number"
                        maxNumber={MAX_LIMIT_CURRENCY}
                        value={`${formData.trade ?? ""}`}
                        onChange={(data) => onChangeData("trade", data)} 
                        placeholder={isBuy ? `${Decimal.format(buyLimitMin, DEFAULT_FIAT_PRECISION, ',')} - ${Decimal.format(buyLimitMax, DEFAULT_FIAT_PRECISION, ',')}` : placeholderCoin}
                        label={isBuy ? intl.formatMessage({ id: "page.body.p2p.trade.create.pay" }) : intl.formatMessage({ id: "page.body.p2p.trade.create.sell" })}
                        suffix={<div className="input-right">
                                <button onClick={onSetMax}>Max</button>
                                {isBuy ? <CryptoIcon code={advertisement.fiat_currency.toUpperCase()} /> : <CryptoIcon code={coinWallet?.currency.toUpperCase()} />}
                                <span>{isBuy ? advertisement.fiat_currency.toUpperCase() : advertisement.coin_currency.toUpperCase()}</span>
                            </div>}

                        errorMessage={
                            errorBalance ? <p className="error-message">{intl.formatMessage({ id: "page.body.p2p.trade.message.insufficient_balance" })} 
                            <Link className="error-link" to={`/wallets/spot/${advertisement.coin_currency}/deposit/`}>
                            {intl.formatMessage({ id: "page.body.p2p.create.offer.add" })} {advertisement.coin_currency.toUpperCase()}</Link></p> :  
                           
                           isBuy && error.trade ? <p className="error-message">{error.trade}</p>
                            
                            : !isBuy ? <div className="balance-message">
                                            <span>{intl.formatMessage({ id: "page.body.p2p.trade.create.balance" })}: {coinWallet?.balance ?? '0.00'} {(coinWallet?.currency ?? "").toUpperCase()}</span>
                                            <Link to={`/wallets/spot/${coinWallet?.currency}/deposit`} className="deposit-link">
                                                <DepositPlusIcon />
                                            </Link>
                                        </div>
                                : null }
                        error={error.receive || error.trade}
                        decimalScale={isBuy ? DEFAULT_FIAT_PRECISION : coinPrecision?.precision}
                    /> 
                </div>
                <div className="payment-options">
                    <Input
                        type="number"
                        maxNumber={MAX_LIMIT_CURRENCY}
                        value={`${formData.receive ?? ""}`}
                        placeholder={!isBuy ? `${Decimal.format(advertisement.min_amount, DEFAULT_FIAT_PRECISION, ',')} - ${Decimal.format(advertisement.max_amount, DEFAULT_FIAT_PRECISION, ',')}` : placeholderCoin}
                        onChange={(data) => onChangeData("receive", data)}
                        label={intl.formatMessage({ id: "page.body.p2p.trade.create.receive" })}
                        suffix={<div className="input-right">
                                {isBuy ? <CryptoIcon code={coinWallet?.currency.toUpperCase()} /> : <CryptoIcon code={advertisement.fiat_currency.toUpperCase()} />}
                                <span>{isBuy ? advertisement.coin_currency.toUpperCase() : advertisement.fiat_currency.toUpperCase()}</span>
                            </div>}
                        errorMessage={!isBuy && error.receive && <p className="error-message">{error.receive}</p>}
                        error={error.receive || error.trade}
                        decimalScale={isBuy ? coinPrecision?.precision : DEFAULT_FIAT_PRECISION}
                    />
                </div>
                <Button
                    className="input-button themes"
                    onClick={() => setShowModal(!showModal)}
                    variant="outlined"
                > 
                    {selectedPaymentMethod ? `${selectedPaymentMethod.payment_type} - ${selectedPaymentMethod.account_name}` : intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_payment" })}
                    {!selectedPaymentMethod ? <BigPlusIcon /> : <ReloadIcon className="reload-icon"/>}
                </Button>
                <div className="payment-options__footer">
                    <button 
                        className="button-medium black" 
                        onClick={onClose}
                    >
                        {intl.formatMessage({ id: "page.body.p2p.dispute.cancel" })}
                    </button>
                    {isLoggedIn ? 
                        <button
                            disabled={!isFormDirty() || errorBalance || !formData.payment_method || !(!error.receive) || !(!error.trade) }
                            onClick={handleSubmit}
                            className={`button-medium ${isBuy ? "green" : "red"}`}
                        >
                            {isBuy ? intl.formatMessage({ id: "page.body.p2p.advertisement.content.buy" }) : intl.formatMessage({ id: "page.body.p2p.advertisement.content.sell" })} {advertisement.coin_currency.toUpperCase()}
                        </button>
                        :
                        <button 
                            onClick={() => history.push("/signin")}
                            className="button-medium loged"
                        >
                            {intl.formatMessage({ id: "page.body.land.button.enter" })}
                        </button>
                    }
                </div> 
            </div> 
            <CSSTransition
                in={showModal}
                timeout={{
                    enter: 100,
                    exit: 400
                  }}
                unmountOnExit
            > 
            <div className="themes p2p-modal modal-window">
                <div className="modal-window__container scroll fadet">
                    <div className="modal-window__container__header">
                        <h1>{intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_payment" })}</h1>
                        <div className="modal-window__container__header__close">
                            <IconButton 
                                onClick={() => setShowModal(false)}
                                sx={{
                                    color: 'var(--color-dark)',
                                    '&:hover': {
                                        color: 'var(--color-accent)'
                                    }
                                }}
                            >
                                <CloseIcon className="icon_closeed themes"/>
                            </IconButton>
                        </div>
                    </div>
                    { user.level === 3 ? 
                        <div className="p2pmodal-title">{intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_payments.add" })}</div>
                    : null }
                    { user.level === 3 ? ( 
                        <div className="payment-options__payment"> 
                            <div className="payment-options__payment__list">
                                {payments.map((item) => {
                                    const isSelected = formData.payment_method === item.id;
                                    return (
                                        <div 
                                            key={item.id}
                                            onClick={() => onChangeData("payment_method", item.id)}
                                            className={`payment-options__payment__list__variants${
                                            isSelected
                                                ? " selected"
                                                : ""
                                        }`}> 
                                            <div className="checks"></div>
                                            <span>{`${item.payment_type} - ${item.account_name}`}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {error.payment_method && <p className="error-message">{error.payment_method}</p>}
                        </div>
                    ) : (
                        <div className="payment-options__payment"> 
                            <div className="payment-options__payment__title">{intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_payments.verify" })}</div>
                            <div className="payment-options__payment__step">
                                <div className="left">
                                    <DocumentsVerIcon />
                                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_payments.verify.span" })}</span>
                                </div>
                                <div className="right">
                                    <Button
                                        href='/profile'
                                        className="little-button themes"
                                    >   
                                        {intl.formatMessage({ id: 'page.body.p2p.advertisement.component.select_payments.verify.button' })}
                                    </Button>
                                </div>
                            </div>
                        </div>)}
                    <div className="p2p-modal__footer">
                        { user.level === 3 ? (
                            <Button
                                onClick={() => setShowModal(false)}
                                className="medium-button themes"
                                disabled={!formData.payment_method}
                            >   
                                {intl.formatMessage({ id: 'page.body.kyc.submit' })}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setShowModal(false)}
                                className="medium-button themes black"
                            >   
                                {intl.formatMessage({ id: 'page.body.p2p.trade.create.close' })}
                            </Button>
                        )}
                    </div>
                </div>
            </div> 
            </CSSTransition>
        </div>
    );
}