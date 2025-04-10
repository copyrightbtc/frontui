import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import { NoVisible } from 'src/assets/images/customization/NoVisible';
import { Visible } from 'src/assets/images/customization/Visible';
import { useMarketsFetch, useMarketsTickersFetch, useWalletsFetch } from 'src/hooks';
import { formatWithSeparators } from '../../../components';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';
import { estimateUnitValue, estimateValue } from '../../../helpers/estimateValue';
import { Link } from 'react-router-dom';
import { ArrowIcon } from '../../../containers/ToolBar/icons/ArrowIcon';
import {
    selectCurrencies,
    selectMarkets,
    selectMarketTickers,
    Wallet,
} from '../../../modules';

interface EstimatedValueProps {
    wallets: Wallet[];
}

type Props = EstimatedValueProps;

const noLinkRoutes = [
    '/p2p/',
];

const EstimatedValue: React.FC<Props> = (props: Props): React.ReactElement => {
    const shouldRenderLink = noLinkRoutes.some(r => location.pathname.includes(r)) && location.pathname !== '/';
    const { formatMessage } = useIntl();
    const translate = React.useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);

    const [isVisible, setIsVisible] = React.useState(false);
    const [isVisibleTotal, setIsVisibleTotal] = React.useState(false);

    const { wallets } = props;
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);

    useMarketsTickersFetch();
    useMarketsFetch();
    useWalletsFetch();

    const renderSecondaryCurrencyValuation = React.useCallback((value: string) => {
        const estimatedValueSecondary = estimateUnitValue(VALUATION_SECONDARY_CURRENCY, VALUATION_PRIMARY_CURRENCY, +value, currencies, markets, tickers);

        return (
            <span className="value-container">
                <span className="value">
                    {formatWithSeparators(estimatedValueSecondary, ',')}
                </span>
                <span className="value-sign">
                    {VALUATION_SECONDARY_CURRENCY.toUpperCase()}
                </span>
            </span>
        );
    }, [currencies, markets, tickers]);

    const estimatedValue = React.useMemo(() => {
        return estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
    }, [currencies, wallets, markets, tickers]);

    return (
        <div className="estimated-value">
            {!shouldRenderLink ? (
                <div className="estimated-value__total">
                    <div className="estimated-value__total__title">
                        {translate('page.body.wallets.estimated_value')}({VALUATION_SECONDARY_CURRENCY.toUpperCase()})
                        <IconButton 
                            onClick={() => setIsVisibleTotal(!isVisibleTotal)}
                            sx={{
                                width: '34px',
                                height: '34px',
                                marginLeft: '5px',
                                color: 'var(--color-dark)',
                                '&:hover': {
                                    color: 'var(--color-accent)'
                                }
                            }}
                        >
                            { isVisible ? <Visible /> : <NoVisible /> }
                        </IconButton>
                    </div>
                    <span className="value-container">
                        <span className="value">
                            {formatWithSeparators(estimatedValue, ',')}
                        </span> 
                    </span>
                    {VALUATION_SECONDARY_CURRENCY && renderSecondaryCurrencyValuation(estimatedValue)}
                </div>
            ) : (
                <div className="estimated-value__avail">
                    <div className="estimated-value__avail__title">
                        {translate('page.body.wallets.estimated_valuep2p')}({VALUATION_SECONDARY_CURRENCY.toUpperCase()})
                        <IconButton 
                            onClick={() => setIsVisible(!isVisible)}
                            className='visible-button themes'
                            sx={{
                                width: '34px',
                                height: '34px',
                                marginLeft: '5px',
                                opacity: '.85',
                                color: '#fff',
                                '&:hover': {
                                    color: '#fff',
                                    opacity: '1',
                                }
                            }}
                        >
                            { isVisible ? <Visible /> : <NoVisible /> }
                        </IconButton>
                    </div>
                    <Link className="estimated-value__avail__balance" to="/wallets" target={"_blank"}>
                        { !isVisible ? (
                            <>
                                <div className="main-currency">
                                    {VALUATION_SECONDARY_CURRENCY && renderSecondaryCurrencyValuation(estimatedValue)}
                                </div>
                                <div className="second-currency">
                                    <span> ≈ ${VALUATION_PRIMARY_CURRENCY.toUpperCase() && formatWithSeparators(estimatedValue, ',')}</span>
                                    <ArrowIcon />
                                </div>
                            </>
                        ) : (
                            <>
                             <div className="main-currency">
                                 <div className="value-container">
                                     <div className="value">**************</div>
                                     <div className="value-sign">{VALUATION_SECONDARY_CURRENCY}</div>
                                 </div>
                             </div>
                            <div className="second-currency">
                                <span> ≈ $**************</span>
                                <ArrowIcon />
                            </div>
                        </>
                        )}
                    </Link>
                </div>
            )}
        </div>
    );
}

export { EstimatedValue };
