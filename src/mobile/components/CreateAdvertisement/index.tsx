import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { P2PAdvertisementCreateRequest, p2pCreateAdvertisementFetch } from "../../../modules/user/p2pAdvertisement";
import { alertPush, currenciesFetch, selectCurrencies, selectWallets } from "../../../modules";
import SelectP2PFilter from "../../../components/SelectP2PFilter";
import Input from "../../../components/SelectP2PFilter/Input";
import { MAX_LIMIT_CURRENCY } from "../../../modules/constant";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { formatNumber } from "../../../components/P2PTrading/Utils";
import TextArea from "../../../components/SelectP2PFilter/TextArea";

const defaultFormValue: P2PAdvertisementCreateRequest = {
    side: "buy",
    coin_currency: "",
    fiat_currency: "",
    price: 0,
    amount: 0,
    min_amount: 0,
    max_amount: 0,
    paytime: 15,
    payment_methods: [],
}

export default function CreateAdvertisement() {
    const [formData, setFormData] = useState<P2PAdvertisementCreateRequest>(defaultFormValue);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();
    const intl = useIntl();

    const currencies = useSelector(selectCurrencies);
    const wallets = useSelector(selectWallets);
    const balance = !!formData.coin_currency ? Number(wallets.find(item => item.currency === formData.coin_currency)?.balance ?? 0) : 0;

    useEffect(() => {
        dispatch(currenciesFetch());
    }, []);

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
        if (data.paytime < 0 || data.paytime > 180) {
            _errors.paytime = intl.formatMessage({ id: "page.body.p2p.advertisement.message.invalid_paytime" });
        }
        setErrors(_errors);
        return _errors;
    };

    const handleSubmit = async () => {
        const _errors = validate();
        setIsSubmitted(true);
        if (Object.keys(_errors).length > 0) {
            dispatch(alertPush({ message: [_errors[Object.keys(_errors)[0]]], type: 'error' }));
            return;
        }
        dispatch(p2pCreateAdvertisementFetch(formData));
        history.push("/p2p/myads");
    };

    const coinCurrencies = currencies.filter((currency) => currency.type === "coin");
    const fiatCurrencies = currencies.filter((currency) => currency.type === "fiat");

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

    const fiatCurrency = fiatCurrencies.find((currency) => currency.id === formData.fiat_currency);
    const coinCurrency = coinCurrencies.find((currency) => currency.id === formData.coin_currency);

    return (
        <div className="pg-create-advertisement-screen">
            <div className="w-full flex flex-col gap-5 p-4">
                <div>
                    <p className="text-2xl font-semibold">{intl.formatMessage({ id: "page.body.p2p.advertisement.action.new_ads" })}</p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="w-full flex gap-2 items-center text-white">
                        <button onClick={() => handleChangeForm("side", "buy")} className={`${formData.side === "buy" ? "bg-green-500" : "bg-gray-500 hover:bg-gray-400"} w-1/2 outline-unset px-3 py-2 rounded-sm`}>Buy</button>
                        <button onClick={() => handleChangeForm("side", "sell")} className={`${formData.side === "sell" ? "bg-red-500" : "bg-gray-500 hover:bg-gray-400"} w-1/2 outline-unset px-3 py-2 rounded-sm`}>Sell</button>
                    </div>
                    <div className="w-full form-container-mobile">
                        <div>
                            <p className="text-normal">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.coin" })}</p>
                            <SelectP2PFilter
                                searchAble
                                value={formData.coin_currency}
                                placeholder={intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_coin" })}
                                options={coinCurrencies.map((item) => ({ value: item.id, label: item.id.toUpperCase() }))}
                                onChange={(value) => handleChangeForm("coin_currency", value)}
                                error={errors.coin_currency}
                            />
                            {errors.coin_currency && <p className="text-sm text-red-500">{errors.coin_currency}</p>}
                        </div>
                        <div>
                            <p className="text-normal">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.fiat" })}</p>
                            <SelectP2PFilter
                                searchAble
                                value={formData.fiat_currency}
                                placeholder={intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_fiat" })}
                                options={fiatCurrencies.map((item) => ({ value: item.id, label: item.id.toUpperCase() }))}
                                onChange={(value) => handleChangeForm("fiat_currency", value)}
                                error={errors.fiat_currency}
                            />
                            {errors.fiat_currency && <p className="text-sm text-red-500">{errors.fiat_currency}</p>}
                        </div>
                        <div>
                            <p className="text-normal">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.price" })}</p>
                            <Input
                                type="number"
                                maxNumber={MAX_LIMIT_CURRENCY}
                                value={`${formData.price}`}
                                placeholder="0.00"
                                onChange={(value) => handleChangeForm("price", Number(value))}
                                suffix={fiatCurrency ? <div className="pr-2">{fiatCurrency.id.toUpperCase()}</div> : null}
                                error={errors.price}
                                selectOnFocus
                            />
                            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                        </div>
                        <div>
                            <div className="flex justify-between">
                                <p className="text-normal">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.amount" })}</p>
                                {coinCurrency ? <p className="text-normal">{intl.formatMessage({ id: "page.body.p2p.trade.create.balance" })}: {formatNumber(balance)}</p> : <div />}
                            </div>
                            <Input
                                type="number"
                                maxNumber={MAX_LIMIT_CURRENCY}
                                value={`${formData.amount}`}
                                placeholder="0.00"
                                onChange={(value) => handleChangeForm("amount", Number(value))}
                                suffix={coinCurrency ? <div className="pr-2">{coinCurrency.id.toUpperCase()}</div> : null}
                                error={errors.amount}
                                selectOnFocus
                            />
                            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                        </div>
                        <div>
                            <p className="text-normal">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.min" })}</p>
                            <Input
                                type="number"
                                maxNumber={MAX_LIMIT_CURRENCY}
                                value={`${formData.min_amount}`}
                                placeholder="0.00"
                                onChange={(value) => handleChangeForm("min_amount", Number(value))}
                                suffix={coinCurrency ? <div className="pr-2">{coinCurrency.id.toUpperCase()}</div> : null}
                                error={errors.min_amount}
                                selectOnFocus
                            />
                            {errors.min_amount && <p className="text-sm text-red-500">{errors.min_amount}</p>}
                        </div>
                        <div>
                            <p className="text-normal">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.max" })}</p>
                            <Input
                                type="number"
                                maxNumber={MAX_LIMIT_CURRENCY}
                                value={`${formData.max_amount}`}
                                placeholder="0.00"
                                onChange={(value) => handleChangeForm("max_amount", Number(value))}
                                suffix={coinCurrency ? <div className="pr-2">{coinCurrency.id.toUpperCase()}</div> : null}
                                error={errors.max_amount}
                                selectOnFocus
                            />
                            {errors.max_amount && <p className="text-sm text-red-500">{errors.max_amount}</p>}
                        </div>
                        <div>
                            <p className="text-normal">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.payment_time_limit" })} (min)</p>
                            <Input
                                type="number"
                                maxNumber={180}
                                minNumber={0}
                                value={`${formData.paytime}`}
                                placeholder="00"
                                onChange={(value) => handleChangeForm("paytime", Number(value))}
                                error={errors.paytime}
                                selectOnFocus
                            />
                            {errors.paytime && <p className="text-sm text-red-500">{errors.paytime}</p>}
                        </div>
                    </div>
                    <div>
                            <p className="text-normal">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.description" })}</p>
                            <TextArea
                                rows={4}
                                maxLength={255}
                                value={formData.description ?? ""}
                                placeholder="Type description"
                                onChange={(value) => handleChangeForm("description", value)}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>
                    <div className="flex justify-end gap-5">
                        <Link to="/p2p" className="border-slim outline-unset border-gray-600 px-3 py-1 hover:text-white hover:border-white transition-all"
                        >
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.action.cancel" })}
                        </Link>
                        <button
                            disabled={!isFormDirty()}
                            onClick={handleSubmit}
                            className="btn-submit transition-all">
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.action.create" })}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}