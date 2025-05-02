import * as React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { CryptoIcon } from '../../components/CryptoIcon';
import { Decimal } from '../../components/Decimal';

import {
    Market,
    RootState,
    selectCurrentMarket,
    selectMobileWalletUi,
    setMobileWalletUi,
    toggleMarketSelector,
    PublicTrade,
    selectLastRecentTrade,
    Ticker,
    selectMarketTickers,
} from '../../modules';
import { HeaderToolbar } from '../HeaderToolbar';

interface ReduxProps {
    currentMarket: Market | undefined;
    mobileWallet: string;
    lastRecentTrade?: PublicTrade;
    marketTickers: {
        [key: string]: Ticker,
    };
}

interface DispatchProps {
    setMobileWalletUi: typeof setMobileWalletUi;
    toggleMarketSelector: typeof toggleMarketSelector;
}

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}

type Props = ReduxProps & DispatchProps & IntlProps & LocationProps;

class Head extends React.Component<Props> {
    public render() {

        return (
            <div className="statistic-header">
                {this.renderMarketToggler()}
                <HeaderToolbar />
            </div>
        );
    }

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };
 

    private renderMarketToggler = () => {
        const { currentMarket } = this.props;

        return (
            <div className="markets-select empty">
                <CryptoIcon className="coin-icon" code={currentMarket && currentMarket.base_unit.toUpperCase()} />
                <div className="markets-select__wrapper">
                    <div className="name">{currentMarket && currentMarket.name}</div>
                    {this.lastPrice()}
                </div>
            </div>
        );
    };

    public lastPrice() {
        const { currentMarket, lastRecentTrade, marketTickers } = this.props;

        if (currentMarket) {
            let lastPrice = '';
            let priceChangeSign: '' | 'positive' | 'negative' = '';

            if (lastRecentTrade?.market === currentMarket.id) {
                lastPrice = lastRecentTrade.price;

                if (Number(lastRecentTrade.price_change) >= 0) {
                    priceChangeSign = 'positive';
                } else if (Number(lastRecentTrade.price_change) < 0) {
                    priceChangeSign = 'negative';
                }
            } else {
                const currentTicker = currentMarket && this.getTickerValueLPrice(currentMarket, marketTickers);
                lastPrice = currentTicker.last;

                if (currentTicker.price_change_percent.includes('+')) {
                    priceChangeSign = 'positive';
                } else if (currentTicker.price_change_percent.includes('-')) {
                    priceChangeSign = 'negative';
                }
            }

            const cn = classNames('', {
                'negative': priceChangeSign === 'negative',
                'positive': priceChangeSign === 'positive',
            });

            return (
                <div className="data">
                    <div className={`price price__${cn}`}>
                        {Decimal.format(lastPrice, currentMarket.price_precision, ',')}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="data">
                    <div className="price">
                        0.00
                    </div>
                </div>
            );
        }
    };

    private getTickerValueLPrice = (currentMarket: Market, tickers: { [key: string]: Ticker }) => {
        const defaultTicker = { amount: '0', low: '0', last: '0', high: '0', volume: '0', open: '0', price_change_percent: '+0.00%' };

        return tickers[currentMarket.id] || defaultTicker;
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    mobileWallet: selectMobileWalletUi(state),
    marketTickers: selectMarketTickers(state),
    lastRecentTrade: selectLastRecentTrade(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    setMobileWalletUi: (payload) => dispatch(setMobileWalletUi(payload)),
    toggleMarketSelector: () => dispatch(toggleMarketSelector()),
});

export const HeaderEmpty = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(Head) as React.ComponentClass;
