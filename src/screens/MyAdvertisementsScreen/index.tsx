import React from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { RouterProps } from "react-router";
import { RouteProps, withRouter, Link } from 'react-router-dom';
import { setDocumentTitle } from '../../helpers';
import { compose } from "redux";
import { DocumentsVerIcon } from "../../assets/images/DocumentsVerIcon";
import { IntlProps } from "../..";
import Pagination from "../../components/P2PTrading/Pagination";
import SelectP2PFilter from "../../components/SelectP2PFilter";
import { Button, IconButton } from '@mui/material'; 
import { OverlayTrigger } from 'react-bootstrap';
import { CSSTransition } from "react-transition-group";
import { AdvertisementFilter } from "../../modules/public/advertisement";
import { ActivateIcon } from 'src/assets/images/ActivateIcon';
import { DeactivateIcon } from 'src/assets/images/DeactivateIcon';
import { DepositPlusIcon } from "src/assets/images/DepositPlusIcon";
import { ClockTimerIcon } from "../../assets/images/ClockTimerIcon";
import { CloseIcon } from '../../assets/images/CloseIcon';
import { SucceedIcon } from 'src/containers/Wallets/SucceedIcon';
import { HeaderTrading, AdvertisementMenu } from "../../containers";
import { 
    RootState, 
    User, 
    Wallet, 
    alertPush, 
    selectUserInfo, 
    selectWallets, 
    Currency, 
    selectCurrencies,
    CurrenciesState,
} from "../../modules";
import { FillSpinner } from "react-spinners-kit";
import { NoResultData, Decimal, Tooltip } from 'src/components';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { 
    P2PAdvertisement, 
    P2PAdvertisementsState, 
    p2pAdvertisementStateChangeFetch, 
    p2pAdvertisementsFetch 
} from "../../modules/user/p2pAdvertisement";
import { 
    p2pAdvertisementAmountChangeFetch, 
    p2pAdvertisementPriceChangeFetch, 
    p2pDeleteAdvertisementFetch 
} from '../../modules/user/p2pAdvertisement/actions';
import Input from "../../components/SelectP2PFilter/Input";
import { MAX_LIMIT_CURRENCY } from "../../modules/constant";
import UpdateP2PAdsModal from "../../components/UpdateP2PAdsModal";

interface ReduxProps {
    user: User;
    wallets: Wallet[];
    advertisements: P2PAdvertisementsState;
    currencies: Currency[];
    currencyState: CurrenciesState;
    currency?: string;
    fiatcoin?: string;
}

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}
type Props = {
    uid?: string;
    side: string;
    alertPush: typeof alertPush;
    p2pAdvertisementsFetch: typeof p2pAdvertisementsFetch;
    p2pDeleteAdvertisementFetch: typeof p2pDeleteAdvertisementFetch
    p2pAdvertisementStateChangeFetch: typeof p2pAdvertisementStateChangeFetch;
    p2pAdvertisementPriceChangeFetch: typeof p2pAdvertisementPriceChangeFetch;
    p2pAdvertisementAmountChangeFetch: typeof p2pAdvertisementAmountChangeFetch;
} & ReduxProps & RouteProps & IntlProps & LocationProps;

type State = {
    filter: AdvertisementFilter;
    confirmDelete: number | null;
    confirmClose: number | null,
    openUpdateAd: P2PAdvertisement | null;
    priceChange: number | null;
    amountChange: number | null;
    amountChangeType: "sub" | "plus";
    openDrillDownPrice: number | null;
    openDrillDownAmount: number | null;
    showDeleteAdModal: boolean;
    showCloseAdModal: boolean;
    showUpdateAdModal: boolean;
    showModalVerify: boolean;
}

const limitData = 25;

class MyAdvertisements extends React.Component<Props> {

