import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DEFAULT_PERCENTAGE_PRECISION } from 'src/constants';
import { IntlProps } from '../../';
import { Decimal } from '../../components/Decimal';
import {
    Market,
    RootState,
    selectCurrentMarket,
    selectMarkets,
    marketsFetch,
    selectMarketTickers,
    marketsTickersFetch,
    Ticker,
    PublicTrade,
    selectLastRecentTrade
} from '../../modules';


interface ReduxProps {
    currentMarket?: Market;
    lastRecentTrade?: PublicTrade;
    markets: Market[];
    marketTickers: {
        [key: string]: Ticker,
    };
}

interface DispatchProps {
    fetchMarkets: typeof marketsFetch;
    fetchTickers: typeof marketsTickersFetch;
}

type Props = IntlProps & ReduxProps & DispatchProps;

// tslint:disable no-any jsx-no-multiline-js
class HeaderToolbarContainer extends React.Component<Props> {
    componentDidMount(): void {
        if (!this.props.markets.length) {
            this.props.fetchMarkets();
        }

        if (!this.props.marketTickers.length) {
            this.props.fetchTickers();
        }
    }

    public render() {
        const { marketTickers, currentMarket } = this.props;
        const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, avg_price:0, price_change_percent: '0.00%' };

        const priceChanged = Number(this.getTickerValue('last')) - Number(this.getTickerValue('open'))
        
        const isPositive = currentMarket && /\+/.test(this.getTickerValue('price_change_percent'));
        const marketChangeColor = isPositive ? 'positive' : 'negative';

        const bidUnit = currentMarket && currentMarket.quote_unit.toUpperCase();
        const askUnit = currentMarket && currentMarket.base_unit.toUpperCase();

        return (
            <div className="statistic-header__toolbar">
                <div className="statistic-header__toolbar__row">
                    <div className="name">
                        {this.translate('page.body.trade.toolBar.change')}
                    </div>
                    <div className={`datas datas__${marketChangeColor}`}>
                        {currentMarket && `${isPositive ? '+' : ''}${Decimal.format(priceChanged, currentMarket.price_precision, ',')}`} ({currentMarket && this.formatPercentageValue((marketTickers[currentMarket.id] || defaultTicker).price_change_percent)})
                    </div>
                </div>
                <div className="statistic-header__toolbar__row">
                    <div className="name">
                        {this.translate('page.body.trade.toolBar.highest')} ({bidUnit})
                    </div>
                    <div className="datas">
                        {currentMarket && Decimal.format(Number(this.getTickerValue('high')), currentMarket.price_precision, ',')}
                    </div>
                </div>
                <div className="statistic-header__toolbar__row">
                    <div className="name">
                        {this.translate('page.body.trade.toolBar.lowest')} ({bidUnit})
                    </div>
                    <div className="datas">
                        {currentMarket && Decimal.format(Number(this.getTickerValue('low')), currentMarket.price_precision, ',')}
                    </div>
                </div>
                <div className="statistic-header__toolbar__row">
                    <div className="name">
                        {this.translate('page.body.openOrders.header.avgPrice')} ({bidUnit})
                    </div>
                    <div className="datas">
                        {currentMarket && Decimal.format(Number(this.getTickerValue('avg_price')), currentMarket.price_precision, ',')}
                    </div>
                </div>
                <div className="statistic-header__toolbar__row">
                    <div className="name">
                        {this.translate('page.body.trade.toolBar.volume')} ({askUnit})
                    </div>
                    <div className="datas">
                        {currentMarket && Decimal.format(Number(this.getTickerValue('amount')), currentMarket.amount_precision, ',')}
                    </div>
                </div>
                <div className="statistic-header__toolbar__row">
                    <div className="name">
                        {this.translate('page.body.trade.toolBar.volume')} ({bidUnit})
                    </div>
                    <div className="datas">
                        {currentMarket && Decimal.format(Number(this.getTickerValue('volume')), currentMarket.price_precision, ',')}
                    </div>
                </div>
            </div>
        );
    }
  
    private formatPercentageValue = (value: string) => (
        <React.Fragment>
            {value?.charAt(0)}
            {Decimal.format(value?.slice(1, -1), DEFAULT_PERCENTAGE_PRECISION, ',')}%
        </React.Fragment>
    );
 
    private getTickerValue = (value: string) => {
        const { marketTickers, currentMarket } = this.props;
        const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, avg_price:0, price_change_percent: '0.00%'};

        return currentMarket && (marketTickers[currentMarket.id] || defaultTicker)[value];
    };

    private translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    markets: selectMarkets(state),
    marketTickers: selectMarketTickers(state),
    lastRecentTrade: selectLastRecentTrade(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchTickers: () => dispatch(marketsTickersFetch()),
});


const HeaderToolbar = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderToolbarContainer) as any) as any);

export {
    HeaderToolbar,
};
