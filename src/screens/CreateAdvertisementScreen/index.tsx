import React, { useEffect, useState, useMemo } from "react";
import { P2PAdvertisementCreateRequest } from "../../modules/user/p2pAdvertisement";
import SelectP2PFilter from "../../components/SelectP2PFilter";
import Input from "../../components/SelectP2PFilter/Input";
import { Link, useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";
import { Button, IconButton } from '@mui/material';
import { Decimal, FilterInput } from "../../components";
import { p2pCreateAdvertisementFetch } from "../../modules/user/p2pAdvertisement/actions";
import { MAX_LIMIT_CURRENCY } from "../../modules/constant";
import { useIntl } from "react-intl";
import { HeaderTrading, AdvertisementMenu } from "../../containers";
import { formatNumber } from "../../components/P2PTrading/Utils";
import { setDocumentTitle } from "../../helpers";
import TextArea from "../../components/SelectP2PFilter/TextArea";
import { CryptoIcon } from "../../components/CryptoIcon";
import { DepositPlusIcon } from "src/assets/images/DepositPlusIcon";
import { PlusIcon } from "../../assets/images/PlusIcon";
import { CloseIcon } from "../../assets/images/CloseIcon";
import {
    alertPush, 
    currenciesFetch, 
    selectCurrencies, 
    selectWallets, 
    selectPayments, 
    paymentsFetch,
} from "../../modules";
import { Payment } from "../../modules/user/payments/types";

const defaultFormValue: P2PAdvertisementCreateRequest = {
    side: "buy",
    coin_currency: "",
    fiat_currency: "",
    price: 0,
    amount: 0,
    min_amount: 0,
    max_amount: 0,
    paytime: 10,
    payment_methods: [],
};

export const CreateAdvertisementScreen = () => {
    const intl = useIntl();
    useEffect(() => {
        setDocumentTitle(intl.formatMessage({ id: "page.body.screen.title.addnewad" }));
    }, []);

    const dispatch = useDispatch();
    const history = useHistory();
    
    const [formData, setFormData] = useState<P2PAdvertisementCreateRequest>(defaultFormValue);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const payments = useSelector(selectPayments);
    const [filteredPaymentMethods, setFilteredPaymentMethods] = useState<any[]>(payments);

    const wallets = useSelector(selectWallets);
    const currencies = useSelector(selectCurrencies);
    const balance = !!formData.coin_currency
        ? Number(wallets.find((item) => item.currency === formData.coin_currency)?.balance ?? 0)
        : 0;

    useEffect(() => {
        dispatch(currenciesFetch());
    }, []);

    useEffect(() => {
        dispatch(paymentsFetch({ page: 1, limit: 20 }));
      }, [dispatch]);

    useEffect(() => {
		setFilteredPaymentMethods(payments); 
	}, [payments]); 

    const validate = (data: P2PAdvertisementCreateRequest = formData): { [key: string]: string } => {
        const _errors = {} as { [key: string]: string };
        
        if (!data.coin_currency || data.coin_currency === "") {
            _errors.coin_currency = intl.formatMessage({ id: "page.body.p2p.advertisement.message.coin_required" });
        }
        if (!data.fiat_currency || data.fiat_currency === "") {
            _errors.fiat_currency = intl.formatMessage({ id: "page.body.p2p.advertisement.message.fiat_required" });
        }
        if (!data.price || data.price <= 0) {
            _errors.price = intl.formatMessage({ id: "page.body.p2p.advertisement.message.price_required" });
        }
        if (!data.amount || data.amount <= 0) {
            _errors.amount = intl.formatMessage({ id: "page.body.p2p.advertisement.message.amount_required" });
        }
        if (!data.min_amount || data.min_amount <= 0) {
            _errors.min_amount = intl.formatMessage({ id: "page.body.p2p.advertisement.message.min_required" });
        }
        if (!data.max_amount || data.max_amount <= 0) {
            _errors.max_amount = intl.formatMessage({ id: "page.body.p2p.advertisement.message.max_required" });
        }
        if (data.min_amount >= data.max_amount) {
            _errors.min_amount = intl.formatMessage({ id: "page.body.p2p.advertisement.message.min_limit" });
        }
        if (Number(data.max_amount) > (Number(data.price) * Number(data.amount))) {
            _errors.max_amount = `${intl.formatMessage({
                id: "page.body.p2p.advertisement.message.max_limit",
            })}: ${formatNumber(Number(data.price * data.amount))} ${formData.fiat_currency.toUpperCase()}`;
        }
        if (data.side === "sell" && data.amount > balance) {
            _errors.amount = intl.formatMessage({ id: "page.body.p2p.trade.message.insufficient_balance" });
        }
        if (!data.payment_methods || data.payment_methods.length === 0) {
            _errors.payment_methods = intl.formatMessage({
                id: "page.body.p2p.advertisement.content.payment_method_error_not_selected",
            });
        }
        if (data.paytime < 0 || data.paytime > 180) {
            _errors.paytime = intl.formatMessage({ id: "page.body.p2p.advertisement.message.invalid_paytime" });
        }
        if (data.description && data.description.length > 255) {
            _errors.description = intl.formatMessage({ id: "page.body.p2p.advertisement.message.description" });
        }
        setErrors(_errors);
        return _errors;
    };

    const handleSubmit = async () => {
        const _errors = validate();
        setIsSubmitted(true);
        if (Object.keys(_errors).length > 0) {
            dispatch(alertPush({ message: [_errors[Object.keys(_errors)[0]]], type: "error" }));
            return;
        }
        dispatch(p2pCreateAdvertisementFetch(formData));
        history.push("/p2p/myads");
    };

    const coinCurrencies = currencies.filter((currency) => currency.type === "coin");
    const fiatCurrencies = currencies.filter((currency) => currency.type === "fiat");

    const fiatCurrency = fiatCurrencies.find((currency) => currency.id === formData.fiat_currency);
    const coinCurrency = coinCurrencies.find((currency) => currency.id === formData.coin_currency);

    const handleChangeForm = (key: keyof P2PAdvertisementCreateRequest, value: any) => {
        const _formData = { ...formData, [key]: value };
        setFormData(_formData);
        if (isSubmitted) {
            validate(_formData);
        }
    };

    const isFormDirty = () => {
        return Object.keys(formData).some((key) => formData[key] !== defaultFormValue[key]);
    };

    const togglePaymentMethod = (methodId: number) => {
        setFormData((prevFormData) => {
            const isSelected = prevFormData.payment_methods.includes(methodId);
            let updatedMethods;

            if (isSelected) {
                // Remove method if already selected
                updatedMethods = prevFormData.payment_methods.filter((id) => id !== methodId);
            } else if (prevFormData.payment_methods.length < 5) {
                // Add method if not selected and limit is not reached
                updatedMethods = [...prevFormData.payment_methods, methodId];
            } else {
                // Prevent adding more than 5 methods
                updatedMethods = prevFormData.payment_methods;
            }

            return { ...prevFormData, payment_methods: updatedMethods };
        });
    };

    const searchFilter = (row: Payment, searchKey: string) => {
        return row ? (row.account_name as string).toLowerCase().includes(searchKey.toLowerCase()) : false;
    };

    const handleFilter = (result: object[]) => {
        setFilteredPaymentMethods(result as Payment[]);
    };
    
    const renderHeader = useMemo(() => {
        return (
            <React.Fragment>
                <div className="modal-window__container__header">
                    <h1 className="p2pcreate-add__modal-payment__header__heading">
                        {intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_payments" })}
                    </h1>
                    <div className="modal-window__container__header__close">
                        <IconButton 
                            onClick={() => setShowPaymentModal(false)}
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
                <FilterInput
                    data={payments}
                    onFilter={handleFilter}
                    filter={searchFilter}
                    placeholder={intl.formatMessage({ id: "page.body.wallets.overview.seach" })}
                    themes={true}
                />
                <div className="p2pmodal-title">
                    {intl.formatMessage({ id: "page.body.p2p.advertisement.content.payment_method" })}
                    <strong>({intl.formatMessage({ id: "page.body.p2p.advertisement.content.payment_method_description" })})</strong>
                </div>
            </React.Fragment>
        );
    }, [payments]);

    const renderBody = useMemo(
        () => (
            <div className="payment-options__payment">
                <div className="payment-options__payment__list">
                    {filteredPaymentMethods.map((method, index) => {
                        const isSelected = formData.payment_methods.includes(method);
                        return (
                            <div 
                                key={index}
                                onClick={() => togglePaymentMethod(method)}
                                className={`payment-options__payment__list__variants${
                                isSelected
                                    ? " selected"
                                    : formData.payment_methods.length >= 5
                                    ? " disabled"
                                    : ""
                            }`}> 
                                <div className="checks"></div>
                                <span>{`${method.account_name}`}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        ),
        [formData, filteredPaymentMethods]
    );

    const renderFooter = useMemo(
        () => (
            <div className="p2p-modal__footer">
                <Button
                    onClick={() => setShowPaymentModal(false)}
                    disabled={formData.payment_methods.length === 0}
                    className="medium-button themes">
                    {intl.formatMessage({ id: "page.body.p2p.advertisement.content.payment_method_confirm" })}
                </Button>
            </div>
        ),
        [formData]
    );

    return (
        <div className="p2pscreen">
            <HeaderTrading />
            <AdvertisementMenu />
            <div className="p2pscreen__wrapper">
                <div className="p2pcreate-add">
                    <div className="p2pcreate-add__head">
                        <h2>{intl.formatMessage({ id: "page.body.p2p.advertisement.action.new_ads" })}</h2>
                        <div className="p2pcreate-add__head__buttons">
                            <Button
                                onClick={() => handleChangeForm("side", "buy")}
                                className={`buy ${formData.side === "buy" ? "active" : ""}`}>
                                {intl.formatMessage({ id: "page.body.p2p.advertisement.content.iwant.buy" })}
                            </Button>
                            <Button
                                onClick={() => handleChangeForm("side", "sell")}
                                className={`sell ${formData.side === "sell" ? "active" : ""}`}>
                                {intl.formatMessage({ id: "page.body.p2p.advertisement.content.iwant.sell" })}
                            </Button>
                        </div>
                    </div>
                    <div className="p2pcreate-add__body">
                        <div className="p2pcreate-add__body__row">
                            <div className="p2pcreate-add__body__input themes">
                                <label>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.asset" })}</label>
                                <SelectP2PFilter
                                    searchAble
                                    value={formData.coin_currency}
                                    suffixMarkup={intl.formatMessage({
                                        id: "page.body.p2p.advertisement.component.select_coin",
                                    })}
                                    currentIcon={
                                        <CryptoIcon
                                            className="label-icon"
                                            code={formData.coin_currency.toUpperCase()}
                                        />
                                    }
                                    options={coinCurrencies.map((item) => ({
                                        value: item.id,
                                        label: item.id.toUpperCase(),
                                        icon: <CryptoIcon className="label-icon" code={item.id.toUpperCase()} />
                                    }))}
                                    onChange={(value) => handleChangeForm("coin_currency", value)}
                                    error={errors.coin_currency}
                                />
                                {errors.coin_currency && <p className="text-error">{errors.coin_currency}</p>}
                                {coinCurrency ? (
                                    <div className="available-balance">
                                        <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.available" })}:</p>
                                        <span>{Decimal.format(balance, coinCurrency.precision, ",")}</span>
                                        <p>{formData.coin_currency.toUpperCase()}</p>
                                        <Link to={`/wallets/spot/${formData.coin_currency}/deposit`} className="deposit-link">
                                            <DepositPlusIcon />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="available-balance">
                                        <p>{intl.formatMessage({ id: "page.body.p2p.trade.create.balance" })}</p>
                                        <span>-.--</span>
                                    </div>
                                )}
                            </div>
                            <div className="p2pcreate-add__body__input themes">
                                <label>
                                    {intl.formatMessage({ id: "page.body.p2p.advertisement.content.withfiat" })}
                                </label>
                                <SelectP2PFilter
                                    searchAble
                                    value={formData.fiat_currency}
                                    suffixMarkup={intl.formatMessage({
                                        id: "page.body.p2p.advertisement.component.select_fiat",
                                    })}
                                    currentIcon={
                                        <CryptoIcon
                                            className="label-icon"
                                            code={formData.fiat_currency.toUpperCase()}
                                        />
                                    }
                                    options={fiatCurrencies.map((item) => ({
                                        value: item.id,
                                        label: item.id.toUpperCase(),
                                        icon: <CryptoIcon className="label-icon" code={item.id.toUpperCase()} />
                                    }))}
                                    onChange={(value) => handleChangeForm("fiat_currency", value)}
                                    error={errors.fiat_currency}
                                />
                                {errors.fiat_currency && <p className="text-error">{errors.fiat_currency}</p>}
                            </div>
                        </div>
                        <div className="p2pcreate-add__body__row">
                            <div className="p2pcreate-add__body__input">
                                <label>
                                    {intl.formatMessage({ id: "page.body.p2p.advertisement.content.amount" })}
                                </label>
                                <Input
                                    type="number"
                                    maxNumber={MAX_LIMIT_CURRENCY}
                                    value={`${formData.amount}`}
                                    onChange={(value) => handleChangeForm("amount", Number(value))}
                                    suffix={coinCurrency ? <span>{coinCurrency.id.toUpperCase()}</span> : null}
                                    error={errors.amount}
                                    selectOnFocus
                                    decimalScale={coinCurrency?.precision}
                                />
                                {errors.amount && <p className="text-error">{errors.amount}</p>}
                            </div>
                            <div className="p2pcreate-add__body__input">
                                <label>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.price" })}</label>
                                <Input
                                    type="number"
                                    maxNumber={MAX_LIMIT_CURRENCY}
                                    value={`${formData.price}`}
                                    onChange={(value) => handleChangeForm("price", Number(value))}
                                    suffix={fiatCurrency ? <span>{fiatCurrency.id.toUpperCase()}</span> : null}
                                    error={errors.price}
                                    selectOnFocus
                                />
                                {errors.price && <p className="text-error">{errors.price}</p>}
                            </div>
                        </div>
                        <div className="subtitle">
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.message.order_limit" })}
                        </div>
                        <div className="p2pcreate-add__body__row">
                            <div className="p2pcreate-add__body__input">
                                <Input
                                    type="number"
                                    maxNumber={MAX_LIMIT_CURRENCY}
                                    value={`${formData.min_amount}`}
                                    placeholder="0.00"
                                    onChange={(value) => handleChangeForm("min_amount", Number(value))}
                                    suffix={
                                        fiatCurrency ? (
                                            <React.Fragment>
                                                <p>
                                                    {intl.formatMessage({
                                                        id: "page.body.p2p.advertisement.content.min"
                                                    })}
                                                </p>{" "}
                                                <span>{fiatCurrency.id.toUpperCase()}</span>
                                            </React.Fragment>
                                        ) : null
                                    }
                                    error={errors.min_amount}
                                    selectOnFocus
                                />
                                {errors.min_amount && <p className="text-error">{errors.min_amount}</p>}
                            </div>
                            <div className="between"> ~ </div>
                            <div className="p2pcreate-add__body__input">
                                <Input
                                    type="number"
                                    maxNumber={MAX_LIMIT_CURRENCY}
                                    value={`${formData.max_amount}`}
                                    placeholder="0.00"
                                    onChange={(value) => handleChangeForm("max_amount", Number(value))}
                                    suffix={
                                        fiatCurrency ? (
                                            <React.Fragment>
                                                <p>
                                                    {intl.formatMessage({
                                                        id: "page.body.p2p.advertisement.content.max"
                                                    })}
                                                </p>{" "}
                                                <span>{fiatCurrency.id.toUpperCase()}</span>
                                            </React.Fragment>
                                        ) : null
                                    }
                                    error={errors.max_amount}
                                    selectOnFocus
                                />
                                {errors.max_amount && <p className="text-error">{errors.max_amount}</p>}
                            </div>
                        </div>
                        <div className="subtitle">
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.content.payment_method" })}
                        </div>
                        <div className="p2pcreate-add__body__info">
                            <p>
                                {intl.formatMessage({
                                    id: "page.body.p2p.advertisement.content.payment_method_description"
                                })}
                            </p>
                            {errors.payment_methods && <p className="text-error">{errors.payment_methods}</p>}
                        </div>
                        <div className="p2pcreate-add__body__row">
                            <div className="p2pcreate-add__payment-method-list">
                                {formData.payment_methods.length > 0 && (
                                    <React.Fragment>
                                        {filteredPaymentMethods.map((method, index) => {
                                            const isSelected = formData.payment_methods.includes(method);

                                            if (isSelected) {
                                                return (
                                                    <div key={index} className="p2pcreate-add__payment-method-list__addpay-result">
                                                        {method.account_name}
                                                        <IconButton 
                                                            onClick={() => {
                                                                setFormData((prevFormData) => {
                                                                    const updatedMethods =
                                                                        prevFormData.payment_methods.filter(
                                                                            (id) => id !== method
                                                                        );

                                                                    return {
                                                                        ...prevFormData,
                                                                        payment_methods: updatedMethods,
                                                                    };
                                                                });
                                                            }}
                                                            sx={{
                                                                color: 'var(--color-dark)',
                                                                '&:hover': {
                                                                    color: 'var(--color-danger)'
                                                                }
                                                            }}
                                                        >
                                                            <CloseIcon className="icon_closeed themes"/>
                                                        </IconButton>
                                                    </div>
                                                );
                                            }

                                            return null;
                                        })}
                                    </React.Fragment>
                                )}
                                {formData.payment_methods.length < 5 && (
                                    <Button
                                        className="small-button themes black"
                                        startIcon={<PlusIcon className="p2pcreate-add__add-payment-method-plus-icon" />}
                                        onClick={() => setShowPaymentModal(true)}>
                                        {intl.formatMessage({
                                            id: "page.body.p2p.advertisement.content.payment_method_add"
                                        })}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <CSSTransition
                            in={showPaymentModal}
                            timeout={{
                                enter: 100,
                                exit: 400
                            }}
                            unmountOnExit
                        >
                            <div className="themes p2p-modal modal-window">
                                <div className="modal-window__container scroll fadet">
                                    {renderHeader}
                                    {renderBody}
                                    {renderFooter}
                                </div>
                            </div>
                        </CSSTransition>
                        <div className="subtitle">
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.content.payment_time_limit" })}
                        </div>
                        <div className="p2pcreate-add__body__input paytime">
                            <SelectP2PFilter
                                searchAble={false}
                                suffixMarkup={intl.formatMessage({
                                    id: "page.body.p2p.advertisement.content.payment_time_limit.time"
                                })}
                                options={[
                                    { value: "10", label: "10 min" },
                                    { value: "15", label: "15 min" },
                                    { value: "30", label: "30 min" },
                                    { value: "45", label: "45 min" },
                                    { value: "60", label: "1 hr" },
                                    { value: "120", label: "2 hr" },
                                    { value: "180", label: "3 hr" },
                                ]}
                                value={`${formData.paytime}`}
                                onChange={(value) => handleChangeForm("paytime", Number(value))}
                                error={errors.paytime}
                            />
                            {errors.paytime && <p className="text-error">{errors.paytime}</p>}
                        </div>
                        <div className="subtitle">
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.content.remarks" })}
                        </div>
                        <TextArea
                            rows={4}
                            maxLength={255}
                            value={formData.description ?? ""}
                            placeholder={intl.formatMessage({
                                id: "page.body.p2p.advertisement.content.remarks.description"
                            })}
                            onChange={(value) => handleChangeForm("description", value)}
                            suffix={<div className="input-counter">{formData.description?.length ?? "0"} / {255}</div>}
                        />
                        {errors.description && <p className="text-error">{errors.description}</p>}
                        <div className="p2pcreate-add__footer">
                            <Button href="/p2p/all-adverts/" className="medium-button themes black">
                                {intl.formatMessage({ id: "page.body.p2p.create.offer.cancel" })}
                            </Button>
                            <Button disabled={!isFormDirty()} onClick={handleSubmit} className="medium-button themes">
                                {intl.formatMessage({ id: "page.body.p2p.advertisement.action.create" })}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
/*<Input
    type="number"
    maxNumber={60}
    minNumber={0}
    value={`${formData.paytime}`}
    placeholder="00"
    onChange={(value) => handleChangeForm("paytime", Number(value))}
    error={errors.paytime}
    selectOnFocus
/>*/