    public state: State = {
        filter: {
            page: 1,
            side: "all",
            coin_currency: "",
            fiat_currency: "",
        },
        confirmDelete: null,
        confirmClose: null,
        openUpdateAd: null,
        openDrillDownPrice: null,
        openDrillDownAmount: null,
        priceChange: null,
        amountChange: null,
        amountChangeType: "plus",
        showDeleteAdModal: false,
        showCloseAdModal: false,
        showUpdateAdModal: false,
        showModalVerify: false,
    };

    componentDidMount(): void {
        const { p2pAdvertisementsFetch, user, currencyState } = this.props;

        const coinCurrencyParam = this.props.currency?.toLowerCase();
        const fiatCurrencyParam = this.props.fiatcoin?.toLowerCase();
        
        let isCoinCurrencyValid: boolean, isFiatCurrencyValid: boolean;
        isCoinCurrencyValid = currencyState.list.filter((currency) => currency.type === "coin" && currency.id === coinCurrencyParam)?.length !== 0;
        isFiatCurrencyValid = currencyState.list.filter((currency) => currency.type === "fiat" && currency.id === fiatCurrencyParam)?.length !== 0;
        const coinCurrency = isCoinCurrencyValid ? coinCurrencyParam : currencyState.list.filter((currency) => currency.type === "coin")[0]?.id ?? "";
        const fiatCurrency = isFiatCurrencyValid ? fiatCurrencyParam : currencyState.list.filter((currency) => currency.type === "fiat")[0]?.id ?? "";

        setDocumentTitle(this.props.intl.formatMessage({id: 'page.body.p2p.advertisement.title.advertiser.my'}));

        p2pAdvertisementsFetch({
            ...this.state.filter,
            limit: limitData,
            uid: user.uid,
            coin_currency: coinCurrency, 
            fiat_currency: fiatCurrency
        });
    }

    private changeFilter = (key: keyof AdvertisementFilter, value: any) => {
        const newFilter = { ...this.state.filter, [key]: value };
        const { p2pAdvertisementsFetch, user } = this.props;
        this.setState((prev: State) => ({ ...prev, filter: newFilter }));
        if (key === "page") {
            p2pAdvertisementsFetch({ ...newFilter, uid: user.uid, limit: limitData });
        } else {
            p2pAdvertisementsFetch({ ...newFilter, uid: user.uid, limit: limitData, page: 1 });
        }
    }
    
    private closeConfirmClose = () => {
        this.setState({ confirmClose: null });
        this.setState({
            showCloseAdModal: false
        })
    }

    private openConfirmClose = (id: number) => {
        const ads = this.props.advertisements.list.find(item => item.id === id);
        if (!ads || ads.state !== "active") return;
        this.setState({ confirmClose: id });
        this.setState({
            showCloseAdModal: !this.state.showCloseAdModal
        })
    }

    private closeAdvertisement = async (id: number, action: "enable" | "disable") => {
        const ads = this.props.advertisements.list.find(item => item.id === id);
        if (!ads || (action === "enable" && ads.state !== "disabled") || (action === "disable" && ads.state !== "active")) return;
        this.props.p2pAdvertisementStateChangeFetch({ id, action });
        this.closeConfirmClose();
    }

    private closeConfirmDelete = () => {
        this.setState((prev: State) => ({ ...prev, confirmDelete: null }));
        this.setState({
            showDeleteAdModal: false
        })
    }

    private openConfirmDelete = (id: number) => {
        this.setState((prev: State) => ({ ...prev, confirmDelete: id }));
        this.setState({
            showDeleteAdModal: !this.state.showDeleteAdModal
        })
    }

    private closeUpdateAd = () => {
        //this.setState({ openUpdateAd: null });
        this.setState({
            showUpdateAdModal: false
        })
    }

    private openUpdateAd = (id: number) => {
        const ads = this.props.advertisements.list.find(item => item.id === id);
        if (!ads) return;
        this.setState({ openUpdateAd: ads });
        this.setState({
            showUpdateAdModal: !this.state.showUpdateAdModal
        })
    }

