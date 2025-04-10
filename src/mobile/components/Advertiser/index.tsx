import React from "react";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { ClockTimerIcon } from "../../../assets/images/ClockTimerIcon";
import { FillSpinner } from "react-spinners-kit";
import { NoResultData } from 'src/components';
import Pagination from "../../../components/P2PTrading/Pagination";
import { formatNumber } from "../../../components/P2PTrading/Utils";
import { RootState, p2pTradeCreateFetch, p2pTradeCreateHandleFinish, selectP2PTradeCreateResult, selectUserLoggedIn } from "../../../modules";
import { AdvertisementFilter, advertisementsFetch } from "../../../modules/public/advertisement";
import { advertiserFetch } from "../../../modules/public/advertiser";
import { localeDate } from "../../../helpers";
import { MobileFeedbacks } from "./MobileFeedbacks";
import { useIntl } from "react-intl";
import { CreateTrade } from "../Advertisement/CreateTrade";
import { P2PTradeCreate } from "../../../modules/user/p2pTrade/types";

const limit = 25;

const AdvertiserComponent = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const intl = useIntl();
    const { uid } = useParams<{ uid: string }>();
    const [filter, setFilter] = useState<AdvertisementFilter>({
        side: "sell",
        page: 1,
    });
    const [tabIndex, setTabIndex] = useState(0);
    const [openDrillDown, setOpenDrillDown] = useState<number | null>(null);

    const isLoggedIn = useSelector(selectUserLoggedIn);
    const advertisements = useSelector((state: RootState) => state.public.advertisements);
    const advertiser = useSelector((state: RootState) => state.public.advertiser);
    const p2pTradeCreateResult = useSelector(selectP2PTradeCreateResult);

    useEffect(() => {
        if (uid) {
            dispatch(advertiserFetch(uid));
        }
    }, [uid]);

    useEffect(() => {
        dispatch(advertisementsFetch({ ...filter, uid, limit }));
    }, [dispatch, filter, uid]);

    const onChangeFilter = (field: keyof AdvertisementFilter, value: any) => {
        setFilter({
            ...filter,
            [field]: value,
        });
    }

    useEffect(() => {
        if (p2pTradeCreateResult.success && p2pTradeCreateResult.tid) {
            dispatch(p2pTradeCreateHandleFinish(p2pTradeCreateResult.tid));
            history.push(`/p2p/trade/info/${p2pTradeCreateResult.tid}`);
        }
    }, [p2pTradeCreateResult])

    const positiveFeedbackCount = advertiser.advertiser?.positive_feedback_count ?? 0;
    const negativeFeedbackCount = advertiser.advertiser?.negative_feedback_count ?? 0;
    const totalFeedback = (positiveFeedbackCount) + (negativeFeedbackCount);
    const positiveFeedbackRate = totalFeedback > 0 ? Math.round((positiveFeedbackCount) * 100 * 100 / totalFeedback) / 100 : 0;

    const totalBuyCount = advertiser.advertiser?.total_buy_trades_count ?? 0;
    const totalSellCount = advertiser.advertiser?.total_sell_trades_count ?? 0;
    const totalTradeCount = totalBuyCount + totalSellCount;

    const avtChar = advertiser.advertiser?.username.charAt(0).toUpperCase();

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

    const bannerMarkup = (
        <div className="w-screen bg-gray-600 flex flex-col gap-3 p-3">
            <div className="flex gap-4">
                <div className="w-12 h-12 p-3 flex items-center justify-center bg-white rounded-full text-4xl text-gray-500">{avtChar}</div>
                <div className="flex flex-col">
                    <p className="font-semibold text-white">{advertiser.advertiser?.username ?? ""}</p>
                    {advertiser.advertiser?.first_trade_at ? (
                        <p>
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.content.first_trade" })}
                            <span className="font-semibold">{localeDate(advertiser.advertiser?.first_trade_at, "date")}</span>
                        </p>
                    ) : null}
                </div>
            </div>
            <div className="flex flex-col gap-2 bg-gray-400 rounded-md p-3 text-white">
                <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.positive_feedbacks" })}</p>
                <div className="flex justify-between items-center">
                    <p>{positiveFeedbackRate}% ({formatNumber(totalFeedback)})</p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.positive" })}</p>
                            <div className="h-3 p-3 flex items-center justify-center bg-green-500 rounded-md">{advertiser.advertiser?.positive_feedback_count ?? 0}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.negative" })}</p>
                            <div className="h-3 p-3 flex items-center justify-center bg-red-500 rounded-md">{advertiser.advertiser?.negative_feedback_count ?? 0}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full text-white text-sm">
                <div className="w-full flex justify-between">
                    <div className="flex items-center">
                        <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.all_trade" })}</p>
                        (<div className="flex gap-1">
                            <p className="text-green-500">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.buy" })} {formatNumber(totalBuyCount)}</p>/
                            <p className="text-red-500">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.sell" })} {formatNumber(totalSellCount)}</p>
                        </div>)
                    </div>
                    <p>{formatNumber(totalTradeCount)} {intl.formatMessage({ id: "page.body.p2p.advertisement.content.time" })}(s)</p>
                </div>
                <div className="w-full flex justify-between">
                    <p>30d {intl.formatMessage({ id: "page.body.p2p.advertisement.content.trades" })}</p>
                    <p>{formatNumber(advertiser.advertiser?.trades_count_30d ?? 0)} Time(s)</p>
                </div>
                <div className="w-full flex justify-between">
                    <p>30d {intl.formatMessage({ id: "page.body.p2p.advertisement.content.success_rate" })}</p>
                    <p>{advertiser.advertiser?.success_rate_30d ?? 0} %</p>
                </div>
            </div>
        </div>
    );

    const filterMarkup = (
        <div className="flex items-center p-3">
            <button onClick={() => onChangeFilter("side", "sell")} className={`btn-trade-option ${filter.side === "sell" ? "active" : ""}`}
            >
                {intl.formatMessage({ id: "page.body.p2p.advertisement.content.buy" }).toUpperCase()}
            </button>
            <button onClick={() => onChangeFilter("side", "buy")} className={`btn-trade-option ${filter.side === "buy" ? "active" : ""}`}
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
                    const isBuy = offer.side === "sell";
                    const isOpenDillDown = openDrillDown === offer.id;
                    return (
                        <tr key={index}>
                            {isOpenDillDown ? renderTradeDrillDown() : (
                                <>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <p className="font-semibold text-trade">{offer.coin_currency.toUpperCase()}</p>
                                            <div className="flex flex-col gap-1">
                                                <p className="font-semibold text-trade">{formatNumber(offer.price)} {offer.fiat_currency.toUpperCase()}</p>
                                                <p className="flex gap-1 items-center text-gray-300"><ClockTimerIcon />{offer.paytime} min</p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p><span className="font-light">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.available" })}</span>: {formatNumber(offer.amount)} {offer.coin_currency.toUpperCase()}</p>
                                                <p><span className="font-light">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.limit" })}</span>: {formatNumber(offer.min_amount)} - {formatNumber(offer.max_amount)} {offer.coin_currency.toUpperCase()}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {!!offer.payments && offer.payments.map((payment, index) => (
                                                    <p key={index} className="border-l-2 border-green-500 pl-2">{payment.payment_type.toUpperCase()}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-action">
                                        <button
                                            onClick={() => isLoggedIn ? setOpenDrillDown(offer.id) : history.push("/signin")}
                                            className={`btn-trade ${isBuy ? "buy" : "sell"}`}
                                        >
                                            {intl.formatMessage({ id: `page.body.p2p.advertisement.content.${isBuy ? "buy" : "sell"}` })} {offer.coin_currency.toUpperCase()}
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )

    const contentMarkup = (
        <div>
            {filterMarkup}
            <div className="w-full flex flex-col px-3">
                {advertisements.loading ? <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div> : advertisements.list.length > 0 ? tableMarkup : <NoResultData />}
                <div className="p-4">
                    <Pagination onlyNextPrev isEndOfData={advertisements.list.length < limit} currentPage={filter.page ?? 1} totalPages={1} onPageChange={(value) => onChangeFilter("page", value)} />
                </div>
            </div>
        </div>
    )

    return (
        <div className="p2p-mobile-screen flex flex-col">
            {bannerMarkup}
            <div className="flex flex-col">
                <div className="tab p-3">
                    <div
                        className={`tab-item px-3 py-1 ${tabIndex === 0 ? "active-tab" : ""}`}
                        onClick={() => setTabIndex(0)}
                    >
                        <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.advertisements" })}</p>
                    </div>
                    <div
                        className={`tab-item px-3 py-1 ${tabIndex === 1 ? "active-tab" : ""}`}
                        onClick={() => setTabIndex(1)}
                    >
                        <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.feedbacks" })}</p>
                    </div>
                </div>
                {tabIndex === 0 && contentMarkup}
                {tabIndex === 1 && <MobileFeedbacks />}
            </div>

        </div >
    );
};


export const Advertiser = memo(AdvertiserComponent)