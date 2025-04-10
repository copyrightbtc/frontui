import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Advertisement } from "../../../modules/public/advertisement";
import { P2PTradeCreate } from "../../../modules/user/p2pTrade/types";
import { useDispatch, useSelector } from "react-redux";
import { paymentsFetch, selectPayments, selectWallets } from "../../../modules";
import { MAX_LIMIT_CURRENCY } from "../../../modules/constant";
import Input from "../../../components/SelectP2PFilter/Input";
import SelectP2PFilter from "../../../components/SelectP2PFilter";
import { formatNumber } from "../../../components/P2PTrading/Utils";

interface Props {
    advertisement: Advertisement
    onClose: () => void
    onSubmit: (data: P2PTradeCreate) => void
}

export const CreateTrade = ({ advertisement, onClose, onSubmit }: Props) => {
    const [formData, setFormData] = useState<{ trade?: number, receive?: number, payment_method?: number }>({});
    const [error, setError] = useState<{ trade?: string, receive?: string, payment_method?: string }>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const dispatch = useDispatch();
    const userPayments = useSelector(selectPayments);

    const intl = useIntl();
    const wallets = useSelector(selectWallets);
    const advertiser = advertisement.advertiser;
    const avtChar = advertiser?.username.charAt(0).toUpperCase();
    const isBuy = advertisement.side === "sell";
    const payments = isBuy ? advertisement.payments : userPayments;
    const coinWallet = wallets.find(item => item.currency === advertisement.coin_currency);

    useEffect(() => {
        if (!payments.length) {
            dispatch(paymentsFetch({ page: 1, limit: 250 }));
        }
    }, [payments])


    const validateError = (data: { trade?: number, receive?: number, payment_method?: number } = formData, _isSubmitted = isSubmitted) => {
        const _error = {} as { trade?: string, receive?: string, payment_method?: string };
        if (_isSubmitted) {
            if (!data.payment_method || data.payment_method <= 0) {
                _error.payment_method = intl.formatMessage({ id: "page.body.p2p.trade.message.payment_required" });
            }
        }
        if (!isBuy && (data.trade ?? 0) > Number(coinWallet?.balance ?? 0)) {
            _error.trade = intl.formatMessage({ id: "page.body.p2p.trade.message.insufficient_balance" });
        }
        const limitData = isBuy ? data.receive : data.trade;
        if ((limitData ?? 0) > Number(advertisement.max_amount) || (limitData ?? 0) < Number(advertisement.min_amount)) {
            _error[isBuy ? "receive" : "trade"] = `${intl.formatMessage({ id: "page.body.p2p.trade.message.order_limit" })}: ${advertisement.min_amount} - ${advertisement.max_amount}`;
        }
        setError(_error);
        return _error;
    }

    const onSetMax = () => {
        if (isBuy) {
            onChangeData("trade", Math.round(Number(advertisement.max_amount) * Number(advertisement.price)));
        } else {
            onChangeData("trade", (coinWallet?.balance ?? 0));
        }
    }

    const onChangeData = (field: keyof typeof formData, data: any) => {
        const _formData = { ...formData, [field]: data };
        if (field === "trade") {
            if (isBuy) {
                _formData.receive = Math.round(Number(data) / Number(advertisement.price));
            } else {
                _formData.receive = Math.round(Number(data) * Number(advertisement.price));
            }
        }
        if (field === "receive") {
            if (isBuy) {
                _formData.trade = Math.round(Number(data) * Number(advertisement.price));
            } else {
                _formData.trade = Math.round(Number(data) / Number(advertisement.price));
            }
        }
        validateError(_formData);
        setFormData(_formData);
    }

    const handleSubmit = () => {
        const _error = validateError(formData, true);
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


    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                    <div className="w-12 h-12 p-3 flex items-center justify-center bg-white rounded-full text-4xl text-gray-500">{avtChar}</div>
                    <div className="flex flex-col">
                        <p className="font-semibold text-white">{advertiser?.username ?? ""}</p>
                        <p className="text-gray-400">{advertiser.trades_count_30d} {intl.formatMessage({ id: "page.body.p2p.advertisement.content.orders" })}(30d)</p>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="flex flex-col gap-1">
                        <p className="font-semibold text-white">{advertisement.paytime} min</p>
                        <p className="text-gray-400">{intl.formatMessage({ id: "page.body.p2p.trade.create.payment_limit" })}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="font-semibold text-white">{advertisement.amount} {advertisement.coin_currency.toUpperCase()}</p>
                        <p className="text-gray-400">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.available" })}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-gray-400">{intl.formatMessage({ id: "page.body.p2p.trade.create.desc" })}</p>
                    <p className="text-gray-400 max-h-20 overflow-auto">{advertisement.description ?? ""}</p>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <p className="text-gray-400">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.price" })} <span className="font-semibold text-white">{formatNumber(advertisement.price)} {advertisement.coin_currency.toUpperCase()}</span></p>
                <div>
                    <p>{isBuy ? intl.formatMessage({ id: "page.body.p2p.trade.create.pay" }) : intl.formatMessage({ id: "page.body.p2p.trade.create.sell" })}</p>
                    <Input
                        type="number"
                        value={`${formData.trade ?? ""}`}
                        onChange={(data) => onChangeData("trade", data)}
                        maxNumber={MAX_LIMIT_CURRENCY}
                        placeholder={!isBuy ? `${advertisement.min_amount} - ${advertisement.max_amount}` : "0.00"}
                        suffix={<div className="flex items-center gap-2 pr-2">
                            <button className="outline-unset text-yellow-300 hover:text-yellow-200" onClick={onSetMax}>Max</button>
                            <p>{isBuy ? advertisement.fiat_currency.toUpperCase() : advertisement.coin_currency.toUpperCase()}</p>
                        </div>}
                        error={error.trade}
                    />
                    {error.trade ? <p className="text-sm text-red-500">{error.trade}</p>
                        : !isBuy ? <p className="text-sm text-gray-400">{intl.formatMessage({ id: "page.body.p2p.trade.create.balance" })}: {formatNumber(coinWallet?.balance ?? 0)} {(coinWallet?.currency ?? "").toUpperCase()}</p>
                            : null}
                </div>
                <div>
                    <p>{intl.formatMessage({ id: "page.body.p2p.trade.create.receive" })}</p>
                    <Input
                        type="number"
                        maxNumber={MAX_LIMIT_CURRENCY}
                        value={`${formData.receive ?? ""}`}
                        placeholder={isBuy ? `${formatNumber(advertisement.min_amount)} - ${formatNumber(advertisement.max_amount)}` : "0.00"}
                        suffix={<div className="pr-2">{isBuy ? advertisement.coin_currency.toUpperCase() : advertisement.fiat_currency.toUpperCase()}</div>}
                        onChange={(data) => onChangeData("receive", data)}
                        error={error.receive}
                    />
                    {error.receive && <p className="text-sm text-red-500">{error.receive}</p>}
                </div>
                <div>
                    <p>{intl.formatMessage({ id: "page.body.p2p.trade.create.payments" })}</p>
                    <SelectP2PFilter
                        searchAble
                        value={`${formData.payment_method ?? ""}`}
                        placeholder={intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_payment" })}
                        onChange={(value: string) => onChangeData("payment_method", Number(value))}
                        options={payments.map((item) => ({ value: `${item.id}`, label: `${item.payment_type} - ${item.account_name}` }))}
                        error={error.payment_method}
                    />
                    {error.payment_method && <p className="text-sm text-red-500">{error.payment_method}</p>}
                </div>
            </div>
            <div className="flex gap-3 w-full justify-end">
                <button className="btn-normal" onClick={onClose}>{intl.formatMessage({ id: "page.body.p2p.trade.create.close" })}</button>
                <button
                    disabled={!isFormDirty()}
                    onClick={handleSubmit}
                    className={`btn-trade ${isBuy ? "buy" : "sell"}`}
                >
                    {isBuy ? intl.formatMessage({ id: "page.body.p2p.advertisement.content.buy" }) : intl.formatMessage({ id: "page.body.p2p.advertisement.content.sell" })} {advertisement.coin_currency.toUpperCase()}
                </button>
            </div>
        </div>
    );
}