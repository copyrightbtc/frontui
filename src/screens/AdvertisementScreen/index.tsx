import React from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { RouterProps } from "react-router";
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { setDocumentTitle } from '../../helpers';
import { Stack, Button } from '@mui/material'; 
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip, NoResultData, Decimal } from '../../components';
import { CryptoIcon } from '../../components/CryptoIcon';
import { compose } from "redux"; 
import { IntlProps } from "../..";
import { ClockTimerIcon } from "../../assets/images/ClockTimerIcon";
import { LikeIcon } from "../../assets/images/LikeIcon";
import { FillSpinner } from "react-spinners-kit";
import Pagination from "../../components/P2PTrading/Pagination";
import SelectP2PFilter from "../../components/SelectP2PFilter";
import { formatNumber } from "../../components/P2PTrading/Utils";
import { HeaderTrading, AdvertisementMenu } from "../../containers";
import { CurrenciesState, P2PTradeState, RootState, User, currenciesFetch, selectP2PTradeCreateResult, selectUserInfo, selectUserLoggedIn } from "../../modules";
import { AdvertisementFilter, AdvertisementsState, advertisementsFetch } from "../../modules/public/advertisement";
import { CreateNewTrade } from "./CreateNewTrade";
import { p2pTradeCreateFetch, p2pTradeCreateHandleFinish } from '../../modules/user/p2pTrade/actions';
import { P2PTradeCreate } from "../../modules/user/p2pTrade/types";
interface ReduxProps {
    user?: User;
    p2pTradeCreateResult: P2PTradeState["create"];
    isLoggedIn: boolean;
    currencyState: CurrenciesState;
    advertisementState: AdvertisementsState; 
}
interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
    match: {
        params?: {
            currency?: string;
            fiatcoin?: string;
        }
    }
}
type Props = {
    currenciesFetch: typeof currenciesFetch;
    advertisementsFetch: typeof advertisementsFetch;
    p2pTradeCreateFetch: typeof p2pTradeCreateFetch;
    p2pTradeCreateHandleFinish: typeof p2pTradeCreateHandleFinish;
} & ReduxProps & RouteProps & IntlProps & LocationProps;

type State = {
    filter: AdvertisementFilter;
    openDrillDown: number | null;
}

const limitData = 25;

class Advertisement extends React.Component<Props> {

    public state: State = {
        filter: {
            fiat_currency: "",
            coin_currency: "",
            side: "sell",
            page: 1, 
        },
        openDrillDown: null,
    };

    componentDidMount(): void {
        setDocumentTitle(this.props.intl.formatMessage({id: 'page.body.header.up.titles.p2ptrading'}));

        this.props.currenciesFetch();
    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
        const { currencyState, advertisementState, advertisementsFetch, p2pTradeCreateResult, history, p2pTradeCreateHandleFinish } = this.props;

        if (prevProps.currencyState.list !== currencyState.list || prevProps.advertisementState.list.length !== advertisementState.list.length) {
            const coinCurrencyParam = this.props.match?.params?.currency?.toLowerCase();
            const fiatCurrencyParam = this.props.match?.params?.fiatcoin?.toLowerCase();
            
            let isCoinCurrencyValid: boolean, isFiatCurrencyValid: boolean;
            isCoinCurrencyValid = currencyState.list.filter((currency) => currency.type === "coin" && currency.id === coinCurrencyParam)?.length !== 0;
            isFiatCurrencyValid = currencyState.list.filter((currency) => currency.type === "fiat" && currency.id === fiatCurrencyParam)?.length !== 0;
            const coinCurrency = isCoinCurrencyValid ? coinCurrencyParam : currencyState.list.filter((currency) => currency.type === "coin")[0]?.id ?? "";
            const fiatCurrency = isFiatCurrencyValid ? fiatCurrencyParam : currencyState.list.filter((currency) => currency.type === "fiat")[0]?.id ?? "";

            const newFilter = { ...this.state.filter, coin_currency: coinCurrency, fiat_currency: fiatCurrency };
            this.setState((prev: State) => ({ ...prev, filter: newFilter }));
            advertisementsFetch({ ...newFilter, limit: limitData, page: 1 });
            history.push(`/p2p/all-adverts/${coinCurrency?.toUpperCase()}/${fiatCurrency?.toUpperCase()}`);
        }
        if (!prevProps.p2pTradeCreateResult.success && p2pTradeCreateResult.success && p2pTradeCreateResult.tid) {
            p2pTradeCreateHandleFinish(p2pTradeCreateResult.tid);
            history.push(`/p2p/trade/${p2pTradeCreateResult.tid}`);
        }

    }

