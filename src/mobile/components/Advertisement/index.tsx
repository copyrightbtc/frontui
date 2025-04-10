import React from "react";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { ClockTimerIcon } from "../../../assets/images/ClockTimerIcon";
import { FillSpinner } from "react-spinners-kit";
import { NoResultData } from 'src/components';
import Pagination from "../../../components/P2PTrading/Pagination";
import SelectP2PFilter from "../../../components/SelectP2PFilter";
import { formatNumber } from "../../../components/P2PTrading/Utils";
import { RootState, currenciesFetch, selectCurrencies, selectCurrenciesLoading, selectP2PTradeCreateResult, selectUserInfo, selectUserLoggedIn } from "../../../modules";
import { AdvertisementFilter, advertisementsFetch } from "../../../modules/public/advertisement";
import { CreateTrade } from "./CreateTrade";
import { P2PTradeCreate } from "../../../modules/user/p2pTrade/types";
import { p2pTradeCreateFetch, p2pTradeCreateHandleFinish } from '../../../modules/user/p2pTrade/actions';
import { useIntl } from "react-intl";
import { AdvertisementMenu } from "src/containers";

const limit = 25;

const AdvertisementComponent = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();
    const [filter, setFilter] = useState<AdvertisementFilter>({
        fiat_currency: "",
        coin_currency: "",
        side: "sell",
        page: 1,
    });
    const [openDrillDown, setOpenDrillDown] = useState<number | null>(null);


    const user = useSelector(selectUserInfo);
    const isLoggedIn = useSelector(selectUserLoggedIn);
    const advertisements = useSelector((state: RootState) => state.public.advertisements);
    const p2pTradeCreateResult = useSelector(selectP2PTradeCreateResult);
    const [currencies, currencyLoading] = [useSelector(selectCurrencies), useSelector(selectCurrenciesLoading)];

    useEffect(() => {
        dispatch(currenciesFetch());
    }, [dispatch]);

    useEffect(() => {
        if (filter.coin_currency?.length && filter.fiat_currency?.length) {
            dispatch(advertisementsFetch({ ...filter, limit, }));
        }
    }, [dispatch, filter, currencyLoading]);

    useEffect(() => {
        if (!currencyLoading && currencies.length) {
            setFilter((prev) => ({
                ...prev,
                fiat_currency: currencies.filter((currency) => currency.type === "fiat")[0]?.id,
                coin_currency: currencies.filter((currency) => currency.type === "coin")[0]?.id,
            }))
        }
    }, [currencies, currencyLoading]);

    useEffect(() => {
        if (p2pTradeCreateResult.success && p2pTradeCreateResult.tid) {
            dispatch(p2pTradeCreateHandleFinish(p2pTradeCreateResult.tid));
            history.push(`/p2p/trade/info/${p2pTradeCreateResult.tid}`);
        }
    }, [p2pTradeCreateResult])

    const onChangeFilter = (field: keyof AdvertisementFilter, value: any) => {
        setFilter({
            ...filter,
            [field]: value,
        });
    }

    const coinCurrencies = currencies.filter((currency) => currency.type === "coin");
    const fiatCurrencies = currencies.filter((currency) => currency.type === "fiat");

    const closeDrillDown = () => {
        setOpenDrillDown(null);
    }


    const submitTrade = (data: P2PTradeCreate) => {
        dispatch(p2pTradeCreateFetch(data));
        closeDrillDown();
    }

    const renderTradeDrillDown = () => {
        if (!openDrillDown) return null;
        const offer = advertisements.list.find((item) => item.id === openDrillDown);
        if (!offer) return null;
        return (
            <td colSpan={2}>
                <CreateTrade advertisement={offer} onClose={closeDrillDown} onSubmit={submitTrade} />
            </td>
        )
    }

    const bannerMarkup = isLoggedIn ? null : (
        <div className="w-screen bg-gray-600 center-all p-10 gap-7 text-white flex-col">
            <p className="text-xl font-semibold text-center">
                {intl.formatMessage({ id: "page.body.p2p.advertisement.content.register_banner" })}
            </p>
        </div>
    );

    const filterMarkup = (
        <div className="flex flex-col gap-4 font-semibold p-3">
            <div className="flex items-center">
                <button onClick={() => onChangeFilter("side", "sell")} className={`btn-trade-option ${filter.side === "sell" ? "active" : ""}`}
                >
                    {intl.formatMessage({ id: "page.body.p2p.advertisement.content.buy" }).toUpperCase()}
                </button>
                <button onClick={() => onChangeFilter("side", "buy")} className={`btn-trade-option ${filter.side === "buy" ? "active" : ""}`}
                >
                    {intl.formatMessage({ id: "page.body.p2p.advertisement.content.sell" }).toUpperCase()}
                </button>
            </div>
            <div className="flex items-center gap-3">
                <div>
                    <p className="font-normal text-sm">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.coin" })}</p>
                    <SelectP2PFilter
                        fixedWidth={200}
                        searchAble
                        placeholder={intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_coin" })}
                        value={filter.coin_currency}
                        onChange={value => onChangeFilter("coin_currency", value)}
                        options={coinCurrencies.map((item) => ({ value: item.id, label: item.id.toUpperCase() }))}
                    />
                </div>
                <div>
                    <p className="font-normal text-sm">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.fiat" })}</p>
                    <SelectP2PFilter
                        searchAble
                        fixedWidth={200}
                        placeholder={intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_fiat" })}
                        value={filter.fiat_currency}
                        onChange={value => onChangeFilter("fiat_currency", value)}
                        options={fiatCurrencies.map(currency => ({ label: currency.id.toUpperCase(), value: currency.id }))}
                    />
                </div>
            </div>
        </div>
    )

    const tableMarkup = (
        <table className="p2p-table text-white">
            <tbody>
                {advertisements.list.map((offer, index) => {
                    const isBuy = offer.side === "sell";
                    const isOpenDillDown = openDrillDown === offer.id;
                    return (
                        <tr key={index}>
                            {isOpenDillDown ? renderTradeDrillDown() : (
                                <>
                                    <td>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <img width={24} height={24} className="avatar bg-white" src="https://www.svgrepo.com/show/452030/avatar-default.svg" alt="" />
                                                <Link className="font-semibold" to={`/p2p/advertiser/${offer.advertiser.uid}`}>{offer.advertiser.username ?? "Anonymous"}</Link>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="font-semibold text-trade">{formatNumber(offer.price)} {offer.fiat_currency.toUpperCase()}</p>
                                                <p className="flex gap-1 content-center text-gray-300"><ClockTimerIcon />15 min</p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.available" })}: {formatNumber(offer.amount)} {offer.coin_currency.toUpperCase()}</p>
                                                <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.limit" })}: {formatNumber(offer.min_amount)} - {formatNumber(offer.max_amount)} {offer.coin_currency.toUpperCase()}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {!!offer.payments && offer.payments.map((payment, index) => (
                                                    <p key={index} className="border-l-2 border-green-500 pl-2">{payment.payment_type.toUpperCase()}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-action">
                                        {user?.uid === offer.advertiser.uid ? <div /> : (
                                            <button
                                                onClick={() => isLoggedIn ? setOpenDrillDown(offer.id) : history.push("/signin")}
                                                className={`btn-trade ${isBuy ? "buy" : "sell"}`}
                                            >
                                                {intl.formatMessage({ id: isBuy ? "page.body.p2p.advertisement.content.buy" : "page.body.p2p.advertisement.content.sell" })} {offer.coin_currency.toUpperCase()}
                                            </button>
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

    const isLoading = advertisements.loading || currencyLoading;

    return (
        <div className="p2p-mobile-screen flex flex-col">
            <AdvertisementMenu />
            {bannerMarkup}
            {filterMarkup}
            <div className="w-full flex flex-col p-3">
                {isLoading ? <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div> : advertisements.list.length > 0 ? tableMarkup : <NoResultData />}
                <div className="p-4">
                    <Pagination onlyNextPrev isEndOfData={advertisements.list.length < limit} currentPage={filter.page ?? 1} totalPages={1} onPageChange={(value) => onChangeFilter("page", value)} />
                </div>
            </div>
        </div >
    );
};


export const Advertisement = memo(AdvertisementComponent)