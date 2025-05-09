import React, { useCallback, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CurrencyInfo, TabPanelUnderlines } from '../../../../components';
import { copy } from 'src/helpers';
import { CopyIcon } from 'src/assets/images/CopyIcon';
import {
    Voletpayment,
    Payeerpayment,
    MercuryoPayment
 } from '../../../../screens';
import { CSSTransition } from "react-transition-group";
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from 'src/assets/images/CloseIcon';

import LockDisabled from 'src/assets/images/LockDisabled.svg';
import volet from 'src/assets/images/paysystems/volet_w.svg';
import payeer from 'src/assets/images/paysystems/payeer_w.svg';
import mercuryo from 'src/assets/images/paysystems/mercuryo_w.svg';

import {
    Wallet,
    User,
    selectWallets,
    selectUserInfo,
    selectMemberLevels,
    selectCurrencies,
    Currency,
    alertPush,
} from '../../../../modules';
import { WalletHistory } from '../../History';
import { DEFAULT_WALLET } from '../../../../constants';

interface DepositFiatProps {
    selectedWalletIndex: number;
}

export const DepositFiatContainer = ({selectedWalletIndex}: DepositFiatProps) => {
    const { formatMessage } = useIntl();

    const [currentTabIndex, setCurrentTabIndex] = React.useState(0);

    const handleCopyW = () => {
        copy('deposit_bank');
        dispatch(alertPush({ message: ['page.body.wallets.tabs.deposit.fiat.accountNumber.copied'], type: 'success' }));
    };

    const handleCopyUid = () => {
        copy('user_uid');
        dispatch(alertPush({ message: ['page.body.wallets.tabs.deposit.fiat.referenceCode.copied'], type: 'success' }));
    };

    const dispatch = useDispatch();

    const [showModalAdv, setShowModalAdv] = useState(false);
    const [showModalPaye, setShowModalPaye] = useState(false);
    const [showModalMerc, setShowModalMerc] = useState(false);

    const wallets: Wallet[] = useSelector(selectWallets);
    const currencies: Currency[] = useSelector(selectCurrencies);
    const user: User = useSelector(selectUserInfo);
    const memberLevels = useSelector(selectMemberLevels);

    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const wallet: Wallet = (wallets[selectedWalletIndex] || DEFAULT_WALLET);
    const currencyItem: Currency | any = (currencies && currencies.find(item => item.id === wallet.currency)) || { min_confirmations: 6, deposit_enabled: false };

    const renderWarningNoNetworks = useMemo(() => (
        <React.Fragment>
            <img src={LockDisabled} alt="lock" draggable="false"/>
            <span>{formatMessage({ id: 'page.body.wallets.warning.no.networks'}, {currency: wallet?.currency.toUpperCase()})}</span>
        </React.Fragment>
        ), []);

    const renderWarning = useMemo(() => {
        return (
            <div className="wallet-warning">
                {!currencyItem?.networks?.length && renderWarningNoNetworks}
            </div>
        );
    }, [currencyItem, memberLevels]);

    const renderEWallets = () => {    
        return (
            <React.Fragment>
                <div className="wallets-coinpage__wrapper__body__left">
                    <div className="wallets-coinpage__wrapper__ewallets">
                        <div className="ewallet">
                            <img src={volet} alt="volet" draggable="false"/>
                            <h5>Volet</h5>
                            <div className="description">
                                <span>Volet wallet</span><span>0.00%</span> 
                            </div>
                            <Button
                                className="little-button blue"
                                onClick={() => setShowModalAdv(!showModalAdv)}
                            >
                                {translate('deposit.with.ewallets.volet')}
                            </Button>
                        </div>
                        <div className="ewallet">
                            <img src={payeer} alt="payeer" draggable="false"/>
                            <h5>PAYEER</h5>
                            <div className="description">
                                <span>Payeer wallet</span><span> 0.96%</span> 
                            </div>
                            <Button
                                className="little-button blue"
                                onClick={() => setShowModalPaye(!showModalPaye)}
                            >
                                {translate('deposit.with.ewallets.payeer')}
                            </Button>
                        </div>
                        <div className="ewallet">
                            <img src={mercuryo} alt="mercuryo" draggable="false"/>
                            <h5>Mercuryo</h5>
                            <div className="description">
                                <span>Mercuryo</span><span>0.00%</span> 
                            </div>
                            <Button
                                className="little-button blue"
                                onClick={() => setShowModalMerc(!showModalMerc)}
                            >
                                {translate('deposit.with.ewallets.mercuryo')}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="wallets-coinpage__wrapper__body__right">
                    <h4>{translate('page.body.wallets.tabs.deposit.ccy.deposit.ewallet.instruction.title')}</h4>
                    <ul>
                        <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.ewallet.instruction.1')}</li>
                        <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.ewallet.instruction.2')}</li>
                        <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.ewallet.instruction.3')}</li>
                        <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.ewallet.instruction.4')}</li>
                        <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.ewallet.instruction.5')}</li>
                    </ul>
                </div>
            </React.Fragment>
        )
    };

    const renderBank = () => {    
        return (
            <React.Fragment>
                <div className="wallets-coinpage__wrapper__body__left">
                    <div className="wallets-coinpage__wrapper__bank">
                        <div className="banks-rows">
                            <div className="name">
                                {translate('page.body.wallets.tabs.deposit.fiat.bankName')}
                            </div>
                            <div className="details">
                                Nank Name
                            </div>
                        </div>
                        <div className="banks-rows">
                            <div className="name">
                                {translate('page.body.wallets.tabs.deposit.fiat.accountNumber')}
                            </div>
                            <div className="details">
                                <input
                                    className="details__input"
                                    value={'111 222222 5555555 88 99 0'} 
                                    id="deposit_bank" 
                                    spellCheck="false"
                                />
                                <IconButton
                                    onClick={handleCopyW}
                                    className="copy_button"
                                >
                                    <CopyIcon className="copy-iconprop"/> 
                                </IconButton>
                            </div>
                        </div>
                        <div className="banks-rows">
                            <div className="name">
                                {translate('page.body.wallets.tabs.deposit.fiat.accountName')}
                            </div>
                            <div className="details">
                                ACCOUNT NAME
                            </div>
                        </div>
                        <div className="banks-rows">
                            <div className="name">
                                SWIFT
                            </div>
                            <div className="details">
                                111144445555
                            </div>
                        </div>
                        <div className="banks-rows">
                            <div className="name">
                                {translate('page.body.wallets.tabs.deposit.fiat.phoneNumber')}
                            </div>
                            <div className="details">
                                +99 8888 4444 55
                            </div>
                        </div>
                        <div className="banks-rows">
                            <div className="name">
                                {translate('page.body.wallets.tabs.deposit.fiat.referenceCode')}
                            </div>
                            <div className="details">
                                <input
                                    className="details__input"
                                    value={user.uid || ''}
                                    id="user_uid" 
                                    spellCheck="false"
                                />
                                <IconButton
                                    onClick={handleCopyUid}
                                    className="copy_button"
                                >
                                    <CopyIcon className="copy-iconprop"/> 
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="wallets-coinpage__wrapper__body__right">
                    <h4>{translate('page.body.wallets.tabs.deposit.ccy.deposit.bank.instruction.title')}</h4>
                    <ul>
                        <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.bank.instruction.1')}</li>
                        <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.bank.instruction.2')}</li>
                        <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.bank.instruction.3')}</li>
                    </ul>
                </div>
            </React.Fragment>
        )
    };
 
    const textEWallets = formatMessage({ id: 'deposit.fiat.tabs.with.ewallets' },
        {asset: wallet?.currency.toUpperCase()});

    const textbank = formatMessage({ id: 'deposit.fiat.tabs.with.bank' },
        {asset: wallet?.currency.toUpperCase()});

    const tabsData = [
        {
          label: textEWallets,
          content: renderEWallets(),
        },
        {
          label: textbank,
          content: renderBank(),
        },
      ];

    const renderTabs = () => {
        return (
          <TabPanelUnderlines
            panels={tabsData}
            currentTabIndex={currentTabIndex}
            onCurrentTabChange={setCurrentTabIndex}
            borders={true}
          />
        )
      };

    return (
        <React.Fragment>
            <div className="wallets-coinpage__wrapper">
                {user.level < memberLevels?.deposit.minimum_level ? (
                <div className="wallets-coinpage__wrapper__body">
                    <div className="wallet-warning">
                        <img src={LockDisabled} alt="lock" draggable="false"/>
                        <h6>{translate('page.body.wallets.warning.deposit.verification')}</h6>
                        <p>{translate('page.body.wallets.warning.deposit.kyc.hint')}</p>
                        <Button
                            className="big-button"
                            href='/profile'
                        >
                            {translate('page.body.wallets.warning.deposit.verification.button')}
                        </Button>
                    </div>
                </div>
                ) : (
                <div className="wallets-coinpage__wrapper__body with__tabs">
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]} /> 
                    {user.level >= memberLevels?.deposit.minimum_level ? renderEWallets() : renderWarning }
                </div>
                )}
                <div className="wallets-coinpage__wrapper__footer">
                    {wallet.currency && <WalletHistory label="deposit" type="deposits" currency={wallet.currency} />}
                </div>
                <CSSTransition
                    in={showModalAdv}
                    timeout={{
                    enter: 100,
                    exit: 400
                    }}
                    unmountOnExit
                >
                <div className="modal-window">
                    <div className="modal-window__container fadet wide">
                        <div className="modal-window__container__header">
                        <h1>{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.ewallet.modal.title' }, {fiats: wallet?.currency.toUpperCase()})}</h1>
                            <div className="modal-window__container__header__close">
                                <IconButton 
                                    onClick={() => setShowModalAdv(false)}
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
                        <Voletpayment
                            currencys={wallet.currency === 'usd' && '$' || wallet.currency === 'eur' && '€' || wallet.currency.toUpperCase()}
                            currencyUp={wallet.currency.toUpperCase()}
                            minAmount={wallet.currency === 'usd' && '50' || wallet.currency === 'eur' && '40'}
                        />
                    </div>
                </div>
            </CSSTransition>
            <CSSTransition
                    in={showModalPaye}
                    timeout={{
                    enter: 100,
                    exit: 400
                    }}
                    unmountOnExit
                >
                <div className="modal-window">
                    <div className="modal-window__container fadet wide">
                        <div className="modal-window__container__header"> 
                            <h1>{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.ewallet.modal.title' }, {fiats: wallet?.currency.toUpperCase()})}</h1>
                            <div className="modal-window__container__header__close">
                                <IconButton 
                                    onClick={() => setShowModalPaye(false)}
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
                        <Payeerpayment 
                            currencys={wallet.currency === 'usd' && '$' || wallet.currency === 'eur' && '€' || wallet.currency.toUpperCase()}
                            currencyUp={wallet.currency.toUpperCase()}
                            minAmount={wallet.currency === 'usd' && '50' || wallet.currency === 'eur' && '40'}
                        />
                    </div>
                </div>
            </CSSTransition>
            <CSSTransition
                    in={showModalMerc}
                    timeout={{
                    enter: 100,
                    exit: 400
                    }}
                    unmountOnExit
                >
                <div className="modal-window">
                    <div className="modal-window__container fadet wide">
                        <div className="modal-window__container__header"> 
                            <h1>{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.ewallet.modal.title' }, {fiats: wallet?.currency.toUpperCase()})}</h1>
                            <div className="modal-window__container__header__close">
                                <IconButton 
                                    onClick={() => setShowModalMerc(false)}
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
                        <MercuryoPayment 
                            currencys={wallet.currency === 'usd' && '$' || wallet.currency === 'eur' && '€' || wallet.currency.toUpperCase()}
                            currencyUp={wallet.currency.toUpperCase()}
                            minAmount={wallet.currency === 'usd' && '50' || wallet.currency === 'eur' && '40'}
                        />
                    </div>
                </div>
            </CSSTransition>
            </div>
        </React.Fragment>
    );
}
