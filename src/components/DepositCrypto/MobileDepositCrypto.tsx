import classnames from 'classnames';
import React from 'react';
import { Button } from '@mui/material';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { formatCCYAddress, copyToClipboard } from '../../helpers';
import { Wallet, alertPush, WalletAddress } from '../../modules';
import Accordion from 'react-bootstrap/Accordion';
import { ArrowDownward } from 'src/assets/images/ArrowDownward';
//import { MetaMaskButton } from '../MetaMaskButton';
import { QRCode } from '../QRCode';
import LockDisabled from '../../assets/images/LockDisabled.svg';

export interface MobileDepositCryptoProps {
    wallet: Wallet;
    network: string;
    error: string;
    dimensions?: number;
    text?: string;
    copiableTextFieldText?: string;
    copyButtonText?: string;
    handleGenerateAddress: () => void;
    buttonLabel?: string;
    disabled?: boolean;
    minDepositAmount?: string;
    minConfirmations?: string;
    protocols?: string;
    depositAddress: WalletAddress
}
 
const MobileDepositCrypto: React.FunctionComponent<MobileDepositCryptoProps> = (props: MobileDepositCryptoProps) => {
    const { formatMessage } = useIntl();

    const dispatch = useDispatch();

    const QR_SIZE = 196;
    const {
        buttonLabel, 
        dimensions,
        handleGenerateAddress,
        wallet,
        minDepositAmount,
        minConfirmations,
        protocols,
        depositAddress
    } = props;

    const size = dimensions || QR_SIZE;
    const disabled = !depositAddress?.address;

    const onCopy = (walletAddress?: string) => {
        copyToClipboard(walletAddress);
        dispatch(alertPush({message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'}));
    };

    const depDis = classnames('deposit-crypto', {'copyable-text-field__disabled': disabled});

    const getDepositAddress = React.useCallback((addressData, currency) => {
        const address = addressData?.address?.split('?')[0];

        return address ? formatCCYAddress(currency, address) : '';
    }, [depositAddress, wallet.currency]);

    const getDepositTag = React.useCallback(addressData => addressData?.address?.split('?')[1]?.split('=')[1], [depositAddress]);

    const walletAddress = getDepositAddress(depositAddress, wallet.currency);
    const walletTag = getDepositTag(depositAddress);

    if (!depositAddress) {
        return (
            <div className={depDis}>
                <div className="deposit-crypto__create">
                        <Button
                            onClick={handleGenerateAddress}
                            className="medium-button themes blue"
                        >
                            {buttonLabel ? buttonLabel : 'Generate deposit address'}
                        </Button>
                </div>
            </div>
        );
    }

    if (props.disabled) {
        return (
            <div className="wallet-warning">
                <img src={LockDisabled} alt="lock" draggable="false"/>
                <span>{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.disabled'}, {currency: wallet?.currency.toUpperCase()})}</span>
            </div>
        );
    }

    const text1 = formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.instruction.2' },
        {amounts: minDepositAmount, coinname: wallet?.currency.toUpperCase()});

    const text2 = formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.instruction.3' },
        {currencyName: wallet?.currency.toUpperCase(), currencyNetwork: protocols.toUpperCase()});

    const text3 = formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.instruction.4' },
        {timeConfirmations: minConfirmations});

    return (
        <React.Fragment>
            <div className="mobile-wallet__deposit__address">
                {walletAddress ? <QRCode dimensions={size} data={walletAddress}/> : null}
                <div className="wallet-address-input">
                    <div className='wallet-address-input__adress'>{walletAddress}</div>
                    <Button 
                        onClick={() => onCopy(walletAddress)}
                        className='wallet-address-input__copy'
                    >
                        {formatMessage({ id: 'page.body.wallets.tabs.deposit.copy.button.tap'})}
                    </Button>
                </div>
                <Accordion>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>
                            {formatMessage({ id: 'page.body.profile.content.action.more'})}
                            <ArrowDownward className="arrow" />
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="mobile-wallet__deposit__address__more">
                                <div className="row">
                                    <span>{formatMessage({ id: 'page.body.wallets.tabs.deposit.min.deposit'})}</span>
                                    {minDepositAmount} {wallet?.currency.toUpperCase()}
                                </div>
                                <div className="row">
                                    <span>{formatMessage({ id: 'page.body.wallets.tabs.deposit.network'})}</span>
                                    {protocols.toUpperCase()}
                                </div>
                                <div className="row">
                                    <span>{formatMessage({ id: 'page.body.wallets.tabs.deposit.transtime'})}</span>
                                    {minConfirmations} {formatMessage({ id: 'page.body.wallets.tabs.deposit.networkconfirm'})}
                                </div>
                                <div className="row">
                                    <span>{formatMessage({ id: 'page.body.wallets.tabs.deposit.arrivaltime'})}</span>
                                    {minConfirmations} {formatMessage({ id: 'page.body.wallets.tabs.deposit.networkconfirm'})}
                                </div>
                                <div className="row">
                                    <span>{formatMessage({ id: 'page.body.wallets.tabs.deposit.depcomission'})}</span>
                                    0.00%
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                {walletTag}
            </div>
            <div className="mobile-wallet__deposit__conditions">
                <h5>{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.deposit.instruction.title'})}</h5>
                <ul>
                    <li>{text1}</li>
                    <li>{text2}</li>
                    <li>{text3}</li>
                </ul> 
            </div>
        </React.Fragment>
    );
};

export {
    MobileDepositCrypto,
};
/*{wallet.currency === 'eth' && !isMobileDevice && walletAddress ? (
                        <MetaMaskButton depositAddress={walletAddress} />
                    ) : null}*/