    private changeFilter = (key: keyof AdvertisementFilter, value: any) => {
        const newState: State = ({ ...this.state, filter: { ...this.state.filter, [key]: value } });
        this.setState(newState);
        if (key === "page") {
            this.props.advertisementsFetch({ ...newState.filter, limit: limitData });
        } else {
            this.props.advertisementsFetch({ ...newState.filter, limit: limitData, page: 1 });
        }
    }
 
    private changeSide = (side: AdvertisementFilter["side"]) => {
        this.changeFilter("side", side);
    }

    private selectCurrency = (fiatcoin: AdvertisementFilter["fiat_currency"]) => {
        const coinCurrency = this.props.currencyState.list.filter((coincurrencys) => coincurrencys.type === "coin");
        const currency = this.state.filter.coin_currency ?? coinCurrency[0]?.id; 

        this.changeFilter("fiat_currency", fiatcoin);
        this.changeFilter && this.props.history.push(`/p2p/all-adverts/${currency?.toUpperCase()}/${fiatcoin?.toUpperCase()}`);
    }

    private selectCoinCurrency = (currency: AdvertisementFilter["coin_currency"]) => {
 
        const fiatCurrencies = this.props.currencyState.list.filter((fiatcurrencys) => fiatcurrencys.type === "fiat");
        const fiatcoin = this.state.filter.fiat_currency ?? fiatCurrencies[0]?.id;

        this.changeFilter("coin_currency", currency);
        this.changeFilter && this.props.history.push(`/p2p/all-adverts/${currency?.toUpperCase()}/${fiatcoin?.toUpperCase()}`);
    }
 
    private changePage = (page: number) => {
        this.changeFilter("page", page)
    }

    private closeDrillDown = () => {
        this.setState(
            (prev: State) => ({ ...prev, openDrillDown: null })
        );
    }

    private openDrillDown = (id: number) => {
        this.setState(
            (prev: State) => ({ ...prev, openDrillDown: id }) 
        );
    }

    private submitTrade = (data: P2PTradeCreate) => {
        this.props.p2pTradeCreateFetch(data);
        this.closeDrillDown();
    }
 
