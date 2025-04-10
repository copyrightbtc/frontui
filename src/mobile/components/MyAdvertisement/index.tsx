import React from "react";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClockIcon } from "../../assets/images/ClockIcon";
import { FillSpinner } from "react-spinners-kit";
import { NoResultData } from 'src/components';
import Pagination from "../../../components/P2PTrading/Pagination";
import { formatNumber } from '../../../components/P2PTrading/Utils';
import { alertPush, RootState, selectUserInfo, selectWallets } from "../../../modules";
import { AdvertisementFilter } from "../../../modules/public/advertisement";
import { Modal } from "../../../components";
import { P2PAdvertisement, p2pAdvertisementAmountChangeFetch, p2pAdvertisementPriceChangeFetch, p2pAdvertisementStateChangeFetch, p2pAdvertisementsFetch, p2pDeleteAdvertisementFetch } from "../../../modules/user/p2pAdvertisement";
import { useIntl } from "react-intl";
import Input from "../../../components/SelectP2PFilter/Input";
import { MAX_LIMIT_CURRENCY } from "../../../modules/constant";
import UpdateP2PAdsModal from "../../../components/UpdateP2PAdsModal";

const limit = 25;

const MyAdvertisementComponent = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const [filter, setFilter] = useState<AdvertisementFilter>({
        side: "buy",
        page: 1,
    });
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [confirmClose, setConfirmClose] = useState<number | null>(null);
    const [priceChange, setPriceChange] = useState<number | null>(null);
    const [openDrillDownPrice, setOpenDrillDownPrice] = useState<number | null>(null);
    const [changeAmount, setChangeAmount] = useState<{
        amount: number;
        type: "sub" | "plus";
    }>({ amount: 0, type: "plus" });
    const [openDrillDownAmount, setOpenDrillDownAmount] = useState<number | null>(null);
    const [openEdit, setOpenEdit] = useState<P2PAdvertisement | null>(null);

    const advertisements = useSelector((state: RootState) => state.user.p2pAdvertisements);
    const user = useSelector(selectUserInfo);
    const wallets = useSelector(selectWallets);

    useEffect(() => {
        if (user) {
            setFilter((prev) => ({ ...prev, uid: user.uid }));
        }
    }, [user]);

    useEffect(() => {
        dispatch(p2pAdvertisementsFetch({ ...filter, limit }));
    }, [dispatch, filter]);

    const deleteAdvertisement = async (id: number) => {
        dispatch(p2pDeleteAdvertisementFetch(id));
        setConfirmDelete(null);
    }

    const handleOpenConfirmClose = (id: number) => {
        const ads = advertisements.list.find(item => item.id === id);
        if (!ads || ads.state !== "active") return;
        setConfirmClose(id);
    }

    const changeState = async (id: number, action: "enable" | "disable") => {
        const ads = advertisements.list.find(item => item.id === id);
        if (!ads || (action === "enable" && ads.state !== "disabled") || (action === "disable" && ads.state !== "active")) return;
        dispatch(p2pAdvertisementStateChangeFetch({ id, action }));
        setConfirmClose(null);
    }

    const onChangeFilter = (field: keyof AdvertisementFilter, value: any) => {
        setFilter({
            ...filter,
            [field]: value,
        });
    }

    const handleOpenDrillDownPrice = (id: number, price: number) => {
        setOpenDrillDownPrice(id);
        setPriceChange(price);
    }

    const handleOpenDrillDownAmount = (id: number, type: "sub" | "plus") => {
        setOpenDrillDownAmount(id);
        setChangeAmount({ amount: 0, type });
    }

    const closeDrillDown = () => {
        setOpenDrillDownPrice(null);
        setOpenDrillDownAmount(null);
    }

    const submitPrice = () => {
        if (openDrillDownPrice && priceChange) {
            dispatch(p2pAdvertisementPriceChangeFetch({ id: openDrillDownPrice, price: priceChange }));
        }
        closeDrillDown();
    }
    const validateChangeAmount = (_type: "plus" | "sub", value: number) => {
        const ads = advertisements.list.find(item => item.id === openDrillDownAmount);
        if (!ads) return undefined;

        const coinCurrency = ads.coin_currency ?? "";
        const balance = Number(wallets.find(item => item.currency === coinCurrency)?.balance ?? "0");
        const currentAmount = ads.amount ?? "0";
        const newAmount = _type === "plus" ? Number(currentAmount) + value : Number(currentAmount) - value

        let error: string | undefined = undefined;
        if (ads.side === "sell" && _type === "plus" && value > 0 && newAmount > balance) {
            error = intl.formatMessage({ id: "page.body.p2p.trade.message.insufficient_balance" });
        }
        if (_type === "sub") {
            if (value >= Number(currentAmount)) {
                error = intl.formatMessage({ id: "page.body.p2p.advertisement.message.invalid_amount" });
            }
            if ((newAmount ?? 0) < Number(ads.max_amount)) {
                error = intl.formatMessage({ id: "page.body.p2p.advertisement.message.amount_limit" });
            }
        }
        return error;
    }
    const submitAmount = () => {
        if (openDrillDownAmount && changeAmount.amount) {
            const error = validateChangeAmount(changeAmount.type, changeAmount.amount);
            if (!!error) {
                dispatch(alertPush({ message: [error], type: 'error' }));
                return;
            };
            dispatch(p2pAdvertisementAmountChangeFetch({ id: openDrillDownAmount, amount: changeAmount.amount, type: changeAmount.type }));
        }
        closeDrillDown();
    }

    const renderChangePrice = () => {
        const ads = advertisements.list.find(item => item.id === openDrillDownPrice);
        if (!ads) return null;

        return (
            <div className="w-full flex justify-between gap-3">
                <div style={{ maxWidth: 250 }}>
                    <p className="text-gray-300 text-sm">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.price" })}</p>
                    <Input
                        selectOnFocus
                        type="number"
                        maxNumber={MAX_LIMIT_CURRENCY}
                        value={`${priceChange ?? ""}`}
                        onChange={(v) => setPriceChange(Number(v))}
                        placeholder={"0.00"}
                        suffix={<div className="pr-2">{ads.fiat_currency.toUpperCase()}</div>}
                    />
                </div>
                <div className="flex gap-2 items-end">
                    <button onClick={() => closeDrillDown()} className="btn-normal">{intl.formatMessage({ id: "page.body.p2p.advertisement.action.cancel" })}</button>
                    <button disabled={priceChange === Number(ads.price)} onClick={() => submitPrice()} className="btn-submit">{intl.formatMessage({ id: "page.body.p2p.advertisement.action.apply" })}</button>
                </div>
            </div>
        )
    }

    const renderChangeAmount = () => {
        if (!changeAmount) return null;
        const ads = advertisements.list.find(item => item.id === openDrillDownAmount);
        if (!ads) return null;
        const currentAmount = ads.amount ?? "0";
        const newAmount = changeAmount.type === "plus" ? Number(currentAmount) + changeAmount.amount : Number(currentAmount) - changeAmount.amount
        const balance = Number(wallets.find(item => item.currency === ads.coin_currency)?.balance ?? "0");

        const error = validateChangeAmount(changeAmount.type, changeAmount.amount);
        return (
            <div className="w-full flex justify-between gap-3">
                <div className="flex flex-col gap-2">
                    <div>
                        <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.amount" })}: {formatNumber(newAmount)} {ads.coin_currency.toUpperCase()}</p>
                    </div>
                    <div style={{ maxWidth: 250 }}>
                        <div className="w-full flex justify-between">
                            <p className="text-gray-300 text-sm">
                                {changeAmount.type === "plus" ?
                                    intl.formatMessage({ id: "page.body.p2p.advertisement.action.plus_amount" })
                                    : intl.formatMessage({ id: "page.body.p2p.advertisement.action.sub_amount" })}
                            </p>
                            {ads.side === "sell" ? <p className="text-gray-300 text-sm">{intl.formatMessage({ id: "page.body.p2p.trade.create.balance" })}: {formatNumber(balance)}</p> : <div />}
                        </div>
                        <Input
                            selectOnFocus
                            type="number"
                            maxNumber={MAX_LIMIT_CURRENCY}
                            value={`${changeAmount.amount}`}
                            onChange={(v) => setChangeAmount((prev) => ({ ...prev, amount: Number(v) }))}
                            suffix={<div className="pr-2">{ads.coin_currency.toUpperCase()}</div>}
                            placeholder={"0.00"}
                            error={error}
                        />
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                    </div>
                </div>
                <div className="flex items-end gap-2">
                    <button onClick={() => closeDrillDown()} className="btn-normal">{intl.formatMessage({ id: "page.body.p2p.advertisement.action.cancel" })}</button>
                    <button disabled={!changeAmount.amount} onClick={() => submitAmount()} className="btn-submit">{intl.formatMessage({ id: "page.body.p2p.advertisement.action.apply" })}</button>
                </div>
            </div>
        )
    }

    const filterMarkup = (
        <div className="flex items-center p-3">
            <button onClick={() => onChangeFilter("side", "buy")} className={`btn-trade-option ${filter.side === "buy" ? "active" : ""}`}
            >
                {intl.formatMessage({ id: "page.body.p2p.advertisement.content.buy" }).toUpperCase()}
            </button>
            <button onClick={() => onChangeFilter("side", "sell")} className={`btn-trade-option ${filter.side === "sell" ? "active" : ""}`}
            >
                {intl.formatMessage({ id: "page.body.p2p.advertisement.content.sell" }).toUpperCase()}
            </button>
        </div>
    )

    const tableMarkup = (
        <table className="p2p-table text-white">
            <thead>
                <tr>
                    <th className="text-lg">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.advertisements" })}</th>
                </tr>
            </thead>
            <tbody>
                {advertisements.list.map((offer, index) => {
                    const isOpenDrillDownPrice = openDrillDownPrice === offer.id;
                    const isOpenDrillDownAmount = openDrillDownAmount === offer.id;
                    const isOpenDrillDown = isOpenDrillDownPrice || isOpenDrillDownAmount;
                    return (
                        <tr key={index}>
                            {isOpenDrillDown ? (
                                <td colSpan={2}>
                                    <div className="flex flex-col gap-3">
                                        <p className="font-semibold text-trade">{offer.coin_currency.toUpperCase()}</p>
                                        {isOpenDrillDownPrice && renderChangePrice()}
                                        {isOpenDrillDownAmount && renderChangeAmount()}
                                    </div>
                                </td>
                            ) : (

                                <>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <p className="font-semibold text-trade">{offer.coin_currency.toUpperCase()}</p>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex gap-2">
                                                    <p className="font-semibold text-trade">{formatNumber(offer.price)} {offer.fiat_currency.toUpperCase()}</p>
                                                    {offer.lock_trade_amount > 0 ? <div /> : (
                                                        <button
                                                            onClick={() => handleOpenDrillDownPrice(offer.id, Number(offer.price))}
                                                            className="btn-plain"
                                                        >
                                                            {intl.formatMessage({ id: "page.body.p2p.advertisement.action.edit" })}
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="flex gap-1 items-center text-gray-300"><ClockIcon />15 min</p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex gap-2 items-center">
                                                    <p>
                                                        <span className="font-light">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.available" })}</span>
                                                        : {formatNumber(offer.amount)} {offer.coin_currency.toUpperCase()}
                                                    </p>
                                                    {offer.lock_trade_amount > 0 ? <div /> : (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleOpenDrillDownAmount(offer.id, "sub")}
                                                                className="amount-change amount-change__left"
                                                            >
                                                                -
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenDrillDownAmount(offer.id, "plus")}
                                                                className="amount-change amount-change__right"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p>
                                                    <span className="font-light">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.limit" })}</span>
                                                    : {formatNumber(offer.min_amount)} - {formatNumber(offer.max_amount)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        {offer.lock_trade_amount > 0 ? <div /> : (
                                            <div className="flex flex-col justify-between items-end gap-3">
                                                <div className="switch justify-center">
                                                    <button
                                                        onClick={() => changeState(offer.id, "enable")}
                                                        className={`bg-green-500 px-3 py-1 ${offer.state === "active" ? "active" : ""}`}
                                                    >
                                                        {intl.formatMessage({ id: "page.body.p2p.advertisement.action.open" })}
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenConfirmClose(offer.id)}
                                                        className={`bg-red-500 px-3 py-1 ${offer.state === "disabled" ? "active" : ""}`}
                                                    >
                                                        {intl.formatMessage({ id: "page.body.p2p.advertisement.action.close" })}
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => setOpenEdit(offer)}
                                                    className="border-slim border-gray-500 hover:border-gray-700 outline-unset transition-all px-3 py-1"
                                                >
                                                    {intl.formatMessage({ id: "page.body.p2p.advertisement.action.update" })}
                                                </button>
                                                {offer.state === "disabled" ? (
                                                    <button
                                                        className="border-slim border-red-500 hover:border-red-700 outline-unset transition-all px-3 py-1"
                                                        onClick={() => setConfirmDelete(offer.id)}
                                                    >
                                                        {intl.formatMessage({ id: "page.body.p2p.advertisement.action.delete" })}
                                                    </button>
                                                ) : <div />}
                                            </div>
                                        )}
                                    </td>
                                </>

                            )}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )

    return (
        <div className="p2p-mobile-screen flex flex-col">
            {filterMarkup}
            <div className="w-full flex flex-col px-3">
                {advertisements.loading ? <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div> : advertisements.list.length > 0 ? tableMarkup : <NoResultData class="themes"/>}
                <div className="p-4">
                    <Pagination onlyNextPrev isEndOfData={advertisements.list.length < limit} currentPage={filter.page ?? 1} totalPages={1} onPageChange={(value) => onChangeFilter("page", value)} />
                </div>
            </div>
            {confirmDelete !== null ?
                <Modal
                    show
                    header={<p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.delete_ads" })}</p>}
                    content={<p className="p-4">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.confirm_delete_ads" })}</p>}
                    footer={(
                        <div className="w-full flex justify-end items-center gap-4 px-4">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-3 py-1 border-slim border-gray-400 hover:border-gray-200 outline-unset"
                            >
                                {intl.formatMessage({ id: "page.body.p2p.advertisement.action.cancel" })}
                            </button>
                            <button
                                onClick={() => deleteAdvertisement(confirmDelete)}
                                className="px-3 py-1 border-slim border-red-500 hover:border-red-700 outline-unset"
                            >
                                {intl.formatMessage({ id: "page.body.p2p.advertisement.action.delete" })}
                            </button>
                        </div>
                    )}
                /> : null
            }
            {confirmClose !== null ?
                <Modal
                    show
                    header={<p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.close_ads" })}</p>}
                    content={<p className="p-4">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.confirm_close_ads" })}</p>}
                    footer={(
                        <div className="w-full flex justify-end items-center gap-4 px-4">
                            <button
                                onClick={() => setConfirmClose(null)}
                                className="px-3 py-1 border-slim border-gray-400 hover:border-gray-200 outline-unset"
                            >
                                {intl.formatMessage({ id: "page.body.p2p.advertisement.action.cancel" })}
                            </button>
                            <button
                                onClick={() => changeState(confirmClose, "disable")}
                                className="px-3 py-1 border-slim border-red-500 hover:border-red-700 outline-unset"
                            >
                                {intl.formatMessage({ id: "page.body.p2p.advertisement.action.close" })}
                            </button>
                        </div>
                    )}
                /> : null
            }
            {openEdit != null ?
                <UpdateP2PAdsModal onClose={() => setOpenEdit(null)} advertisement={openEdit} />
                : null}
        </div >
    );
};


export const MyAdvertisement = memo(MyAdvertisementComponent)