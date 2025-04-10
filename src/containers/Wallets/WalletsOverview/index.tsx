import React, { FC, ReactElement, useCallback, useEffect } from 'react';
import { FillSpinner } from "react-spinners-kit";
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { Decimal, formatWithSeparators } from 'src/components';
import { WalletListMenu } from 'src/components/WalletList/WalletListMenu';
import { useMarketsFetch, useMarketsTickersFetch, useWalletsFetch } from 'src/hooks';
import { Button, IconButton } from '@mui/material';
import { NoVisible } from 'src/assets/images/customization/NoVisible';
import { Visible } from 'src/assets/images/customization/Visible';
import { SwapIcon } from 'src/assets/images/SwapIcon';
import { VerticalAlignBottomIcon } from 'src/assets/images/VerticalAlignBottomIcon';
import { VerticalAlignTopIcon } from 'src/assets/images/VerticalAlignTopIcon';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY, DEFAULT_FIAT_PRECISION } from '../../../constants';
import { estimatePlatformValue, estimateUnitValue, estimateValue } from '../../../helpers/estimateValue';
import { CSSTransition } from "react-transition-group";
import { 
    selectCurrencies,
    selectMarkets,
    selectMarketTickers,
    selectWallets,
    Wallet,
    selectUserIsMember,
} from 'src/modules';
import { WalletsHeader } from 'src/components/WalletsHeader';
import { WalletHeaderSearch } from 'src/components/WalletsHeader/WalletHeaderSearch';
import { useHistory } from 'react-router';
 

interface ExtendedWallet extends Wallet {
    spotBalance?: string;
    spotLocked?: string;
}

