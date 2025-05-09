import React, { FC, ReactElement, useCallback, useEffect } from 'react';
import { FillSpinner } from "react-spinners-kit";
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY, DEFAULT_FIAT_PRECISION } from 'src/constants';
import { IconButton } from '@mui/material';
import { NoVisible } from 'src/assets/images/customization/NoVisible';
import { Visible } from 'src/assets/images/customization/Visible';
import { ChevronIcon } from 'src/assets/images/ChevronIcon';
import { useDocumentTitle, useMarketsFetch, useMarketsTickersFetch, useWalletsFetch } from 'src/hooks';
import { formatWithSeparators, Decimal } from 'src/components';
import { estimatePlatformValue, estimateUnitValue, estimateValue } from 'src/helpers/estimateValue';
import { 
    selectCurrencies,
    selectMarkets,
    selectMarketTickers,
    selectWallets,
    Wallet,
    selectUserIsMember,
} from 'src/modules';

import { WalletsHeader } from 'src/components/WalletsHeader';

interface ExtendedWallet extends Wallet {
    spotBalance?: string;
    spotLocked?: string;
}

const WalletsMobileScreen: FC = (): ReactElement => {
    const history = useHistory();
    const { formatMessage } = useIntl();
    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const wallets = useSelector(selectWallets); 
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const isMember: boolean = useSelector(selectUserIsMember);

    const [filterValue, setFilterValue] = React.useState<string>('');

    const [filteredWallets, setFilteredWallets] = React.useState<ExtendedWallet[]>([]);

    const [isVisibleTotal, setIsVisibleTotal] = React.useState(false);
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);
    const [mergedWallets, setMergedWallets] = React.useState<ExtendedWallet[]>([]);

    useWalletsFetch();
    useMarketsTickersFetch();
    useMarketsFetch();

    useEffect(() => {
        if (wallets.length && currencies.length) {
            const extendedWallets: ExtendedWallet[] = currencies.map(cur => {

                if (cur.status === 'hidden' && isMember) {
                    return null;
                }

                const spotWallet = wallets.find(i => i.currency === cur.id);

                return {
                    ...(spotWallet),
                    spotBalance: spotWallet ? spotWallet.balance : '0',
                    spotLocked: spotWallet ? spotWallet.locked : '0',
                };
            });

            const extendedWalletsFilter = extendedWallets.filter(item => item && item.currency);

            setFilteredWallets(extendedWalletsFilter);
            setMergedWallets(extendedWalletsFilter);
        }
    }, [wallets, currencies]);

    
    const renderSecondaryCurrencyValuation = (value: string) => {
        const estimatedValueSecondary = estimateUnitValue(VALUATION_SECONDARY_CURRENCY, VALUATION_PRIMARY_CURRENCY, +value, currencies, markets, tickers);

        return (
            <div className="value-container">
                <div className="value">
                    {formatWithSeparators(estimatedValueSecondary, ',')}
                </div>
                <div className="value-sign">
                    {VALUATION_SECONDARY_CURRENCY.toUpperCase()}
                </div>
            </div>
        );
    };
    const estimatedValue = React.useMemo(() => {
        return estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
    }, [currencies, wallets, markets, tickers]);

    const handleClickOverview = useCallback(currency => {
        history.push(`/wallets/${currency}/overview`);
    }, [history]);

    useWalletsFetch();
    useDocumentTitle(translate('page.header.navbar.wallets'));

    const retrieveData = () => {
        const list = nonZeroSelected ? filteredWallets.filter(i => i.balance && Number(i.balance) > 0) : filteredWallets;
        const filteredList = list.filter(i => !filterValue || i.name?.toLocaleLowerCase().includes(filterValue.toLowerCase()) || i.currency?.toLocaleLowerCase().includes(filterValue.toLowerCase()));

        return !filteredList.length ? [[]] : filteredList.map((item, index) => {
            const {
                currency,
                name,
                fixed,
                spotBalance,
                spotLocked,
            } = item;
            const totalBalance = Number(spotBalance || 0) + Number(spotLocked || 0);

            const estimatedValueTotal = estimatePlatformValue(currency, currencies, totalBalance);
            const estimatedValueAvailable = estimatePlatformValue(currency, currencies, Number(spotBalance || 0));
            const estimatedValueLocked = estimatePlatformValue(currency, currencies, Number(spotLocked || 0));
    
            return (
                <div className='mobile-wallets__currencys' onClick={() => handleClickOverview(currency)}>
                    <div key={index} className="coin">
                        <CryptoIcon code={currency.toUpperCase()} />
                        <div className="info-col">
                            <span className="bold">{currency?.toUpperCase()}</span>
                            <span className="secondary">{name}</span>
                        </div>
                    </div>
                    <div className="balance">
                        { !isVisibleTotal ? (
                            <div className="info-col">
                                <span className="bold">
                                    <Decimal key={index} fixed={fixed} thousSep="," children={totalBalance ? totalBalance.toString() : '0'}/>
                                </span>
                                <span className="secondary">≈ $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedValueTotal}</Decimal></span>
                            </div>
                        ) : ( 
                            <div className="info-col">
                                <span className="bold">
                                    **********
                                </span>
                                <span className="secondary">**********</span>
                            </div>
                        )}
                    </div>
                    <div className="arrow-right">
                        <ChevronIcon />
                    </div>
                </div> 
            );
        })
    };

    return (
        <div className='mobile-wallets'>
            <div className='mobile-wallets__header'>
                <div className='mobile-wallets__header__top'>
                    <div className="mobile-wallets__header__top__title">
                        {translate('page.body.wallets.estimated_value')}({VALUATION_SECONDARY_CURRENCY.toUpperCase()})
                        <IconButton 
                            onClick={() => setIsVisibleTotal(!isVisibleTotal)}
                            className='visible-button'
                            sx={{
                                width: '34px',
                                height: '34px',
                                marginLeft: '5px',
                                opacity: '.85',
                                color: 'var(--color-dark)',
                                '&:hover': {
                                    color: 'var(--color-dark)',
                                    opacity: '1',
                                }
                            }}
                        >
                            { isVisibleTotal ? <Visible /> : <NoVisible /> }
                        </IconButton>
                    </div>
                    { !isVisibleTotal ? (
                        <>
                            <div className="main-currency">
                                {VALUATION_SECONDARY_CURRENCY && renderSecondaryCurrencyValuation(estimatedValue)}
                            </div>
                            <div className="second-currency">
                                <span> ≈ ${VALUATION_PRIMARY_CURRENCY.toUpperCase() && formatWithSeparators(estimatedValue, ',')}</span>
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
                            </div>
                        </>
                    )}
                </div>
                <div className='mobile-wallets__header__bottom'>
                    <WalletsHeader
                        wallets={mergedWallets}
                        nonZeroSelected={nonZeroSelected}
                        setFilterValue={setFilterValue}
                        setFilteredWallets={setFilteredWallets}
                        handleClickCheckBox={setNonZeroSelected}
                    />
                </div>
            </div>
            {(filteredWallets?.length === 0) && <div className="spinner-loader-center absolute"><FillSpinner size={19} color="var(--color-accent)"/></div>}
            {retrieveData()}
        </div>
    );
};

export {
    WalletsMobileScreen,
};
