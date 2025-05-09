import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { Button } from '@mui/material';
import { MobileDepositCrypto } from '../../../components/DepositCrypto/MobileDepositCrypto';
import { MobileDepositFiatContainer } from 'src/containers/Wallets/Deposit/DepositFiatContainer/MobileDepositFiatContainer';
import { DepositTabs } from 'src/containers/Wallets/Deposit/DepositCryptoContainer/DepositTabs';
import {
    Wallet,
    Currency,
    selectWallets,
    selectCurrencies,
    walletsAddressFetch,
    selectMemberLevels,
    selectUserInfo,
    User,
} from '../../../modules';

import LockDisabled from 'src/assets/images/LockDisabled.svg';

const WalletDepositBodyComponent = props => {
    const { wallet } = props;
    const { formatMessage } = useIntl();
    const translate = (id: string) => formatMessage({ id });
    const dispatch = useDispatch();

    const wallets: Wallet[] = useSelector(selectWallets);
    const currencies: Currency[] = useSelector(selectCurrencies);
    const memberLevels = useSelector(selectMemberLevels);
    const user: User = useSelector(selectUserInfo);

    const currencyItem: Currency | any = React.useMemo(() => (currencies && currencies.find(item => item.id === wallet.currency)) || { min_confirmations: 6, deposit_enabled: false }, [currencies, wallet]);

    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [tab, setTab] = useState(currencyItem?.networks ? currencyItem?.networks[0]?.blockchain_key : '');

    const blockchain = useMemo(() => currencyItem.networks?.find(item => item.blockchain_key?.toLowerCase() === tab?.toLowerCase()), [currencyItem, tab]);

    useEffect(() => {
        setTab(currencyItem?.networks ? currencyItem?.networks[0]?.blockchain_key?.toUpperCase() : '');
        setCurrentTabIndex(0);
    }, [wallet.currency]);

    const depositAddress = useMemo(() => wallet.deposit_addresses?.find(address => address.blockchain_key?.toLowerCase() === tab?.toLowerCase()), [wallet.deposit_addresses, tab]);

    const error = translate('page.body.wallets.tabs.deposit.ccy.message.pending');
    const buttonLabel = `${translate('page.body.wallets.tabs.deposit.ccy.button.generate')} ${wallet.currency.toUpperCase()} ${translate('page.body.wallets.tabs.deposit.ccy.button.address')}`;

    const handleGenerateAddress = useCallback(() => {
        if (!depositAddress && wallets.length && wallet.type !== 'fiat' &&
            currencyItem?.networks && blockchain?.status !== 'disabled' &&
            tab?.toLowerCase() === blockchain?.blockchain_key?.toLowerCase()) {
            dispatch(walletsAddressFetch({ currency: wallet.currency, blockchain_key: tab }));
        }
    }, [depositAddress, wallets, blockchain, currencyItem, tab]);

    const onTabChange = label => {
        const blockchainItem = currencyItem.networks?.find(item => item.protocol?.toUpperCase() === label || item.blockchgain_key?.toUpperCase() === label);

        setTab(blockchainItem.blockchain_key);
    };

    const onCurrentTabChange = index => setCurrentTabIndex(index);

    const renderTabs = () => {
        const tabs = currencyItem?.networks?.map(network => {
            if (network?.status === 'disabled') {
                return {};
            }

            return {
                content: tab?.toUpperCase() === network.blockchain_key?.toUpperCase() ?
                    <MobileDepositCrypto
                        buttonLabel={buttonLabel}
                        copyButtonText={formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.button'} )}
                        error={error}
                        handleGenerateAddress={handleGenerateAddress}
                        wallet={wallet}
                        minDepositAmount={network.min_deposit_amount}
                        minConfirmations={network.min_confirmations}
                        network={tab}
                        protocols={network.protocol?.toUpperCase() || network.blockchain_key?.toUpperCase()}
                        depositAddress={depositAddress}
                    /> : null,
                    label: network.protocol?.toUpperCase() || network.blockchain_key?.toUpperCase(),
                };
            });

        return tabs.filter(tab => Object.keys(tab).length);
    };

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

    const renderDeposit = () => {
        if (wallet.type === 'coin') {
            return (
                <React.Fragment>
                    {user.level < 2 ? (
                        <div className="mobile-wallet__deposit">
                            <div className="wallet-warning">
                                <img src={LockDisabled} alt="lock" draggable="false"/>
                                <h6>{translate('page.body.wallets.warning.deposit.verification')}</h6>
                                <p>{translate('page.body.wallets.warning.deposit.kyc.hint')}</p>
                                <Button
                                    className="medium-button themes"
                                    href='/profile/verification'
                                >
                                    {translate('page.body.wallets.warning.deposit.verification.button')}
                                </Button>
                            </div>
                        </div>
                        ) : (
                        <div className="mobile-wallet__deposit">
                            {currencyItem?.networks?.length && user.level >= 2 ?
                            <React.Fragment>
                                <div className="mobile-wallet__deposit__banner">
                                    <CryptoIcon code={wallet?.currency.toUpperCase()} />
                                    <div className='name'>
                                        <h5>{wallet?.name.toUpperCase()} | {wallet?.currency.toUpperCase()}</h5>
                                    </div>
                                </div>
                                <DepositTabs
                                    panels={renderTabs()}
                                    onTabChange={(_, label) => onTabChange(label)}
                                    currentTabIndex={currentTabIndex}
                                    onCurrentTabChange={onCurrentTabChange}
                                /> 
                            </React.Fragment> : renderWarning }
                        </div>
                    )};
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <MobileDepositFiatContainer wallet={wallet} />
                </React.Fragment>
            );
        }
    };


    return renderDeposit();
};

const WalletDepositBody = React.memo(WalletDepositBodyComponent);

export {
    WalletDepositBody,
};
