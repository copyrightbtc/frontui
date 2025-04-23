import React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from 'src';
import { Decimal } from 'src/components/Decimal';
import { CurrentMarketInfo, TradingTabs } from 'src/mobile/components';
import { getUrlPart, setDocumentTitle } from 'src/helpers';
import {
    RootState,
    selectCurrentMarket,
    selectMarketTickers,
    selectUserInfo,
    selectUserLoggedIn,
    setCurrentMarket,
    setCurrentPrice,
    Ticker,
    User,
} from 'src/modules';
import { saveLayouts, selectGridLayoutState } from 'src/modules/public/gridLayout';
import { Market, marketsFetch, selectMarkets } from 'src/modules/public/markets';

 
interface ReduxProps {
    currentMarket: Market | undefined;
    markets: Market[];
    user: User;
    userLoggedIn: boolean;
    tickers: {
        [pair: string]: Ticker,
    };
}

interface DispatchProps {
    marketsFetch: typeof marketsFetch;
    setCurrentPrice: typeof setCurrentPrice;
    setCurrentMarket: typeof setCurrentMarket;
    saveLayouts: typeof saveLayouts;
}
 
type Props = DispatchProps & ReduxProps & RouteComponentProps & IntlProps;
 
class TradingMobile extends React.Component<Props> {

    public componentDidMount() {
        setDocumentTitle('Trading');
        const { markets } = this.props;

        if (markets.length < 1) {
            this.props.marketsFetch();
        }
    }

    public componentWillUnmount() {
        this.props.setCurrentPrice(undefined);
    }

    public componentWillReceiveProps(nextProps) {
        const {
            history,
            markets,
            currentMarket,
            user: { role },
        } = this.props;

        if (markets.length !== nextProps.markets.length) {
            this.setMarketFromUrlIfExists(nextProps.markets);
        }

        if (nextProps.currentMarket) {
            const marketFromUrl = history.location.pathname.split('/');
            const marketNotMatched = nextProps.currentMarket.id !== marketFromUrl[marketFromUrl.length - 1];

            if (marketNotMatched && nextProps.currentMarket.state) {
                history.replace(`/trading/${nextProps.currentMarket.id}`);
            }
        }

        if (nextProps.currentMarket && nextProps.tickers) {
            this.setTradingTitle(nextProps.currentMarket, nextProps.tickers);
        }

        if (currentMarket?.id !== nextProps.currentMarket?.id && nextProps.currentMarket && role !== 'admin' && role !== 'superadmin') {
            const firstActiveMarket = markets.length && markets.find(item => item.state && item.state !== 'hidden');

            if (nextProps.currentMarket.state && nextProps.currentMarket.state === 'hidden') {
                history.replace(`/trading/${firstActiveMarket.id}`);

                this.props.setCurrentMarket(firstActiveMarket);

            }
        }
    }

    public render() {
        return (
            <div className="trading-screen-mobile">
                <CurrentMarketInfo />
                <TradingTabs />
            </div>
        );
    }

    private setMarketFromUrlIfExists = (markets: Market[]): void => {
        const urlMarket: string = getUrlPart(2, window.location.pathname);
        const market: Market | undefined = markets.find(item => item.id === urlMarket);

        if (market) {
            this.props.setCurrentMarket(market);
        }
    };

    private setTradingTitle = (market: Market, tickers: ReduxProps['tickers']) => {
        const tickerPrice = tickers[market.id] ? tickers[market.id].last : '0.0';
        document.title = `${Decimal.format(tickerPrice, market.price_precision, ',')} 
            | ${market.base_unit.toUpperCase()} ${market.quote_unit.toUpperCase()}
            | Sfor.Trade`;
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currentMarket: selectCurrentMarket(state),
    markets: selectMarkets(state),
    user: selectUserInfo(state),
    userLoggedIn: selectUserLoggedIn(state),
    rgl: selectGridLayoutState(state),
    tickers: selectMarketTickers(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    marketsFetch: () => dispatch(marketsFetch()),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    setCurrentMarket: payload => dispatch(setCurrentMarket(payload)),
    saveLayouts: payload => dispatch(saveLayouts(payload)),
});

export const TradingScreenMobile = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(TradingMobile) as React.ComponentClass;