import React, { useCallback, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CryptoIcon } from 'src/components/CryptoIcon';
import {
    Voletpayment,
    Payeerpayment,
    MercuryoPayment
 } from '../../../../screens';
import { ModalMobile } from 'src/mobile/components';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from 'src/assets/images/CloseIcon';

import LockDisabled from 'src/assets/images/LockDisabled.svg';
import volet from 'src/assets/images/paysystems/volet_w.svg';
import payeer from 'src/assets/images/paysystems/payeer_w.svg';
import mercuryo from 'src/assets/images/paysystems/mercuryo_w.svg';

import {
    User,
    selectUserInfo,
    selectMemberLevels,
    selectCurrencies,
    Currency,
} from '../../../../modules';

export const MobileDepositFiatContainer = props => {
    const { formatMessage } = useIntl();

    const { wallet } = props;

    const [showModalAdv, setShowModalAdv] = useState(false);
    const [showModalPaye, setShowModalPaye] = useState(false);
    const [showModalMerc, setShowModalMerc] = useState(false);
 
    const currencies: Currency[] = useSelector(selectCurrencies);
    const memberLevels = useSelector(selectMemberLevels);
    const user: User = useSelector(selectUserInfo);

    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);
    const currencyItem: Currency | any = React.useMemo(() => (currencies && currencies.find(item => item.id === wallet.currency)) || { min_confirmations: 6, deposit_enabled: false }, [currencies, wallet]);

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
                <div className="mobile-wallet__deposit__banner">
                    <CryptoIcon code={wallet?.currency.toUpperCase()} />
                    <div className='name'>
                        <h5>{wallet?.name.toUpperCase()} | {wallet?.currency.toUpperCase()}</h5>
                    </div>
                </div>
                <div className="mobile-wallet__deposit__ewallets">
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
                    <div className="mobile-wallet__deposit__conditions">
                        <h5>{translate('page.body.wallets.tabs.deposit.ccy.deposit.ewallet.instruction.title')}</h5>
                        <ul>
                            <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.ewallet.instruction.1')}</li>
                            <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.ewallet.instruction.2')}</li>
                            <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.ewallet.instruction.3')}</li>
                            <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.ewallet.instruction.4')}</li>
                            <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.ewallet.instruction.5')}</li>
                        </ul>
                    </div>
                </div>
            </React.Fragment>
        )
    };
 
    return (
        <React.Fragment>
            {user.level < 2 ? (
            <div className="mobile-wallet__deposit">
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
            <div className="mobile-wallet__deposit with__tabs"> 
                {user.level >= 2 ? renderEWallets() : renderWarning }
            </div>
            )}
            <ModalMobile
                isOpen={showModalAdv}
                onClose={() => setShowModalAdv(!showModalAdv)}
                classNames='mobile-modal-ewallets'
            >
                <div className="mobile-modal__header">
                    <div className="mobile-modal__header-title">
                        {formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.ewallet.modal.title' }, {fiats: wallet?.currency.toUpperCase()})}
                    </div>
                    <div className="mobile-modal__header-close" onClick={() => setShowModalAdv(!showModalAdv)}>
                        <CloseIcon />
                    </div>
                </div>
                <Voletpayment
                    currencys={wallet.currency === 'usd' && '$' || wallet.currency === 'eur' && '€' || wallet.currency.toUpperCase()}
                    currencyUp={wallet.currency.toUpperCase()}
                    minAmount={wallet.currency === 'usd' && '50' || wallet.currency === 'eur' && '40'}
                />
            </ModalMobile>
            <ModalMobile
                isOpen={showModalPaye}
                onClose={() => setShowModalPaye(!showModalPaye)}
                classNames='mobile-modal-ewallets'
            >
                <div className="mobile-modal__header">
                    <div className="mobile-modal__header-title">
                        {formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.ewallet.modal.title' }, {fiats: wallet?.currency.toUpperCase()})}
                    </div>
                    <div className="mobile-modal__header-close" onClick={() => setShowModalPaye(!showModalPaye)}>
                        <CloseIcon />
                    </div>
                </div>
                <Payeerpayment 
                    currencys={wallet.currency === 'usd' && '$' || wallet.currency === 'eur' && '€' || wallet.currency.toUpperCase()}
                    currencyUp={wallet.currency.toUpperCase()}
                    minAmount={wallet.currency === 'usd' && '50' || wallet.currency === 'eur' && '40'}
                />
            </ModalMobile>
            <ModalMobile
                isOpen={showModalMerc}
                onClose={() => setShowModalMerc(!showModalMerc)}
                classNames='mobile-modal-ewallets'
            >
                <div className="mobile-modal__header">
                    <div className="mobile-modal__header-title">
                        {formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.ewallet.modal.title' }, {fiats: wallet?.currency.toUpperCase()})}
                    </div>
                    <div className="mobile-modal__header-close" onClick={() => setShowModalMerc(!showModalMerc)}>
                        <CloseIcon />
                    </div>
                </div>
                <MercuryoPayment 
                    currencys={wallet.currency === 'usd' && '$' || wallet.currency === 'eur' && '€' || wallet.currency.toUpperCase()}
                    currencyUp={wallet.currency.toUpperCase()}
                    minAmount={wallet.currency === 'usd' && '50' || wallet.currency === 'eur' && '40'}
                />
            </ModalMobile>
        </React.Fragment>
    );
}