    private deleteAdvertisement = async (id: number) => {
        this.props.p2pDeleteAdvertisementFetch(id);
        this.closeConfirmDelete();
    }

    private renderFilterRow = () => {
        const { intl, currencyState } = this.props;

        const optionsSideAll = intl.formatMessage({id: 'page.body.p2p.orders.all'});
        const optionsSideBuy = intl.formatMessage({id: 'page.body.p2p.orders.buy'});
        const optionsSideSell = intl.formatMessage({id: 'page.body.p2p.orders.sell'});
      
        const optionsSide = [
          { value: 'all', label: optionsSideAll },
          { value: 'buy', label: optionsSideBuy },
          { value: 'sell', label: optionsSideSell },
        ]; 

        const coinCurrencies = currencyState.list.filter((currency) => currency.type === "coin");
        const fiatCurrencies = currencyState.list.filter((currency) => currency.type === "fiat");

        const coinSelected = this.state.filter.coin_currency ?? coinCurrencies[0]?.id;
        const fiatSelected = this.state.filter.fiat_currency ?? fiatCurrencies[0]?.id;

        return (
            <div className="filter-elements">
                <div className="filter-elements__left">
                    <div className="filter-cell themes cn-select">
                        <SelectP2PFilter
                            fixedWidth={180}
                            value={this.state.filter.side}
                            suffixMarkup={intl.formatMessage({ id: "page.body.p2p.orders.side" })}
                            onChange={value => this.changeFilter('side', value)}
                            options={optionsSide}
                        />
                    </div>
                    <div className="filter-cell themes cn-select">
                        <SelectP2PFilter
                            searchAble
                            fixedWidth={205}
                            currentIcon={<CryptoIcon className='label-icon' 
                            code={coinSelected.toUpperCase()} />}
                            suffixMarkup={intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_coin" })}
                            value={coinSelected}
                            onChange={value => this.changeFilter("coin_currency", value)}
                            options={coinCurrencies.map(currency => ({
                                label: currency.id.toUpperCase(),
                                value: currency.id,
                                icon: <CryptoIcon className='label-icon' code={currency.id.toUpperCase()} />
                            }))}
                        />
                    </div>
                    <div className="filter-cell themes cn-select">
                        <SelectP2PFilter
                            searchAble
                            fixedWidth={205}
                            currentIcon={<CryptoIcon className='label-icon' 
                            code={fiatSelected.toUpperCase()} />}
                            suffixMarkup={intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_fiat" })}
                            value={fiatSelected}
                            onChange={value => this.changeFilter("fiat_currency", value)}
                            options={fiatCurrencies.map(currency => ({
                                label: currency.id.toUpperCase(),
                                value: currency.id,
                                icon: <CryptoIcon className='label-icon' code={currency.id.toUpperCase()} />
                            }))}
                        />
                    </div>
                </div>
            </div>
        );
    }
    
    private openDrillDownPrice = (id: number, price: number) => {
        this.setState({ openDrillDownPrice: id, priceChange: price });
    }
    private openDrillDownAmount = (id: number, type: "plus" | "sub") => {
        this.setState({ openDrillDownAmount: id, amountChangeType: type });
    }
    private closeDrillDownPrice = () => {
        this.setState({ openDrillDownPrice: null, priceChange: null });
    }
    private closeDrillDownAmount = () => {
        this.setState({ openDrillDownAmount: null, amountChange: null });
    }
    private changePrice = (value: number) => {
        this.setState({ priceChange: value });
    }
    private changeAmount = (value: number) => {
        this.setState({ amountChange: value });
    }

    private validateChangePrice = (value: number) => {
        const { openDrillDownPrice, priceChange } = this.state;
        const { intl, advertisements } = this.props;
        const ads = advertisements.list.find(item => item.id === openDrillDownPrice);
        if (!ads) return undefined;

        const currentAmount = ads.amount ?? "0";
        const newPrice = Number(currentAmount) * (priceChange ?? 0);
        
        let error: string | undefined = undefined;
        if (newPrice < Number(ads.max_amount)) {
            error = intl.formatMessage({ id: 'page.body.p2p.trade.message.reached.max_order.price'}, 
                {orderNewamount: Number(newPrice), orderCoin: ads.fiat_currency.toUpperCase()});
        }
        return error;
    }

    private submitPrice = () => {
        const { openDrillDownPrice, priceChange } = this.state;
        if (openDrillDownPrice && priceChange) {
            const error = this.validateChangePrice(priceChange);
            if (!!error) {
                this.props.alertPush({ message: [error], type: 'error' });
                return;
            };

            this.props.p2pAdvertisementPriceChangeFetch({ id: openDrillDownPrice, price: priceChange });
            this.closeDrillDownPrice();
        }
    }
    private validateChangeAmount = (_type: "plus" | "sub", value: number) => {
        const { openDrillDownAmount } = this.state;
        const { intl, advertisements, wallets } = this.props;
        const ads = advertisements.list.find(item => item.id === openDrillDownAmount);
        if (!ads) return undefined;

        const coinCurrency = ads.coin_currency ?? "";
        const balance = Number(wallets.find(item => item.currency === coinCurrency)?.balance ?? "0");
        const currentAmount = ads.amount ?? "0";
        const newAmount = _type === "plus" ? Number(currentAmount) + value : Number(currentAmount) - value;

        let error: string | undefined = undefined;
        if (ads.side === "sell" && _type === "plus" && value > 0) {
            if (newAmount > balance) {
                error = intl.formatMessage({ id: "page.body.p2p.trade.message.insufficient_balance" });
            }
            if (newAmount * Number(ads.price) > Number(ads.max_amount)) {
                error = intl.formatMessage({ id: "page.body.p2p.trade.message.reached.max_order.limit" });
            }
        }
        if (_type === "sub") {
            if (value >= Number(currentAmount)) {
                error = intl.formatMessage({ id: "page.body.p2p.advertisement.message.invalid_amount" });
            }
        }
        return error;
    }
    private submitAmount = () => {
        const { openDrillDownAmount, amountChange, amountChangeType } = this.state;
        if (openDrillDownAmount && amountChange) {
            const error = this.validateChangeAmount(amountChangeType, amountChange);
            if (!!error) {
                this.props.alertPush({ message: [error], type: 'error' });
                return;
            };
            this.props.p2pAdvertisementAmountChangeFetch({ id: openDrillDownAmount, amount: amountChange, type: amountChangeType });
            this.closeDrillDownAmount();
        }
    }
    private renderChangePrice() {
        const { priceChange, openDrillDownPrice } = this.state;
        const { intl, advertisements } = this.props;

        const ads = advertisements.list.find(item => item.id === openDrillDownPrice);
        if (!ads) return null;

        const currentAmount = ads.amount ?? "0";
        const newPrice = Number(currentAmount) * (priceChange ?? 0);

        const priceChangeDisabled = priceChange === Number(ads.price) || newPrice < Number(ads.max_amount);

        const error = this.validateChangePrice(priceChange ?? 0);
         
        return (
            <div className="flex-table-row prices">
                <div className="flex-table-col__change-price">
                    <div className="flex-table-col__change-price__body">
                        <Input
                            maxNumber={MAX_LIMIT_CURRENCY}
                            selectOnFocus 
                            type="number"
                            value={`${priceChange ?? ""}`}
                            onChange={(v) => this.changePrice(Number(v))}
                            placeholder={"0.00"}
                            error={error}
                            suffix={<div className="input-right">{ads.fiat_currency.toUpperCase()}</div>}
                        />
                        {error && <p className="error-message">{error}</p>}
                    </div>
                    <div className="flex-table-col__change-price__footer">
                        <Button
                            onClick={() => this.closeDrillDownPrice()}
                            className="medium-button themes black"
                        >
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.action.cancel" })}
                        </Button>
                        <Button
                            onClick={() => this.submitPrice()}
                            className="medium-button themes"
                            disabled={priceChangeDisabled}
                        >
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.action.apply" })}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    private renderChangeAmount() {
        const { amountChange, amountChangeType, openDrillDownAmount } = this.state;
        const { intl, advertisements, wallets, currencies } = this.props;
        const ads = advertisements.list.find(item => item.id === openDrillDownAmount);
        if (!ads) return null;

        const coinCurrency = ads.coin_currency ?? "";
        const balance = Number(wallets.find(item => item.currency === coinCurrency)?.balance ?? "0");
        const currentAmount = ads.amount ?? "0";
        const newAmount = amountChangeType === "plus" ? Number(currentAmount) + (amountChange ?? 0) : Number(currentAmount) - (amountChange ?? 0)

        const coinPrecision: Currency = currencies.find(item => item.id === coinCurrency);

        const error = this.validateChangeAmount(amountChangeType, amountChange ?? 0);

        const amountChangeDisabled = !amountChange 
                        || ads.side === "sell" && newAmount * Number(ads.price) > Number(ads.max_amount) 
                        || ads.side === "sell" && newAmount > balance;

        return (
            <div className="flex-table-col amounts">
                <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.amount" })}: {newAmount} {coinCurrency.toUpperCase()}</p>
                <div className="flex-table-col__change-price">
                    <div className="flex-table-col__change-price__body">
                        <label>{amountChangeType === "plus" ? intl.formatMessage({ id: "page.body.p2p.advertisement.action.plus_amount" }) : intl.formatMessage({ id: "page.body.p2p.advertisement.action.sub_amount" })}</label>
                        <Input
                            type="number"
                            maxNumber={MAX_LIMIT_CURRENCY}
                            selectOnFocus
                            value={`${amountChange ?? ""}`}
                            onChange={(v) => this.changeAmount(Number(v))} placeholder={"0.00"}
                            suffix={<div className="input-right">{coinCurrency.toUpperCase()}</div>}
                            error={error}
                            decimalScale={coinPrecision?.precision}
                        />
                        {error && <p className="error-message">{error}</p>}
                        {ads.side === "sell" ? (
                            <div className="flex-table-col__change-price__balance">
                                <p>{intl.formatMessage({ id: "page.body.p2p.trade.create.balance" })}:</p> 
                                <span>{Decimal.format(balance, coinPrecision.precision, ",")}</span>
                                <p>{coinCurrency.toUpperCase()}</p>
                                <Link to={`/wallets/spot/${ads.coin_currency}/deposit`} className="deposit-link">
                                    <DepositPlusIcon />
                                </Link>
                            </div>
                            ) : null }
                    </div>
                    <div className="flex-table-col__change-price__footer">
                        <Button
                            onClick={() => this.closeDrillDownAmount()}
                            className="medium-button themes black"
                        >
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.action.cancel" })}
                        </Button>
                        <Button
                            onClick={() => this.submitAmount()}
                            className="medium-button themes"
                            disabled={amountChangeDisabled}
                        >
                            {intl.formatMessage({ id: "page.body.p2p.advertisement.action.apply" })}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    private renderAdvertisements() {
        const { advertisements, intl } = this.props;
        return (
            <div className="flex-table themes">
                <div className="flex-table__head">
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.coin" })}</span>
                    <span className="prices">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.price" })}</span>
                    <span className="amounts">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.available" })}/{intl.formatMessage({ id: "page.body.p2p.advertisement.content.limit" })}</span>
                    <span>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.payment" })}</span>
                    <span className="text-right">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.state" })}</span>
                    <span className="text-right">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.actions" })}</span>
                </div>
                <div className="flex-table__body">
                    {advertisements.list.map((offer, index) => {
                        const openDrillDownPrice = this.state.openDrillDownPrice === offer.id;
                        const isOpenDillDownAmount = this.state.openDrillDownAmount === offer.id;
                        return (
                            <div key={index} className="flex-table-width">
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
                                {openDrillDownPrice ? this.renderChangePrice() : (
                                    <div className="flex-table-row prices">
                                        <div className="offer-price">
                                            <span>{Decimal.format(offer.price, 2, ',')}</span> {offer.fiat_currency.toUpperCase()}
                                            {offer.lock_trade_amount > 0 ? <div /> : (
                                                <button
                                                    onClick={() => this.openDrillDownPrice(offer.id, Number(offer.price))}
                                                    className="amount-edit"
                                                >
                                                    {intl.formatMessage({ id: "page.body.p2p.advertisement.action.edit" })}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {isOpenDillDownAmount ? this.renderChangeAmount() : (
                                    <div className="flex-table-col amounts">
                                        <div className="boxes__inside">
                                            <div className="flex gap-2 items-center">
                                                <p>{offer.amount} {offer.coin_currency.toUpperCase()}</p>
                                                {offer.lock_trade_amount > 0 ? <div /> : (
                                                    <div className="flex gap-2 items-center">
                                                        <button
                                                            onClick={() => this.openDrillDownAmount(offer.id, "sub")}
                                                            className="amount-change"
                                                        >
                                                            -
                                                        </button>
                                                        <button
                                                            onClick={() => this.openDrillDownAmount(offer.id, "plus")}
                                                            className="amount-change"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <p>{Decimal.format(offer.min_amount, 2, ',')} - {Decimal.format(offer.max_amount, 2, ',')} {offer.fiat_currency.toUpperCase()}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex-table-col">
                                    <div key={index} className="offer-payments">
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
                                    {offer.lock_trade_amount > 0 ? <span className="ad-state ad-state__completed">{intl.formatMessage({ id: "page.body.p2p.orders.state.completed" })} <SucceedIcon /></span> : (
                                        <React.Fragment>
                                            {offer.state !== "active" ? 
                                                <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.action.nonactive" })} | </p> : 
                                                <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.action.active" })} | </p>}
                                            {this.state.filter?.side === "buy" ? 
                                                <p className="ad-state ad-state__buy">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.buy" })}</p> : 
                                                <p className="ad-state ad-state__sell">{intl.formatMessage({ id: "page.body.p2p.advertisement.content.sell" })}</p>}
                                        </React.Fragment>
                                    )}
                                </div>
                                <div className="flex-table-row block-right">
                                    {offer.lock_trade_amount > 0 ? <div /> : (
                                        <React.Fragment>
                                            <Button
                                                className="little-button themes blue"
                                                onClick={() => this.openUpdateAd(offer.id)}
                                            >
                                                {intl.formatMessage({id: 'page.body.p2p.advertisement.action.update'})}
                                            </Button>
                                            {offer.lock_trade_amount > 0 ? <div /> : (
                                                <React.Fragment>
                                                    {offer.state !== "active" &&
                                                    <div className="ad-status ad-status__nonactive">
                                                        <OverlayTrigger 
                                                            placement="auto"
                                                            delay={{ show: 250, hide: 300 }} 
                                                            overlay={<Tooltip className="themes" title="page.body.p2p.advertisement.action.activate" />}>
                                                            <IconButton
                                                                onClick={() => this.closeAdvertisement(offer.id, "enable")}
                                                                sx={{
                                                                    color: 'var(--color-succes)',
                                                                    '&:hover': {
                                                                        color: 'var(--color-succes)'
                                                                    }
                                                                }}
                                                            >
                                                                <div><ActivateIcon /></div>
                                                            </IconButton>
                                                        </OverlayTrigger>
                                                    </div>}
                                                    {offer.state !== "disabled" &&
                                                    <div className="ad-status ad-status__active">
                                                        <OverlayTrigger 
                                                            placement="auto"
                                                            delay={{ show: 250, hide: 300 }} 
                                                            overlay={<Tooltip className="themes" title="page.body.p2p.advertisement.action.deactivate" />}>
                                                            <IconButton
                                                                onClick={() => this.openConfirmClose(offer.id)}
                                                                sx={{
                                                                    color: 'var(--color-danger)',
                                                                    '&:hover': {
                                                                        color: 'var(--color-danger)'
                                                                    }
                                                                }}
                                                            >
                                                                <div><DeactivateIcon /></div>
                                                            </IconButton>
                                                        </OverlayTrigger>
                                                    </div>}
                                                </React.Fragment>
                                            )}
                                        </React.Fragment>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    private renderContent() {
        const { advertisements, intl } = this.props;
        return (
            <div className="p2pscreen__wrapper">
                <div className="p2porders-myads-screen"> 
                    <h2>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.my_ads" })}</h2>
                    {this.renderFilterRow()} 
                    {advertisements.loading ? 
                        <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div> : advertisements.list.length > 0 ? this.renderAdvertisements() : 
                        <NoResultData 
                            class="themes" 
                            title={intl.formatMessage({ id: "page.body.p2p.advertisement.content.my_ads.empty" })}
                            suffix={this.buttonmodal()}
                        />
                    }
                    {advertisements.list.length > 0 && 
                        <div className="p2pscreen__footer">
                            <Pagination onlyNextPrev isEndOfData={advertisements.list.length < limitData} currentPage={this.state.filter.page ?? 1} totalPages={1} onPageChange={(p) => this.changeFilter("page", p)} />
                        </div>
                    }
                </div>
            </div>
        );
    }; 

    private buttonmodal() {
        const { user, intl } = this.props;
        return (
            <React.Fragment>
                { user.level === 3 ? (
                    <Button
                        href='/p2p/advertisements/create'
                        className="medium-button themes"
                    >
                        {intl.formatMessage({ id: "page.body.p2p.advertisement.content.publish.now" })}
                    </Button>
                ) : (
                    <Button
                        onClick={this.showModalVerify}
                        className="medium-button themes"
                    >
                        {intl.formatMessage({ id: "page.body.p2p.advertisement.content.publish.now" })}
                    </Button>
                ) }
            </React.Fragment>
        )
    }

    private showModalVerify = () => {
        this.setState({
            showModalVerify: !this.state.showModalVerify,
        });
    };

    private closeModalVerify = () => {
        this.setState({
            showModalVerify: false,
        });
    };

    public render() {
        const { confirmDelete, confirmClose, openUpdateAd } = this.state;
        const { intl } = this.props;
        return (
            <div className="p2pscreen">
                <HeaderTrading />
                <AdvertisementMenu />
                {this.renderContent()}

                <CSSTransition
                    in={this.state.showModalVerify}
                    timeout={{
                    enter: 100,
                    exit: 400
                    }}
                    unmountOnExit
                >
                    <div className="modal-window"> 
                        <div className="modal-window__container wide scroll fadet">
                            <div className="modal-window__container__header">
                                <h1>{intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_payments.verify.requirements" })}</h1>
                                <div className="modal-window__container__header__close">
                                    <IconButton 
                                        onClick={this.closeModalVerify}
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
                            <div className="payment-options__payment"> 
                                <div className="payment-options__payment__title">
                                    {intl.formatMessage({ id: "page.body.p2p.advertisement.component.select_payments.verify" })}
                                </div>
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
                            </div>
                            <div className="p2p-modal__footer">
                                <Button
                                    onClick={this.closeModalVerify}
                                    className="medium-button themes black"
                                >   
                                    {intl.formatMessage({ id: 'page.body.p2p.trade.create.close' })}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CSSTransition>

                <CSSTransition
                    in={this.state.showDeleteAdModal}
                    timeout={{
                        enter: 100,
                        exit: 400
                    }}
                    unmountOnExit
                >
                    <div className="themes modal-window">
                        <div className="modal-window__container fadet">
                            <div className="login-form"> 
                                <div className="login-form__content">
                                    <div className="modal-window__container__header"> 
                                        <h1>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.delete_ads" })}</h1>
                                        <div className="modal-window__container__header__close">
                                            <IconButton 
                                                onClick={() => this.closeConfirmDelete()}
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
                                    <div className="modal-window__title">
                                        {intl.formatMessage({id: 'page.body.p2p.advertisement.content.confirm_delete_ads'})}
                                    </div>
                                    <div className="modal-window__buttons">
                                        <Button
                                            onClick={() => this.closeConfirmDelete()} 
                                            className="medium-button themes black"
                                        >
                                            {intl.formatMessage({id: 'page.body.p2p.create.offer.cancel'})}
                                        </Button>
                                        <Button
                                            onClick={() => this.deleteAdvertisement(confirmDelete)}
                                            className="medium-button themes red"
                                        >
                                            {intl.formatMessage({id: 'page.body.p2p.advertisement.action.delete'})}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </CSSTransition>

                <CSSTransition
                    in={this.state.showCloseAdModal}
                    timeout={{
                        enter: 100,
                        exit: 400
                    }}
                    unmountOnExit
                >
                    <div className="themes modal-window">
                        <div className="modal-window__container fadet">
                            <div className="login-form"> 
                                <div className="login-form__content">
                                    <div className="modal-window__container__header"> 
                                        <h1>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.close_ads" })}</h1>
                                        <div className="modal-window__container__header__close">
                                            <IconButton 
                                                onClick={() => this.closeConfirmClose()}
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
                                    <div className="modal-window__title">
                                        {intl.formatMessage({id: 'page.body.p2p.advertisement.content.confirm_close_ads'})}
                                    </div>
                                    <div className="modal-window__buttons">
                                        <Button
                                            onClick={() => this.closeConfirmClose()}
                                            className="medium-button themes black"
                                        >
                                            {intl.formatMessage({id: 'page.body.p2p.create.offer.cancel'})}
                                        </Button>
                                        <Button
                                            onClick={() => this.closeAdvertisement(confirmClose, "disable")}
                                            className="medium-button themes red"
                                        >
                                            {intl.formatMessage({id: 'page.body.p2p.advertisement.action.close'})}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </CSSTransition>
                <CSSTransition
                    in={this.state.showUpdateAdModal}
                    timeout={{
                        enter: 100,
                        exit: 400
                    }}
                    unmountOnExit
                >
                    {openUpdateAd !== null ? 
                    <div className="themes modal-window">
                        <div className="modal-window__container update-ad-modal scroll fadet">
                            <div className="login-form"> 
                                <div className="login-form__content">
                                    <div className="modal-window__container__header"> 
                                        <h1>{intl.formatMessage({ id: "page.body.p2p.advertisement.title.update" })}</h1>
                                        <div className="modal-window__container__header__close">
                                            <IconButton 
                                                onClick={() => this.closeUpdateAd()}
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
                                    <UpdateP2PAdsModal 
                                        advertisement={openUpdateAd} 
                                        onClose={() => this.closeUpdateAd()}
                                    />
                                </div>
                            </div>
                        </div>
                    </div> : null }
                </CSSTransition>
            </div>);
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    advertisements: state.user.p2pAdvertisements,
    currencies: selectCurrencies(state),
    currencyState: state.public.currencies,
});

const mapActionToProps = {
    alertPush: alertPush,
    p2pAdvertisementsFetch: p2pAdvertisementsFetch,
    p2pDeleteAdvertisementFetch: p2pDeleteAdvertisementFetch,
    p2pAdvertisementStateChangeFetch: p2pAdvertisementStateChangeFetch,
    p2pAdvertisementPriceChangeFetch: p2pAdvertisementPriceChangeFetch,
    p2pAdvertisementAmountChangeFetch: p2pAdvertisementAmountChangeFetch,
}

export const MyAdvertisementsScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapActionToProps),
)(MyAdvertisements) as React.ComponentClass<Pick<Props, "uid">>;
