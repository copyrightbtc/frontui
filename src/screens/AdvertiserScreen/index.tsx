import { History } from 'history';
import React from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { RouterProps } from "react-router";
import { IconButton } from '@mui/material';
import { ArrowBackIcon } from 'src/assets/images/ArrowBackIcon';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { RouteProps, withRouter } from 'react-router-dom';
import { compose } from "redux";
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { OverlayTrigger } from 'react-bootstrap';
import { IntlProps } from "../..";
import { ClockTimerIcon } from "../../assets/images/ClockTimerIcon";
import { FillSpinner } from "react-spinners-kit";
import { NoResultData, Decimal, Tooltip } from 'src/components';
import { TabPanelSliding } from 'src/components/TabPanelUnderlines/TabPanelSliding';
import Pagination from "../../components/P2PTrading/Pagination";
import { formatNumber } from "../../components/P2PTrading/Utils";
import { HeaderTrading, AdvertisementMenu } from "../../containers";
import { localeDate, setDocumentTitle } from "../../helpers";
import { P2PTradeState, RootState, selectP2PTradeCreateResult, selectUserLoggedIn } from "../../modules";
import { AdvertisementFilter, AdvertisementsState } from "../../modules/public/advertisement";
import { advertisementsFetch } from '../../modules/public/advertisement/actions';
import { AdvertiserState, advertiserFetch } from "../../modules/public/advertiser";
import { p2pTradeCreateFetch, p2pTradeCreateHandleFinish } from '../../modules/user/p2pTrade/actions';
import { P2PTradeCreate } from "../../modules/user/p2pTrade/types";
import { CreateNewTrade } from "../AdvertisementScreen/CreateNewTrade";
import { Feedbacks } from "./Feedbacks";

interface ReduxProps {
    isLoggedIn: boolean;
    advertiser: AdvertiserState;
    advertisements: AdvertisementsState;
    p2pTradeCreateResult: P2PTradeState["create"];
}
interface LocationProps extends RouterProps {
    history: History;
    location: {
        pathname: string;
    };
}
type Props = {
    advertiserFetch: typeof advertiserFetch;
    p2pTradeCreateFetch: typeof p2pTradeCreateFetch;
    advertisementsFetch: typeof advertisementsFetch;
    p2pTradeCreateHandleFinish: typeof p2pTradeCreateHandleFinish;
} & ReduxProps & RouteProps & IntlProps & LocationProps;

type State = {
    advertiserId?: string;
    index: number;
    tab: string;
    filter: {
        page: number;
        side: "sell" | "buy";
    };
    openDrillDown: number | null;
}

const limitData = 1;

class Advertiser extends React.Component<Props> {

    public state: State = {
        index: 0,
        tab: 'advert',
        openDrillDown: null,
        filter: {
            page: 1,
            side: "sell",
        }
    };
    public tabMapping = ['advert', 'feedbacks'];