const WalletsOverview: FC = (): ReactElement => {
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filterValueModal, setFilterValueModal] = React.useState<string>('');

    const [filteredWallets, setFilteredWallets] = React.useState<ExtendedWallet[]>([]);
    const [filteredWalletsModal, setFilteredWalletsModal] = React.useState<ExtendedWallet[]>([]); 

    const [mergedWallets, setMergedWallets] = React.useState<ExtendedWallet[]>([]);
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);

    const { formatMessage } = useIntl();
    const history = useHistory();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const wallets = useSelector(selectWallets); 
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const isMember: boolean = useSelector(selectUserIsMember);

    const [addModalDeposit, setAddModalDeposit] = React.useState(false);
    const toggleAddModalDeposit = () => {
        setAddModalDeposit(!addModalDeposit)
    };

    const [addModalWithdraw, setAddModalWithdraw] = React.useState(false);
    const toggleAddModalWithdraw = () => {
        setAddModalWithdraw(!addModalWithdraw)
    };

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
            setFilteredWalletsModal(extendedWalletsFilter);
            setMergedWallets(extendedWalletsFilter);
        }
    }, [wallets, currencies]);

    const headerTitles = useCallback(() => ([
        <thead>
            <tr>
                <th>{translate('page.body.wallets.overview.header.wallet')}</th>
                <th className="right">{translate('page.body.wallets.overview.header.total')}</th>
                <th className="right">{translate('page.body.wallets.overview.header.available')}</th>
                <th className="right">{translate('page.body.wallets.overview.header.locked')}</th>
                <th className="right"></th>
            </tr>
        </thead> 
    ]), []);

    const handleClickDeposit = useCallback(currency => {
        history.push(`/wallets/spot/${currency}/deposit`);
    }, [history]);

    const handleClickWithdraw = useCallback(currency => {
        history.push(`/wallets/spot/${currency}/withdraw`);
    }, [history]);
 
    const [isVisibleTotal, setIsVisibleTotal] = React.useState(false);

    const renderSecondaryCurrencyValuation = React.useCallback((value: string) => {
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
    }, [currencies, markets, tickers]);

    const estimatedValue = React.useMemo(() => {
        return estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
    }, [currencies, wallets, markets, tickers]);


    const retrieveData = React.useCallback(() => {
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
    
            return [
                <tr>
                    <td>
                        <div key={index} className="coin">
                            <CryptoIcon code={currency.toUpperCase()} />
                            <div className="info-col">
                                <span className="bold">{currency?.toUpperCase()}</span>
                                <span className="secondary">{name}</span>
                            </div>
                        </div>
                    </td>
                    <td className="right">
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
                    </td>
                    <td className="right">
                        { !isVisibleTotal ? (
                            <div className="info-col">
                                <span className="bold">
                                    <Decimal key={index} fixed={fixed} thousSep="," children={spotBalance ? spotBalance.toString() : '0'}/>
                                </span>
                                <span className="secondary">≈ $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedValueAvailable}</Decimal></span>
                            </div>
                        ) : ( 
                            <div className="info-col">
                                <span className="bold">
                                    **********
                                </span>
                                <span className="secondary">**********</span>
                            </div>
                        )} 
                    </td>
                    <td className="right">
                        { !isVisibleTotal ? (
                            <div className="info-col">
                                <span className="bold">
                                    <Decimal key={index} fixed={fixed} thousSep="," children={spotLocked ? spotLocked.toString() : '0'}/>
                                </span>
                                <span className="secondary">≈ $<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedValueLocked}</Decimal></span>
                            </div>
                        ) : ( 
                            <div className="info-col">
                                <span className="bold">
                                    **********
                                </span>
                                <span className="secondary">**********</span>
                            </div>
                        )}
                    </td>
                    <td className="right">
                        <div className="wallets-action-buttons" key={index}>
                            <Button 
                                className="wallets-button success" 
                                onClick={() => handleClickDeposit(currency)}
                                variant="text"
                            >
                                {translate('page.body.wallets.overview.action.deposit')}
                            </Button>
                            <Button 
                                className="wallets-button danger" 
                                onClick={() => handleClickWithdraw(currency)}
                                variant="text"
                            >
                                {translate('page.body.wallets.overview.action.withdraw')}
                            </Button>
                        </div>
                    </td>
                </tr> 
            ];
        })
    }, [
        filteredWallets,
        nonZeroSelected,
        currencies,
        markets,
        tickers,
    ]);
 
    const filteredListWallet = filteredWalletsModal.filter(i => !filterValueModal || i.name?.toLocaleLowerCase().includes(filterValueModal.toLowerCase()) || i.currency?.toLocaleLowerCase().includes(filterValueModal.toLowerCase()));
    return (
        <div className="wallets-page__overview">
            <div className="overview-header">
                <div className="overview-header__left">
                    <div className="estimated-value">
                        <div className="estimated-value__total">
                            <div className="estimated-value__total__title">
                                {translate('page.body.wallets.estimated_value')}({VALUATION_SECONDARY_CURRENCY.toUpperCase()})
                                <IconButton 
                                    onClick={() => setIsVisibleTotal(!isVisibleTotal)}
                                    className='visible-button'
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
                    </div>
                </div>
                <div className="overview-header__right">
                    <div className="overview-header__right__buttons">
                        <Button
                            className="small-button success"
                            onClick={toggleAddModalDeposit}
                            >
                            <VerticalAlignBottomIcon />
                            {translate('page.body.wallets.overview.action.deposit')}
                        </Button>
                        <Button
                            className="small-button danger"
                            onClick={toggleAddModalWithdraw}
                            >
                            <VerticalAlignTopIcon />
                            {translate('page.body.wallets.overview.action.withdraw')}
                        </Button>
                        <Button
                            className="small-button blue"
                            disabled={true}
                            >
                            <SwapIcon />
                            Swap
                        </Button>
                    </div>
                </div>
                <div className="overview-header__bottom">
                    <WalletsHeader
                        wallets={mergedWallets}
                        nonZeroSelected={nonZeroSelected}
                        setFilterValue={setFilterValue}
                        setFilteredWallets={setFilteredWallets}
                        handleClickCheckBox={setNonZeroSelected}
                    />
                </div>
            </div>
            <div className="overview-body"> 
                <div className="table-main with-hover">
                    {headerTitles()}
                    {(filteredWallets?.length === 0) && <div className="spinner-loader-center absolute"><FillSpinner size={19} color="var(--accent)"/></div>}
                    <tbody>{retrieveData()}</tbody>
                </div> 
            </div>
            <CSSTransition
                in={addModalDeposit}
                timeout={{
                enter: 100,
                exit: 400
                }}
                unmountOnExit
            >
                <div className="modal-window">
                    <div className="modal-window__container wide scroll fadet">
                        <div className="modal-window__container__header"> 
                            <h1>{translate('page.body.wallets.overview.action.modal.header.deposit')}</h1>
                            <div className="modal-window__container__header__close">
                                <IconButton 
                                    onClick={toggleAddModalDeposit}
                                    sx={{
                                        color: '#fff',
                                        '&:hover': {
                                            color: 'var(--accent)'
                                        }
                                    }}
                                >
                                    <CloseIcon className="icon_closeed"/>
                                </IconButton>
                            </div>
                        </div>
                        <div className="wallets-list-modal">
                            <div className="wallets-list-modal__header">
                                <WalletHeaderSearch
                                    wallets={mergedWallets}
                                    setFilterValue={setFilterValueModal}
                                    setFilteredWallets={setFilteredWalletsModal}
                                    placeholder={translate('page.body.wallets.overview.seach')}
                                />
                            </div>
                            <div className="wallets-list-modal__body">
                                {filteredListWallet.map((wallet, index) =>
                                    <WalletListMenu
                                        onClick={handleClickDeposit}
                                        wallet={wallet}
                                        key={index}
                                    />)}
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
            <CSSTransition
                in={addModalWithdraw}
                timeout={{
                enter: 100,
                exit: 400
                }}
                unmountOnExit
            >
                <div className="modal-window">
                    <div className="modal-window__container wide scroll fadet">
                        <div className="modal-window__container__header"> 
                            <h1>{translate('page.body.wallets.overview.action.modal.header.withdraw')}</h1>
                            <div className="modal-window__container__header__close">
                                <IconButton 
                                    onClick={toggleAddModalWithdraw}
                                    sx={{
                                        color: '#fff',
                                        '&:hover': {
                                            color: 'var(--accent)'
                                        }
                                    }}
                                >
                                    <CloseIcon className="icon_closeed"/>
                                </IconButton>
                            </div>
                        </div>
                        <div className="wallets-list-modal">
                            <div className="wallets-list-modal__header">
                                <WalletHeaderSearch
                                    wallets={mergedWallets}
                                    setFilterValue={setFilterValueModal}
                                    setFilteredWallets={setFilteredWalletsModal}
                                    placeholder={translate('page.body.wallets.overview.seach')}
                                />
                            </div>
                            <div className="wallets-list-modal__body">
                                {filteredListWallet.map((wallet, index) =>
                                    <WalletListMenu
                                        onClick={handleClickWithdraw}
                                        wallet={wallet}
                                        key={index}
                                    />)}
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
};

export {
    WalletsOverview,
};
