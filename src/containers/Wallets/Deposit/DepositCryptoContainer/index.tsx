import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl'; 
import { Button } from '@mui/material';
import {
    CurrencyInfo,
    DepositCrypto
} from '../../../../components';
import { DepositTabs } from './DepositTabs';
import {
    Wallet,
    Currency,
    selectWallets,
    selectCurrencies,
    walletsAddressFetch,
    alertPush,
    selectMemberLevels,
    selectUserInfo,
    User,
} from '../../../../modules';
import { WalletHistory } from '../../History';
import { DEFAULT_WALLET } from '../../../../constants'; 
import LockDisabled from 'src/assets/images/LockDisabled.svg';

interface DepositCryptoProps {
    selectedWalletIndex: number;
}

export const DepositCryptoContainer = ({selectedWalletIndex}: DepositCryptoProps) => {
    const { formatMessage } = useIntl();
    const translate = (id: string) => formatMessage({ id });
    const dispatch = useDispatch();

    const wallets: Wallet[] = useSelector(selectWallets);
    const currencies: Currency[] = useSelector(selectCurrencies);
    const memberLevels = useSelector(selectMemberLevels);
    const user: User = useSelector(selectUserInfo);

    const wallet: Wallet = (wallets[selectedWalletIndex] || DEFAULT_WALLET);
    const currencyItem: Currency | any = React.useMemo(() => (currencies && currencies.find(item => item.id === wallet.currency)) || { min_confirmations: 6, deposit_enabled: false }, [currencies, wallet]);

    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [tab, setTab] = useState(currencyItem?.networks ? currencyItem?.networks[0]?.blockchain_key : '')

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
            dispatch(walletsAddressFetch({ currency: wallets[selectedWalletIndex].currency, blockchain_key: tab }));
        }
    }, [depositAddress, wallets, blockchain, currencyItem, tab]);

    const handleOnCopy = () => dispatch(alertPush({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'}));

    const onTabChange = useCallback(label => {
        const blockchainItem = currencyItem.networks?.find(item => item.protocol?.toUpperCase() === label || item.blockchgain_key?.toUpperCase() === label);

        setTab(blockchainItem.blockchain_key);
    }, [setTab, currencyItem]);

    const onCurrentTabChange = useCallback((index) => setCurrentTabIndex(index), [setCurrentTabIndex]);

    const renderTabs = () => {
        const tabs = currencyItem?.networks?.map(network => {
            if (network?.status === 'disabled') {
                return {};
            }

            return {
                content: tab?.toUpperCase() === network.blockchain_key?.toUpperCase() ?
                    <DepositCrypto
                        buttonLabel={buttonLabel}
                        copiableTextFieldText={translate('page.body.wallets.tabs.deposit.ccy.message.address')}
                        copyButtonText={translate('page.body.wallets.tabs.deposit.ccy.message.button')}
                        error={error}
                        handleGenerateAddress={handleGenerateAddress}
                        handleOnCopy={handleOnCopy}
                        wallet={wallet}
                        minDepositAmount={network.min_deposit_amount}
                        minConfirmations={network.min_confirmations}
                        disabled={blockchain?.status === 'enabled' && !blockchain?.deposit_enabled || blockchain?.status === 'disabled'}
                        network={tab}
                        protocols={network.protocol?.toUpperCase() || network.blockchain_key?.toUpperCase()}
                        depositAddress={depositAddress}
                    /> : null,
                label: network.protocol?.toUpperCase() || network.blockchain_key?.toUpperCase(),
            };
        });

        return tabs.filter(tab => Object.keys(tab).length);
    }

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

    const text1 = formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.instruction.2' },
        {amounts: currencyItem?.networks[currentTabIndex]?.min_deposit_amount, coinname: wallet?.currency.toUpperCase()});

    const text2 = formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.instruction.3' },
        {currencyName: wallet?.currency.toUpperCase(), currencyNetwork: currencyItem?.networks[currentTabIndex]?.protocol?.toUpperCase() || currencyItem?.networks[currentTabIndex]?.blockchain_key?.toUpperCase()});

    const text3 = formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.instruction.4' },
        {timeConfirmations: currencyItem?.networks?.min_confirmations});

        
    return (
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
            <div className="wallets-coinpage__wrapper__body">
                <CurrencyInfo wallet={wallets[selectedWalletIndex]} /> 
                {currencyItem?.networks?.length && user.level >= memberLevels?.deposit.minimum_level ?
                <React.Fragment>
                    <div className="wallets-coinpage__wrapper__body__left">
                        <div className="wallets-coinpage__wrapper__details">
                            <h4>
                                {translate('page.body.wallets.tabs.deposit.ccy.details')}{`${wallet?.name} (${wallet?.currency.toUpperCase()})`}
                                <CryptoIcon code={wallet?.currency.toUpperCase()} />
                            </h4>
                            <div className="wrapper">
                                <DepositTabs
                                    panels={renderTabs()}
                                    onTabChange={(_, label) => onTabChange(label)}
                                    currentTabIndex={currentTabIndex}
                                    onCurrentTabChange={onCurrentTabChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="wallets-coinpage__wrapper__body__right">
                        <h4>{translate('page.body.wallets.tabs.deposit.ccy.deposit.instruction.title')}</h4>
                        <ul>
                            <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.instruction.1')}</li>
                            <li>{text1}</li>
                            <li>{text2}</li>
                            <li>{text3}</li>
                            <li>{translate('page.body.wallets.tabs.deposit.ccy.deposit.instruction.5')}</li>
                        </ul>
                    </div> 
                </React.Fragment> : renderWarning }
            </div>
            )}
            <div className="wallets-coinpage__wrapper__footer">
                {wallet.currency && <WalletHistory label="deposit" type="deposits" currency={wallet.currency} />}
            </div>
        </div>
    );
}