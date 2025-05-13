import React, { useMemo } from 'react';
import { Button } from '@mui/material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ModalWithdrawSubmit, Withdraw } from '../../../containers';
import { useBeneficiariesFetch } from '../../../hooks';
import { Beneficiary } from '../../../modules/user/beneficiaries';
import { selectWithdrawSuccess, walletsWithdrawCcyFetch } from '../../../modules/user/wallets';
import { ModalWithdrawConfirmation } from 'src/mobile/components/ModalWithdrawConfirmation';
import LockDisabled from 'src/assets/images/LockDisabled.svg';
import TwoFaIcon from 'src/assets/images/TwoFaIcon.svg';

import {
    selectCurrencies,
    selectMemberLevels,
    selectUserInfo,
} from '../../../modules';

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    blockchain_key: '',
    protocol: '',
    blockchain_name: '',
    description: '',
    data: {
        address: '',
    },
};

export const WalletWithdrawBody = props => {

    const [otpCode, setOtpCode] = React.useState(''); 

    const handleChangeOtpCode = (value: string) => {
        setOtpCode(value);
    };

    const { formatMessage } = useIntl();
    const memberLevels = useSelector(selectMemberLevels);
    const [withdrawSubmitModal, setWithdrawSubmitModal] = React.useState(false);
    const [withdrawData, setWithdrawData] = React.useState({
        amount: '',
        beneficiary: defaultBeneficiary,
        otpCode: '',
        withdrawConfirmModal: false,
        total: '',
        withdrawDone: false,
    });

    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);
    const currencies = useSelector(selectCurrencies);
    const withdrawSuccess = useSelector(selectWithdrawSuccess);
    const { currency, fee, type, balance } = props.wallet;
    const fixed = (props.wallet || { fixed: 0 }).fixed;
    const withdrawAmountLabel = formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' });
    const withdraw2faLabel = formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' });
    const withdrawFeeLabel = formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' });
    const withdrawSumlLabel = formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amounttol' });
    const withdrawTotalLabel = formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' });
    const withdrawButtonLabel = formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' });
    const withdrawAllButtonLabel = formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button.all' });
    const currencyItem = (currencies && currencies.find(item => item.id === currency));
    const blockchainItem = currencyItem?.networks?.find(n => n.blockchain_key === defaultBeneficiary.blockchain_key);

    const isTwoFactorAuthRequired = (level: number, is2faEnabled: boolean) => {
        return level > 3 || (level === 3 && is2faEnabled);
    };

    const handleNavigateTo2fa = () => {
        history.push('/profile/2fa', { enable2fa: true });
    };

    const getConfirmationAddress = () => {
        let confirmationAddress = '';

        if (props.wallet) {
            confirmationAddress = props.wallet.type === 'fiat' ? (
                defaultBeneficiary.name
            ) : (
                defaultBeneficiary.data ? (defaultBeneficiary.data.address as string) : ''
            );
        }

        return confirmationAddress;
    };

    const toggleConfirmModal = (amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string) => {
        setWithdrawData((state: any) => ({
            amount: amount || '',
            beneficiary: beneficiary || defaultBeneficiary,
            otpCode: otpCode || '',
            withdrawConfirmModal: !state.withdrawConfirmModal,
            total: total || '',
            withdrawDone: false,
        }));
    };

    const toggleSubmitModal = () => {
        setWithdrawSubmitModal(state => !state);
        setWithdrawData(state => ({ ...state, withdrawDone: true }));
    };

    const handleWithdraw = () => {
        const { otpCode, amount, beneficiary, } = withdrawData;
        if (!props.wallet) {
            return;
        }

        const withdrawRequest = {
            amount,
            currency: currency.toLowerCase(),
            otp: otpCode,
            beneficiary_id: String(beneficiary.id),
            otpCode: otpCode || '',
        };
        dispatch(walletsWithdrawCcyFetch(withdrawRequest));
        toggleConfirmModal();
    };

    const renderWarningNoNetworks = useMemo(() => (
        <React.Fragment>
            <img src={LockDisabled} alt="lock" draggable="false"/>
            <span>{formatMessage({ id: 'page.body.wallets.warning.withdraw.no.networks'}, {currency: currency.toUpperCase()})}</span>
        </React.Fragment>
        ), []);


    const renderOtpDisabled = () => {
        return (
            <div className="wallet-warning withdraw">
                <img src={TwoFaIcon} alt="lock" draggable="false"/>
                <h6>{formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.enable2fa'})}</h6>
                <p>{formatMessage({ id: 'page.body.wallets.warning.withdraw.otp.hint'})}</p>
                <Button
                    className="medium-button themes success"
                    onClick={handleNavigateTo2fa}
                >
                    {formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.enable2faButton'})}
                </Button>
            </div>
        );
    };

    const renderWarning = useMemo(() => {
        return (
            <div className="wallet-warning withdraw">
                {!currencyItem?.networks?.length && renderWarningNoNetworks}
            </div>
        );
    }, [currencyItem, memberLevels]);
    
    useBeneficiariesFetch();

    React.useEffect(() => {
        if (withdrawSuccess) {
            toggleSubmitModal();
        }
    }, [withdrawSuccess]);

    if (user.level < 3) {
        return (
            <div className="mobile-wallet__withdraw">
                <div className="wallet-warning withdraw">
                    <img src={LockDisabled} alt="lock" draggable="false"/>
                    <h6>{formatMessage({ id: 'page.body.wallets.warning.withdraw.verification'})}</h6>
                    <p>{formatMessage({ id: 'page.body.wallets.warning.withdraw.verification.hint'})}</p>
                    <Button
                        className="medium-button themes"
                        href='/profile/verification'
                    >
                        {formatMessage({ id: 'page.body.wallets.warning.deposit.verification.button'})}
                    </Button>
                </div>
            </div>
        );
    }

    if (!user.otp) {
        return (
            <div className='mobile-wallet__withdraw'>{renderOtpDisabled()}</div>
        );
    };

    return (
        <div className="mobile-wallet__withdraw">
            {currencyItem?.networks?.length && user.level >= 3 ?
            <React.Fragment> 
                <Withdraw
                    networks={currencyItem.networks}
                    isMobileDevice
                    price={currencyItem.price}
                    name={currencyItem.name}
                    type={type}
                    fixed={fixed}
                    currency={currency}
                    onClick={toggleConfirmModal}
                    withdrawAmountLabel={withdrawAmountLabel}
                    withdraw2faLabel={withdraw2faLabel}
                    withdrawFeeLabel={withdrawFeeLabel}
                    withdrawSumlLabel={withdrawSumlLabel}
                    withdrawTotalLabel={withdrawTotalLabel}
                    withdrawDone={withdrawData.withdrawDone}
                    withdrawButtonLabel={withdrawButtonLabel}
                    withdrawAllButtonLabel={withdrawAllButtonLabel}
                    twoFactorAuthRequired={isTwoFactorAuthRequired(user.level, user.otp)}
                    fee={fee}
                    balance={balance}
                />
                <ModalWithdrawSubmit
                    isMobileDevice
                    show={withdrawSubmitModal}
                    currency={currency}
                    onSubmit={toggleSubmitModal}
                />
                <ModalWithdrawConfirmation
                    beneficiary={withdrawData.beneficiary}
                    protocol={blockchainItem?.protocol}
                    otpCode={otpCode}
                    show={withdrawData.withdrawConfirmModal}
                    type={type}
                    amount={withdrawData.amount}
                    fee={fee}
                    total={withdrawData.total}
                    currency={currency}
                    rid={getConfirmationAddress()}
                    onSubmit={handleWithdraw}
                    onDismiss={toggleConfirmModal}
                    handleChangeCodeValue={handleChangeOtpCode}
                    precision={currencyItem ? currencyItem.precision : 0}
                />
            </React.Fragment> : renderWarning }
        </div>
    );
};