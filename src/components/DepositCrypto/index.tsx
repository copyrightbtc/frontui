import classnames from 'classnames';
import React from 'react';
import { Button } from '@mui/material';
import { useIntl } from 'react-intl';
import { formatCCYAddress } from '../../helpers';
import { Wallet, WalletAddress } from '../../modules';
import { CopyableTextField } from '../CopyableTextField';
//import { MetaMaskButton } from '../MetaMaskButton';
import { QRCode } from '../QRCode';
import { Warning } from '../../assets/images/Warning';
import LockDisabled from '../../assets/images/LockDisabled.svg';

export interface DepositCryptoProps {
    wallet: Wallet;
    network: string;
    error: string;
    dimensions?: number;
    text?: string;
    copiableTextFieldText?: string;
    copyButtonText?: string;
    handleOnCopy: () => void;
    handleGenerateAddress: () => void;
    buttonLabel?: string;
    disabled?: boolean;
    minDepositAmount?: string;
    minConfirmations?: string;
    protocols?: string;
    depositAddress: WalletAddress
}
 
const DepositCrypto: React.FunctionComponent<DepositCryptoProps> = (props: DepositCryptoProps) => {
    const { formatMessage } = useIntl();

    const QR_SIZE = 196;
    const {
        buttonLabel, 
        dimensions,
        error,
        handleGenerateAddress,
        handleOnCopy,
        wallet,
        minDepositAmount,
        minConfirmations,
        protocols,
        depositAddress
    } = props;

    const size = dimensions || QR_SIZE;
    const disabled = !depositAddress?.address;
    const onCopy = !disabled ? handleOnCopy : undefined;
    const depDis = classnames('deposit-crypto', {'copyable-text-field__disabled': disabled});

    const getDepositAddress = React.useCallback((addressData, currency) => {
        const address = addressData?.address?.split('?')[0];

        return address ? formatCCYAddress(currency, address) : '';
    }, [depositAddress, wallet.currency]);

    const getDepositTag = React.useCallback(addressData => addressData?.address?.split('?')[1]?.split('=')[1], [depositAddress]);

    const walletAddress = getDepositAddress(depositAddress, wallet.currency);
    const walletTag = getDepositTag(depositAddress); 

    const renderMemo = React.useMemo(() => {
        return (
            <React.Fragment>
                <div className="wallet-address-input"> 
                    <fieldset onClick={onCopy}>
                        <CopyableTextField
                            value={walletTag || ''}
                            fieldId={walletTag ? 'copy_memo_1' : 'copy_memo_2'}
                            disabled={disabled}
                        />
                    </fieldset>
                </div>
                <div className="wallet-address-input__warning">
                    <Warning />
                    <p>{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.memo.warning' })}</p>
                </div>
            </React.Fragment>
        );
    }, [walletTag]);

    if (!depositAddress) {
        return (
            <div className={depDis}>
                <div className="deposit-crypto__create">
                        <Button
                            onClick={handleGenerateAddress}
                            className="medium-button blue"
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

    return (
        <React.Fragment>
            <div className="deposit-crypto__address">
                <h6>{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.address'})}</h6>
                <div className="wallet-address-input">
                    <fieldset onClick={onCopy}>
                        <CopyableTextField
                            value={walletAddress || error}
                            fieldId={walletAddress ? 'copy_deposit_1' : 'copy_deposit_2'}
                            disabled={disabled}
                        />
                    </fieldset>
                </div>
                {walletTag && renderMemo}
            </div>
            <div className="deposit-crypto__details">
                {walletAddress ? (
                    <QRCode dimensions={size} data={walletAddress}/>
                ) : null}
                <div className="deposit-crypto__details__right">
                    <div className="details-row">
                        <span>{formatMessage({ id: 'page.body.wallets.tabs.deposit.min.deposit'})}</span>
                        {minDepositAmount} {wallet?.currency.toUpperCase()}
                    </div>
                    <div className="details-row">
                        <span>{formatMessage({ id: 'page.body.wallets.tabs.deposit.network'})}</span>
                        {protocols.toUpperCase()}
                    </div>
                    <div className="details-row">
                        <span>{formatMessage({ id: 'page.body.wallets.tabs.deposit.transtime'})}</span>
                        {minConfirmations} {formatMessage({ id: 'page.body.wallets.tabs.deposit.networkconfirm'})}
                    </div>
                    <div className="details-row">
                        <span>{formatMessage({ id: 'page.body.wallets.tabs.deposit.arrivaltime'})}</span>
                        {minConfirmations} {formatMessage({ id: 'page.body.wallets.tabs.deposit.networkconfirm'})}
                    </div>
                    <div className="details-row">
                        <span>{formatMessage({ id: 'page.body.wallets.tabs.deposit.depcomission'})}</span>
                        0.00%
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export {
    DepositCrypto,
};
/*{wallet.currency === 'eth' && !isMobileDevice && walletAddress ? (
                        <MetaMaskButton depositAddress={walletAddress} />
                    ) : null}*/