    private renderFilter() {
        const { currencyState, intl } = this.props;

        const coinCurrencies = currencyState.list.filter((currency) => currency.type === "coin");
        const fiatCurrencies = currencyState.list.filter((currency) => currency.type === "fiat");

        const coinSelected = this.state.filter.coin_currency ?? coinCurrencies[0]?.id;
        const fiatSelected = this.state.filter.fiat_currency ?? fiatCurrencies[0]?.id;

        return (
            <React.Fragment> 
                {!this.props.isLoggedIn ? (
                    <div className="p2pscreen__wellcome">
                        <h2>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.register_banner" }, {bannerCoinName: coinSelected.toUpperCase()})}</h2>
                        <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.register_banner.small" }, {bannerCoinName: coinSelected.toUpperCase()})}</p>
                        <div className="p2pscreen__wellcome__buttons">
                            <Stack direction="row" spacing={2}>
                                <Button
                                    href="/signup"
                                    variant="outlined"
                                >
                                    {intl.formatMessage({id: 'page.body.land.button.register'})}
                                </Button>
                                <Button
                                    variant="text"
                                    href="/signin"
                                >
                                    {intl.formatMessage({id: 'page.body.landing.header.login'})}
                                </Button>
                            </Stack>
                        </div>
                    </div>
                ) : null}
 
                <div className="p2pscreen__filter">
                    <div className="p2pscreen__filter__buysell">
                        <Button
                            onClick={() => this.changeSide("sell")}
                            className={`buy ${this.state.filter.side === "sell" ? "active" : ""}`}
                        >
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.content.buy" })}
                        </Button>
                        <Button
                            onClick={() => this.changeSide("buy")}
                            className={`sell ${this.state.filter.side === "buy" ? "active" : ""}`}
                        >
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.content.sell" })}
                        </Button>
                    </div>
                    <div className="p2pscreen__filter__coins">
                        {coinCurrencies.map((item) => (
                            <Button
                                key={item.id}
                                onClick={() => this.selectCoinCurrency(item.id)}
                                className={`btn-coins ${coinSelected === item.id ? "active" : ""}`}
                            >
                                {item.id.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="filter-cell themes cn-select">
                    <SelectP2PFilter
                        searchAble
                        fixedWidth={220}
                        currentIcon={<CryptoIcon className='label-icon' 
                        code={fiatSelected.toUpperCase()} />}
                        suffixMarkup={intl.formatMessage({ id: "page.body.p2p.advertisement.component.currency" })}
                        value={fiatSelected}
                        onChange={value => this.selectCurrency(value as AdvertisementFilter["fiat_currency"])}
                        options={fiatCurrencies.map(currency => ({
                            label: currency.id.toUpperCase(),
                            value: currency.id,
                            icon: <CryptoIcon className='label-icon' code={currency.id.toUpperCase()} />
                        }))}
                    />
                </div>
            </React.Fragment>
        )
    };
 
    private renderTable() {
        const { advertisementState, intl, user } = this.props;
        const { openDrillDown } = this.state; 

        return (
            <div className="flex-table themes">
                <div className="flex-table__head">
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.advertisers" })}</span>
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.price" })}</span>
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.available" })}/{intl.formatMessage({ id: "page.body.p2p.advertisement.content.limit" })}</span>
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.payment" })}</span>
                    <span className="text-right">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.trade" })}</span>
                </div>
                <div className="flex-table__body">
                    {advertisementState.list.map((offer, index) => {
                        const isBuy = offer.side === "sell";
                        const isOpenDrillDown = openDrillDown === offer.id;

                        const positiveFeedbackCount = offer.advertiser?.positive_feedback_count ?? 0;
                        const negativeFeedbackCount = offer.advertiser?.negative_feedback_count ?? 0;
                        const totalFeedback = (positiveFeedbackCount) + (negativeFeedbackCount);
                        const positiveFeedbackRate = positiveFeedbackCount > 0 ? Math.round((positiveFeedbackCount) * 100 * 100 / totalFeedback) / 100 : 0;
                        const avtChar = offer.advertiser?.username.charAt(0).toUpperCase();

                        const offeFiatMin = Number(offer.price) * Number(offer.min_amount);
                        const offeFiatMax = Number(offer.price) * Number(offer.max_amount);
                        return (
                            <div key={index}>
                                {isOpenDrillDown ? this.renderTradeDrillDown() : (
                                    <div className="flex-table-width">
                                        <div className="flex-table-col">
                                            <div className="row">
                                                <div className="avatar">{avtChar}</div>
                                                <Link className="name" to={`/p2p/advertiser/${offer.advertiser.uid}`}>{offer.advertiser.username ?? intl.formatMessage({ id: "page.body.profile.username.anonymous" })}</Link>
                                            </div>
                                            <div className="row-left">
                                                { offer.advertiser?.trades_count_30d === 1 ? (
                                                    <span>{formatNumber(offer.advertiser?.trades_count_30d ?? 0)} {intl.formatMessage({ id: "page.body.p2p.advertisement.content.infoorder" })}</span> 
                                                    ) : <span>{formatNumber(offer.advertiser?.trades_count_30d ?? 0)} {intl.formatMessage({ id: "page.body.p2p.advertisement.content.infoorders" })}</span> 
                                                } 
                                                <span>{offer.advertiser?.success_rate_30d ?? 0}% {intl.formatMessage({ id: "page.body.p2p.advertisement.content.infocompletion" })}</span>
                                            </div>
                                            <div className="row-left">
                                                <OverlayTrigger 
                                                    placement="auto"
                                                    delay={{ show: 250, hide: 300 }} 
                                                    overlay={<Tooltip className="themes" title="page.body.p2p.advertisement.content.tooltip.percents" />}>
                                                        <p><LikeIcon />{positiveFeedbackRate ?? 0}%</p>
                                                </OverlayTrigger>
                                                <OverlayTrigger 
                                                    placement="auto"
                                                    delay={{ show: 250, hide: 300 }} 
                                                    overlay={<Tooltip className="themes" title={intl.formatMessage({ id: "page.body.p2p.advertisement.content.tooltip.time" }, {timeInfo: offer.paytime})}/>}>
                                                        <p><ClockTimerIcon />{offer.paytime} min</p>
                                                </OverlayTrigger> 
                                            </div> 
                                        </div>
                                        <div className="flex-table-row">
                                            <div className="offer-price">
                                                <span>{formatNumber(offer.price)}</span>{offer.fiat_currency.toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="flex-table-row">
                                            <div className="boxes__inside">
                                                <p>{offer.amount} {offer.coin_currency.toUpperCase()}</p> 
                                                <p>{Decimal.format(offeFiatMin, 2, ',')} - {Decimal.format(offeFiatMax, 2, ',')} {offer.fiat_currency.toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex-table-col">
                                            <div className="offer-payments">
                                                {!!offer.payments && offer.payments.map((payment, index) => (
                                                    <OverlayTrigger 
                                                        placement="auto" 
                                                        delay={{ show: 250, hide: 300 }} 
                                                        overlay={<Tooltip className="themes" title={intl.formatMessage({ id: "page.body.p2p.advertisement.offer.payments" }, {offerPayments: payment.payment_type.toUpperCase(), offerPaymentss: payment.data.bank_name })}/>}>
                                                            <p key={index}>{payment.payment_type.toUpperCase()} - {payment.data.bank_name} </p>
                                                    </OverlayTrigger>
                                                ))}
                                            </div>
                                        </div> 
                                        <div className="flex-table-row block-right">
                                            {user?.uid === offer.advertiser.uid ? <div /> : (
                                                <button
                                                    onClick={() => this.openDrillDown(offer.id)}
                                                    className={`btnp2p-trade ${isBuy ? "buy" : "sell"}`}
                                                >
                                                    {intl.formatMessage({ id: isBuy ? "page.body.p2p.advertisement.content.buy" : "page.body.p2p.advertisement.content.sell" })} {offer.coin_currency.toUpperCase()}
                                                </button>
                                            )} 
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div> 
            </div >
        );
    }; 
    private renderTradeDrillDown() {
        const { advertisementState } = this.props;
        const { openDrillDown } = this.state;
        if (!openDrillDown) return null;
        const offer = advertisementState.list.find((item) => item.id === openDrillDown);
        if (!offer) return null;
        return (
            <CreateNewTrade advertisement={offer} onClose={this.closeDrillDown} onSubmit={this.submitTrade} />
        )
    };
 
    private renderContent() {
        const { advertisementState } = this.props;
        const isLoading = advertisementState.loading;
        return (
            <div className="p2pscreen__wrapper">
                {this.renderFilter()}
                {isLoading ? <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div> : advertisementState.list.length > 0 ? this.renderTable() : <NoResultData class="themes"/>}
                {advertisementState.list.length > 0 && 
                    <div className="p2pscreen__footer">
                        <Pagination onlyNextPrev isEndOfData={advertisementState.list.length < limitData} currentPage={this.state.filter.page ?? 1} totalPages={1} onPageChange={this.changePage} />
                    </div>
                }
            </div>
        );
    }

    public render() {
        return (
            <div className="p2pscreen">
                <HeaderTrading />
                <AdvertisementMenu />
                {this.renderContent()}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    isLoggedIn: selectUserLoggedIn(state),
    currencyState: state.public.currencies,
    advertisementState: state.public.advertisements,
    p2pTradeCreateResult: selectP2PTradeCreateResult(state), 
});

const mapActionToProps = {
    currenciesFetch: currenciesFetch,
    advertisementsFetch: advertisementsFetch,
    p2pTradeCreateFetch: p2pTradeCreateFetch,
    p2pTradeCreateHandleFinish: p2pTradeCreateHandleFinish,
}

export const AdvertisementScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapActionToProps),
)(Advertisement) as React.ComponentClass;