    componentDidMount(): void {
        const { advertiserFetch, location } = this.props;
        setDocumentTitle(this.props.intl.formatMessage({id: 'page.body.p2p.advertisement.title.advertiser'}));

        const uidFromProps = location.pathname.split('/')[3];
        if (uidFromProps) {
            this.setState({ advertiserId: uidFromProps });
            advertiserFetch(uidFromProps);
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
        const { advertiser, advertisementsFetch, history, p2pTradeCreateResult, p2pTradeCreateHandleFinish } = this.props;
        if (advertiser.advertiser && prevProps.advertiser.advertiser !== advertiser.advertiser) {
            this.setState({ advertiserId: advertiser.advertiser.uid });
            advertisementsFetch({ ...this.state.filter, uid: advertiser.advertiser.uid, limit: limitData });
        }
        if (!prevProps.p2pTradeCreateResult.success && p2pTradeCreateResult.success && p2pTradeCreateResult.tid) {
            p2pTradeCreateHandleFinish(p2pTradeCreateResult.tid)
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
    
    private closeDrillDown = () => {
        this.setState((prev: State) => ({ ...prev, openDrillDown: null }));
    }

    private openDrillDown = (id: number) => {
        this.setState((prev: State) => ({ ...prev, openDrillDown: id }));
    }

    private submitTrade = (data: P2PTradeCreate) => {
        this.props.p2pTradeCreateFetch(data);
        this.closeDrillDown();
    }

    private renderBanner() {
        const { advertiser, intl } = this.props;

        const positiveFeedbackCount = advertiser.advertiser?.positive_feedback_count ?? 0;
        const negativeFeedbackCount = advertiser.advertiser?.negative_feedback_count ?? 0;
        const totalFeedback = (positiveFeedbackCount) + (negativeFeedbackCount);
        const positiveFeedbackRate = positiveFeedbackCount > 0 ? Math.round((positiveFeedbackCount) * 100 * 100 / totalFeedback) / 100 : 0;

        const totalBuyCount = advertiser.advertiser?.total_buy_trades_count ?? 0;
        const totalSellCount = advertiser.advertiser?.total_sell_trades_count ?? 0;
        const totalTradeCount = totalBuyCount + totalSellCount;

        const avtChar = advertiser.advertiser?.username.charAt(0).toUpperCase();

        return (
            <div className="advertiser-screen">
                <div className="p2pscreen__userinfo">
                        <div className="p2pscreen__userinfo__wrapper">
                            <div className="p2pscreen__userinfo__head">
                                <div className="p2pscreen__userinfo__head__left">
                                    <div className="avatar">{avtChar}</div>
                                    <div className="row">
                                        <span className="email">
                                            {advertiser.advertiser?.uid} 
                                        </span>
                                        <span className="username">
                                            {advertiser.advertiser?.username ? advertiser.advertiser?.username : this.props.intl.formatMessage({ id: 'page.body.profile.username.anonymous' })}
                                        </span>
                                        {advertiser.advertiser?.first_trade_at ? (
                                            <div className="created_at">
                                                {intl.formatMessage({ id: "page.body.p2p.advertisement.content.first_trade" })}
                                                {localeDate(advertiser.advertiser?.first_trade_at, "date")}
                                            </div>
                                        ) : null} 
                                    </div>
                                </div>
                                <div className="p2pscreen__userinfo__head__right">
                                    <div className="goback-button">
                                        <IconButton
                                            href='/p2p/all-adverts/'
                                            sx={{
                                                width: '40px',
                                                height: '40px',
                                                color: 'var(--color-light-grey)',
                                                '&:hover': {
                                                    color: 'var(--color-accent)'
                                                }
                                            }}
                                        >
                                            <ArrowBackIcon className='backsarrow'/>
                                        </IconButton>
                                        <p style={{color: 'var(--color-light-grey)'}}>{intl.formatMessage({ id: "page.body.profile.content.back" })}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p2pscreen__userinfo__body">
                                <div className="p2pscreen__userinfo__body__block">
                                    <h5>
                                        {intl.formatMessage({ id: "page.body.p2p.advertisement.content.all_trade" })}
                                        <OverlayTrigger 
                                            placement="auto"
                                            delay={{ show: 250, hide: 300 }} 
                                            overlay={<Tooltip className="themes" title="page.body.p2p.advertisement.content.descr.alltrades" />}>
                                                <div className="tip_icon_container themes">
                                                    <InfoIcon />
                                                </div>
                                        </OverlayTrigger>
                                    </h5>
                                    <span>{totalTradeCount} {intl.formatMessage({ id: "page.body.p2p.advertisement.content.time" })}</span>
                                    <div className="bootom-stat">
                                        <p className="success">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.buy" })} {formatNumber(totalBuyCount)}</p>/
                                        <p className="danger">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.sell" })} {formatNumber(totalSellCount)}</p>
                                    </div>
                                </div>
                                <div className="p2pscreen__userinfo__body__block">
                                    <h5>
                                        {intl.formatMessage({ id: "page.body.p2p.advertisement.content.trades" })}
                                        <OverlayTrigger 
                                            placement="auto"
                                            delay={{ show: 250, hide: 300 }} 
                                            overlay={<Tooltip className="themes" title="page.body.p2p.advertisement.content.descr.30dtrades" />}>
                                                <div className="tip_icon_container themes">
                                                    <InfoIcon />
                                                </div>
                                        </OverlayTrigger>
                                    </h5>
                                    <span>
                                        {formatNumber(advertiser.advertiser?.trades_count_30d ?? 0)} {intl.formatMessage({ id: "page.body.p2p.advertisement.content.time" })}
                                    </span>
                                </div>
                                <div className="p2pscreen__userinfo__body__block">
                                    <h5>
                                        {intl.formatMessage({ id: "page.body.p2p.advertisement.content.success_rate" })}
                                        <OverlayTrigger 
                                            placement="auto"
                                            delay={{ show: 250, hide: 300 }} 
                                            overlay={<Tooltip className="themes" title="page.body.p2p.advertisement.content.descr.30dcompletion" />}>
                                                <div className="tip_icon_container themes">
                                                    <InfoIcon />
                                                </div>
                                        </OverlayTrigger>
                                    </h5>
                                    <span>
                                        {advertiser.advertiser?.success_rate_30d ?? 0} %
                                    </span>
                                </div>
                                <div className="p2pscreen__userinfo__body__block">
                                    <h5>
                                        {intl.formatMessage({ id: "page.body.p2p.advertisement.content.positive_feedbacks" })}
                                        <OverlayTrigger 
                                            placement="auto"
                                            delay={{ show: 250, hide: 300 }} 
                                            overlay={<Tooltip className="themes" title="page.body.p2p.advertisement.content.descr.feedbacks" />}>
                                                <div className="tip_icon_container themes">
                                                    <InfoIcon />
                                                </div>
                                        </OverlayTrigger>
                                    </h5>
                                    <span>{positiveFeedbackRate}% ({formatNumber(totalFeedback)})</span>
                                    <div className="bootom-stat">
                                        <p className="success">
                                            {intl.formatMessage({ id: "page.body.p2p.advertisement.content.positive" })}
                                            {advertiser.advertiser?.positive_feedback_count ?? 0}
                                        </p> / 
                                        <p className="danger">
                                            {intl.formatMessage({ id: "page.body.p2p.advertisement.content.negative" })} 
                                            {advertiser.advertiser?.negative_feedback_count ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }

    private renderTradeDrillDown() {
        const { advertisements } = this.props;
        const { openDrillDown } = this.state;
        if (!openDrillDown) return null;
        const offer = advertisements.list.find((item) => item.id === openDrillDown);
        if (!offer) return null;
        return (
            <CreateNewTrade advertisement={offer} onClose={this.closeDrillDown} onSubmit={this.submitTrade} />
        )
    }
    private renderAdvertisements() {
        const { intl } = this.props;
        return (
            <div className="advertiser-screen__list">
                <h2>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.h.buy" })}</h2>
                {this.renderAdvertBuy() }
                <h2>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.h.sell" })}</h2>
                {this.renderAdvertSell() }
            </div>
        )
    }
    private renderAdvertBuy() {
        const { advertisements, isLoggedIn, intl } = this.props;
        return (
            
            <div className="flex-table themes">
                <div className="flex-table__head">
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.coin" })}</span>
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.price" })}</span>
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.available" })}/{intl.formatMessage({ id: "page.body.p2p.advertisement.content.limit" })}</span>
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.payment" })}</span>
                    <span className="text-right">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.trade" })}</span>
                </div>
                <div className="flex-table__body">
                    {advertisements.list.map((offer, index) => {
                        const isBuy = offer.side === "sell";
                        const isOpenDrillDown = this.state.openDrillDown === offer.id;
                        
                        const offeFiatMin = Number(offer.price) * Number(offer.min_amount);
                        const offeFiatMax = Number(offer.price) * Number(offer.max_amount);

                        return (
                            <> 
                            {isBuy && <div key={index}>
                                {isOpenDrillDown ? this.renderTradeDrillDown() : (
                                   <div className="flex-table-width">
                                        <div className="flex-table-col first-coins">
                                            <div className="row coins">
                                                <CryptoIcon className="crypto-icon" code={offer.coin_currency?.toUpperCase()} />
                                                {offer.coin_currency.toUpperCase()}
                                            </div>
                                            <div className="row-down"> 
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
                                            <button
                                                onClick={() => isLoggedIn ? this.openDrillDown(offer.id) : this.props.history.push("/signin")}
                                                className={`btnp2p-trade ${isBuy ? "buy" : "sell"}`}
                                            >
                                                {intl.formatMessage({ id: `page.body.p2p.advertisement.content.${isBuy ? "buy" : "sell"}` })} {offer.coin_currency.toUpperCase()}
                                            </button>
                                        </div>
                                    </div>
                                    )}
                                </div>}
                            </>
                        )
                    })}
                </div>
            </div>
        );
    }
    private renderAdvertSell() {
        const { advertisements, isLoggedIn, intl } = this.props;
        return (
            
            <div className="flex-table themes">
                <div className="flex-table__head">
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.coin" })}</span>
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.price" })}</span>
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.available" })}/{intl.formatMessage({ id: "page.body.p2p.advertisement.content.limit" })}</span>
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.payment" })}</span>
                    <span className="text-right">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.trade" })}</span>
                </div>
                <div className="flex-table__body">
                    {advertisements.list.map((offer, index) => {
                        const isBuy = offer.side === "sell";
                        const isOpenDrillDown = this.state.openDrillDown === offer.id;
                        
                        const offeFiatMin = Number(offer.price) * Number(offer.min_amount);
                        const offeFiatMax = Number(offer.price) * Number(offer.max_amount);

                        return (
                            <> 
                            {!isBuy && <div key={index}>
                                {isOpenDrillDown ? this.renderTradeDrillDown() : (
                                   <div className="flex-table-width">
                                        <div className="flex-table-col first-coins">
                                            <div className="row coins">
                                                <CryptoIcon className="crypto-icon" code={offer.coin_currency?.toUpperCase()} />
                                                {offer.coin_currency.toUpperCase()}
                                            </div>
                                            <div className="row-down"> 
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
                                            <button
                                                onClick={() => isLoggedIn ? this.openDrillDown(offer.id) : this.props.history.push("/signin")}
                                                className={`btnp2p-trade ${isBuy ? "buy" : "sell"}`}
                                            >
                                                {intl.formatMessage({ id: `page.body.p2p.advertisement.content.${isBuy ? "buy" : "sell"}` })} {offer.coin_currency.toUpperCase()}
                                            </button>
                                        </div>
                                    </div>
                                    )}
                                </div>}
                            </>
                        )
                    })}
                </div>
            </div>
        );
    }
   
    private renderAdvertisementsTab() {
        const { advertisements, advertiser } = this.props;
        return (
            <React.Fragment>
                {advertiser.loading || advertisements.loading ? <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div> : advertisements.list.length > 0 ? this.renderAdvertisements() : <div className="mt-4"><NoResultData /></div>}
                <div className="p2pscreen__footer">
                    <Pagination 
                        onlyNextPrev 
                        isEndOfData={advertisements.list.length < limitData} 
                        currentPage={this.state.filter.page ?? 1} 
                        totalPages={1}
                        onPageChange={(p) => this.changeFilter("page", p)} 
                    />
                </div>
            </React.Fragment>
        )
    }
 
    private changeTab = (index: number) => {
        if (this.state.tab === this.tabMapping[index]) {
            return;
        }

        this.setState({
            tab: this.tabMapping[index],
            index: index,
        });
    };

    private renderTabs = () => {
        const { tab, index } = this.state;
        const { advertiser } = this.props;
        
        const positiveFeedbackCount = advertiser.advertiser?.positive_feedback_count ?? 0;
        const negativeFeedbackCount = advertiser.advertiser?.negative_feedback_count ?? 0;
        const totalFeedback = (positiveFeedbackCount) + (negativeFeedbackCount);

        return [
            {
                content: tab === 'advert' && index === 0 ? this.renderAdvertisementsTab() : null,
                label: this.props.intl.formatMessage({ id: 'page.body.p2p.advertisement.content.advertisements' }),
            },
            {
                content: tab === 'feedbacks' && index === 1 ? <Feedbacks /> : null,
                label: <React.Fragment>{this.props.intl.formatMessage({ id: 'page.body.p2p.advertisement.content.feedbacks' })} ({totalFeedback})</React.Fragment>,
            },
        ];
    }; 
    

    private renderContent() {
        return (
            <div className="p2pscreen__wrapper">
                <TabPanelSliding
                    panels={this.renderTabs()}
                    onTabChange={this.changeTab}
                    currentTabIndex={this.state.index}
                    themes={true}
                    borders={true}
                />
            </div>
        );
    }

    public render() {
        const { advertiser } = this.props;
        return (
            <div className="p2pscreen">
                <HeaderTrading />
                <AdvertisementMenu />
                {advertiser ? this.renderBanner() : null}
                {this.renderContent()}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isLoggedIn: selectUserLoggedIn(state),
    advertiser: state.public.advertiser,
    advertisements: state.public.advertisements,
    p2pTradeCreateResult: selectP2PTradeCreateResult(state),
});

const mapActionToProps = {
    advertiserFetch: advertiserFetch,
    advertisementsFetch: advertisementsFetch,
    p2pTradeCreateFetch: p2pTradeCreateFetch,
    p2pTradeCreateHandleFinish: p2pTradeCreateHandleFinish,
}

export const AdvertiserScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapActionToProps),
)(Advertiser) as React.ComponentClass;

/*   <div className="p2pscreen__userinfo__head__feedbacks">
       <h5>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.positive_feedbacks" })}</h5>
       <div className="p2pscreen__userinfo__head__feedbacks__info">
           <div className="total">
               {positiveFeedbackRate}% ({formatNumber(totalFeedback)})
           </div>
           <span>
               {intl.formatMessage({ id: "page.body.p2p.advertisement.content.positive" })} 
               <div className="positive">{advertiser.advertiser?.positive_feedback_count ?? 0}</div>
           </span>
           <span>
               {intl.formatMessage({ id: "page.body.p2p.advertisement.content.negative" })}
               <div className="negative">{advertiser.advertiser?.negative_feedback_count ?? 0}</div>
           </span>
       </div>
   </div>
*/