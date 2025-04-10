import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from "react-transition-group";
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';
import OtpInput from "react-otp-input";
import { OverlayTrigger } from 'react-bootstrap';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { WarningIcon } from 'src/assets/images/WarningIcon';
import { Tooltip, CopyableTextField } from '../../components';
import {
    beneficiariesCreateData,
    beneficiariesDelete,
    Beneficiary,
    BeneficiaryBank,
    memberLevelsFetch,
    selectBeneficiaries,
    selectBeneficiariesActivateSuccess,
    selectBeneficiariesCreate,
    selectBeneficiariesCreateSuccess,
    selectMemberLevels,
    selectMobileDeviceState,
    selectUserInfo,
    beneficiariesResetState,
    selectBeneficiariesDeleteSuccess,
    alertPush,
} from '../../modules';
import { PendingIcon } from 'src/containers/Wallets/PendingIcon';
import { BeneficiariesActivateModal } from './BeneficiariesActivateModal';
import { BeneficiariesAddModal } from './BeneficiariesAddModal';
import { BeneficiariesFailAddModal } from './BeneficiariesFailAddModal';
import { TabPanelSliding } from 'src/components/TabPanelUnderlines/TabPanelSliding';
import { SelectBeneficiariesCrypto } from './BeneficiariesCrypto/SelectBeneficiariesCrypto';
import { is2faValid } from 'src/helpers';
import {
    getAddressWithoutTag,
    getTag,
    requiresMemoTag,
    requiresDTTag,
} from '../../helpers/tagBasedAsset';
interface OwnProps {
    currency: string;
    type: 'fiat' | 'coin';
    onChangeValue: (beneficiary: Beneficiary) => void;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    blockchain_key: '',
    blockchain_name: '',
    state: '',
    data: {
        address: '',
    },
};

type Props = OwnProps;

const BeneficiariesComponent: React.FC<Props> = (props: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [tab, setTab] = React.useState(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}));
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0);

    const [currentWithdrawalBeneficiary, setWithdrawalBeneficiary] = React.useState(defaultBeneficiary);
    const [isOpenAddressModal, setAddressModalState] = React.useState(false);
    const [isOpenConfirmationModal, setConfirmationModalState] = React.useState(false);
    const [isOpenFailModal, setFailModalState] = React.useState(false);
    const [isOpenOtpModal, setOtpModalState] = React.useState(false);
    const [code2FA, setCode2FA] = React.useState<string>('');
    const [selectedId, setSelectedId] = React.useState<number>(-1);

    const { currency, type, onChangeValue } = props;

    /*    selectors    */
    const beneficiaries = useSelector(selectBeneficiaries);
    const beneficiariesAddData = useSelector(selectBeneficiariesCreate);
    const beneficiariesAddSuccess = useSelector(selectBeneficiariesCreateSuccess);
    const beneficiariesActivateSuccess = useSelector(selectBeneficiariesActivateSuccess);
    const beneficiariesDeleteSuccess = useSelector(selectBeneficiariesDeleteSuccess);
    const memberLevels = useSelector(selectMemberLevels);
    const userData = useSelector(selectUserInfo);
    const isMobileDevice = useSelector(selectMobileDeviceState);
    /*    ---------    */

    const uniqueBlockchainKeys = (new Set(beneficiaries.map(item => item.blockchain_key)));
    const uniqueBlockchainKeysValues = [...uniqueBlockchainKeys.values()];

    React.useEffect(() => {
        if (beneficiaries.length && beneficiaries[0].currency !== currency) {
            setWithdrawalBeneficiary(defaultBeneficiary);
            setCurrentTabIndex(0);
            setTab(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}));
        }
    }, [currency, beneficiaries])

    React.useEffect(() => {
        if (beneficiaries.length) {
            setCurrentTabIndex(0);
            setTab(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.whitelisted'}));
        }
    }, [isOpenConfirmationModal, beneficiaries]);

    React.useEffect(() => {
        if (beneficiaries.length) {
            handleSetCurrentAddressOnUpdate(beneficiaries);
        }

        if (!memberLevels) {
            dispatch(memberLevelsFetch());
        }

        return () => {
            document.getElementById('root')?.style.setProperty('height', 'auto');
        };
    }, []);

    React.useEffect(() => {
        if (currency || beneficiariesDeleteSuccess) {
            dispatch(beneficiariesResetState());
        }
    }, [currency, beneficiariesDeleteSuccess]);

    React.useEffect(() => {
        if (beneficiaries) {
            handleSetCurrentAddressOnUpdate(beneficiaries);
        }

        if (beneficiariesAddSuccess) {
            setConfirmationModalState(true);
        }

        if (beneficiariesActivateSuccess) {
            setConfirmationModalState(false);
            document.getElementById('root')?.style.setProperty('height', 'auto');
            setAddressModalState(false);
        }

        if (beneficiaries.length) {
            setTab(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.whitelisted'}));
            setCurrentTabIndex(0);
        } else {
            setTab(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}));
        }
    }, [beneficiaries, beneficiariesAddSuccess, beneficiariesActivateSuccess]);

    const handleDeleteAddress = React.useCallback((item: Beneficiary) => () => {
        setSelectedId(item.id);
        setOtpModalState(true);
    }, []);

    const handleClickSelectAddress = React.useCallback((item: Beneficiary) => () => {
        if (item.state && item.state.toLowerCase() === 'pending') {
            dispatch(beneficiariesCreateData(item));
            setConfirmationModalState(true);
        } else {
            handleSetCurrentAddress(item);
            setConfirmationModalState(false);
            document.getElementById('root')?.style.setProperty('height', 'auto');
            setAddressModalState(false);
        }
    }, []);

    const handleSetCurrentAddress = React.useCallback((item: Beneficiary) => {
        if (item.data) {
            setWithdrawalBeneficiary(item);
            onChangeValue(item);
        }
    }, [currency]);

    const handleFilterByState = React.useCallback((beneficiariesList: Beneficiary[], filter: string | string[]) => {
        if (beneficiariesList.length) {
            return beneficiariesList.filter(item => filter.includes(item.state.toLowerCase()));
        }

        return [];
    }, []);

    const handleClickToggleAddAddressModal = React.useCallback(() => () => {
        if (memberLevels && (userData.level < memberLevels.withdraw.minimum_level)) {
            setFailModalState(true);
        } else {
            setAddressModalState(true);
            document.getElementById('root')?.style.setProperty('height', '100%');
        }
    }, [beneficiaries]);

    const handleSetCurrentAddressOnUpdate = React.useCallback((beneficiariesList: Beneficiary[]) => {
        let filteredByState = handleFilterByState(beneficiariesList, 'active');

        if (!filteredByState.length) {
            filteredByState = handleFilterByState(beneficiariesList, 'pending');
        }

        if (filteredByState.length) {
            handleSetCurrentAddress(filteredByState[0]);
        }
    }, []);

    const renderAddAddress = () => {
        return ( 
            <div className="beneficiaries-screen__current">
                <h5>
                    {formatMessage({ id: 'page.body.wallets.beneficiaries.noactive' })} {currency.toUpperCase()}
                    <OverlayTrigger
                        placement="auto"
                        delay={{ show: 250, hide: 300 }} 
                        overlay={<Tooltip title="error.beneficiaries.max10.addresses" />}>
                            <div className="tip_icon_container">
                                <InfoIcon />
                            </div>
                    </OverlayTrigger> 
                </h5>
                <div className="beneficiaries-screen__current__button">
                    <Button
                        onClick={handleClickToggleAddAddressModal()}
                        className="small-button blue"
                    >
                        {formatMessage({id: 'page.body.wallets.beneficiaries.addAddress' })}
                    </Button>
                </div>
            </div>
        );
    };

    const handleOnCopy = () => dispatch(alertPush({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'}));

    const renderDatasCoin = React.useCallback((currentWithdrawalBeneficiary: Beneficiary) => {
        const isPending = currentWithdrawalBeneficiary.state && currentWithdrawalBeneficiary.state.toLowerCase() === 'pending';
        const isDescription = currentWithdrawalBeneficiary.description === null;
        const address = getAddressWithoutTag(currentWithdrawalBeneficiary.data?.address); 

        if (currentWithdrawalBeneficiary) {
            const memo = getTag(currentWithdrawalBeneficiary.data.address);

            let textTagID = '';
            if (requiresMemoTag(currentWithdrawalBeneficiary.currency)) {
                textTagID = 'page.body.wallets.beneficiaries.memo';
            }
    
            if (requiresDTTag(currentWithdrawalBeneficiary.currency)) {
                textTagID = 'page.body.wallets.beneficiaries.destinational.tag';
            }

            return (
                <React.Fragment>
                <div className="beneficiaries-screen__current__row">
                    <h6>{formatMessage({ id: 'page.body.wallets.beneficiaries.tipName' })}</h6>
                    <div className="datas">{currentWithdrawalBeneficiary.name}</div>
                </div>
                <div className="beneficiaries-screen__current__row">
                    <h6>{formatMessage({ id: 'page.body.wallets.beneficiaries.tipAddress' })}</h6>
                    <div className="datas">
                        <div className="wallet-address-input">
                            <fieldset onClick={handleOnCopy}>
                                <CopyableTextField
                                    value={address}
                                    fieldId={address ? 'copy_deposit_1' : 'copy_deposit_2'}
                                />
                            </fieldset>
                        </div>
                    </div>
                </div>
                {textTagID && <div className="beneficiaries-screen__current__row">
                    <h6>{formatMessage({ id: textTagID })}</h6>
                    <div className="datas">{memo}</div>
                </div>}
                {!isDescription ? 
                    <div className="beneficiaries-screen__current__row">
                        <h6>{formatMessage({ id: 'page.body.wallets.beneficiaries.tipDescription' })}</h6>
                        <div className="datas">{currentWithdrawalBeneficiary.description}</div>
                    </div>
                : null }
                {isPending ? (
                <div className="beneficiaries-screen__current__row pending">
                    <h6>{formatMessage({ id: 'page.body.wallets.beneficiaries.tipState' })}</h6>
                    <div className="datas">
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.pending' })}
                        <PendingIcon />
                    </div>
                </div>
                ) : null}
                </React.Fragment>
            );
        }

        return null;
    }, []);

    const renderDatasFiat = React.useCallback((currentWithdrawalBeneficiary: Beneficiary) => {
        const isPending = currentWithdrawalBeneficiary.state && currentWithdrawalBeneficiary.state.toLowerCase() === 'pending';
        const beneficiaryBank = (currentWithdrawalBeneficiary.data as BeneficiaryBank);

        if (currentWithdrawalBeneficiary) {
            return (
                <React.Fragment>
                    <div className="beneficiaries-screen__current__row">
                        <h6>
                            {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.fiatName' })}
                        </h6>
                        <div className="datas">
                            {currentWithdrawalBeneficiary.name}
                        </div>
                    </div>
                    <div className="beneficiaries-screen__current__row">
                        <h6>
                            {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.fiatFullName' })}
                        </h6>
                        <div className="datas">
                            {beneficiaryBank.full_name}
                        </div>
                    </div>
                    <div className="beneficiaries-screen__current__row">
                        <h6>
                            {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.fiatAccountNumber' })}
                        </h6>
                        <div className="datas">
                            <div className="wallet-address-input">
                                <fieldset onClick={handleOnCopy}>
                                    <CopyableTextField
                                        value={beneficiaryBank.account_number}
                                        fieldId={beneficiaryBank.account_number ? 'copy_deposit_fiat_1' : 'copy_deposit_fiat_2'}
                                    />
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="beneficiaries-screen__current__row">
                        <h6>
                            {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.fiatBankName' })}
                        </h6>
                        <div className="datas">
                            {beneficiaryBank.bank_name}
                        </div>
                    </div>
                    {beneficiaryBank.bank_swift_code && currentWithdrawalBeneficiary.state !== "null" ? 
                    <div className="beneficiaries-screen__current__row">
                          <h6>
                              {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.fiatBankSwiftCode' })}
                          </h6>
                        <div className="datas">
                            {beneficiaryBank.bank_swift_code}
                        </div>
                    </div> : 'dvsvdsvds'}
                    {beneficiaryBank.intermediary_bank_name && currentWithdrawalBeneficiary.state !== "null" ? 
                    <div className="beneficiaries-screen__current__row">
                          <h6>
                              {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.fiatIntermediaryBankName' })}
                          </h6>
                        <div className="datas">
                            {beneficiaryBank.intermediary_bank_name}
                        </div>
                    </div> : null}
                    {beneficiaryBank.intermediary_bank_swift_code && currentWithdrawalBeneficiary.state !== "null" ? 
                    <div className="beneficiaries-screen__current__row">
                          <h6>
                              {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.fiatIntermediaryBankSwiftCode' })}
                          </h6>
                        <div className="datas">
                            {beneficiaryBank.intermediary_bank_swift_code}
                        </div>
                    </div> : null}
                    {isPending ? (
                    <div className="beneficiaries-screen__current__row">
                        <h6>{formatMessage({ id: 'page.body.trade.header.openOrders.content.state' })}</h6>
                        <div className="datas pending">
                            {formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.pending' })}
                            <PendingIcon />
                        </div>
                    </div>
                    ) : null}
                </React.Fragment>
            );
        }

        return null;
    }, []);


    const renderAddressItem = React.useCallback((currentBeneficiary: Beneficiary) => {
        const isPending = currentBeneficiary.state && currentBeneficiary.state.toLowerCase() === 'pending';

        if (type === 'fiat') {
            return (
                <div className="beneficiaries-screen__current">
                    <h5>
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.active' })} {currency.toUpperCase()}
                        {beneficiaries.length >= 10 ? (
                            <OverlayTrigger
                                placement="auto"
                                delay={{ show: 250, hide: 300 }} 
                                overlay={<Tooltip title="error.beneficiaries.max10.warning" />}>
                                    <div className="tip_icon_container">
                                        <WarningIcon className="warn-icon"/>
                                    </div>
                            </OverlayTrigger> 
                            ) : (
                            <OverlayTrigger
                                placement="auto"
                                delay={{ show: 250, hide: 300 }} 
                                overlay={<Tooltip title="error.beneficiaries.max10.addresses" />}>
                                    <div className="tip_icon_container">
                                        <InfoIcon />
                                    </div>
                            </OverlayTrigger> 
                        )}

                    </h5>
                    {renderDatasFiat(currentBeneficiary)}
                    <div className="beneficiaries-screen__current__button">
                        <Button
                            onClick={handleClickToggleAddAddressModal()}
                            className="small-button blue"
                        >
                            {formatMessage({id: 'page.body.wallets.beneficiaries.addAddressChange' })}
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="beneficiaries-screen__current">
                <h5>
                    {formatMessage({ id: 'page.body.wallets.beneficiaries.active' })} {currency.toUpperCase()}
                    {beneficiaries.length >= 10 ? (
                        <OverlayTrigger
                            placement="auto"
                            delay={{ show: 250, hide: 300 }} 
                            overlay={<Tooltip title="error.beneficiaries.max10.warning" />}>
                                <div className="tip_icon_container">
                                    <WarningIcon className="warn-icon"/>
                                </div>
                        </OverlayTrigger> 
                        ) : (
                        <OverlayTrigger
                            placement="auto"
                            delay={{ show: 250, hide: 300 }} 
                            overlay={<Tooltip title="error.beneficiaries.max10.addresses" />}>
                                <div className="tip_icon_container">
                                    <InfoIcon />
                                </div>
                        </OverlayTrigger> 
                    )}

                </h5>
                {renderDatasCoin(currentWithdrawalBeneficiary)}
                <div className="beneficiaries-screen__current__button">
                    <Button
                        onClick={handleClickToggleAddAddressModal()}
                        className="small-button blue"
                    >
                        {formatMessage({id: 'page.body.wallets.beneficiaries.addAddressChange' })}
                    </Button>
                </div>
            </div>
        );
    }, [currentWithdrawalBeneficiary]);

    const renderBeneficiariesAddModal = () => { 

        return (
            <BeneficiariesAddModal
                currency={currency}
                type={type}
                handleToggleAddAddressModal={() => setAddressModalState(false)}
            />
        );
    };

    const renderActivateModal = () => {
        return (
            <BeneficiariesActivateModal
                beneficiariesAddData={beneficiariesAddData}
                handleToggleConfirmationModal={() => setConfirmationModalState(false)}
            />
        );
    };

    const renderFailModal = () => {
        return (
            <BeneficiariesFailAddModal
                isMobileDevice={isMobileDevice}
                handleToggleFailModal={() => setFailModalState(false)}
            />
        );
    };

    const handleCloseModals = React.useCallback(() => {
        if (beneficiaries.length) {
            setTab(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.whitelisted'}));
        } else {
            setTab(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}));
        }
        setCurrentTabIndex(0);
        setAddressModalState(false);
        setFailModalState(false);
        setConfirmationModalState(false);
        document.getElementById('root')?.style.setProperty('height', 'auto');
    }, [beneficiaries, setCurrentTabIndex, setAddressModalState, setFailModalState, setConfirmationModalState, setTab]);

    const onTabChange = React.useCallback(label => setTab(label), [setTab]);

    const onCurrentTabChange = React.useCallback(index => setCurrentTabIndex(index), [setCurrentTabIndex]);

    const renderTabs = () => {
        if (beneficiaries.length) {
            return [
                {
                    content: tab === formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.whitelisted'}) ? 
                    <div className="withdraw-added-item">{uniqueBlockchainKeysValues.map(item =>
                         
                        <SelectBeneficiariesCrypto
                            blockchainKey={item}
                            currency={currency}
                            handleDeleteAddress={handleDeleteAddress}
                            handleClickSelectAddress={handleClickSelectAddress} />
                            )}</div> : null,

                    label: formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.whitelisted'}),
                },
                {
                    content: tab === formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}) ? renderBeneficiariesAddModal() : null,
                    label: formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}),
                }
            ]
        }
    };

    const renderTabPanel = () => {

        if (isOpenConfirmationModal) {
            return renderActivateModal();
        }

        if (isOpenFailModal) {
            return renderFailModal();
        }

        return <TabPanelSliding
            panels={renderTabs()}
            onTabChange={(_, label) => onTabChange(label)}
            currentTabIndex={currentTabIndex}
            onCurrentTabChange={onCurrentTabChange}
        />
    };

    const renderTitle = () => {
        if (isOpenConfirmationModal) {
            return formatMessage({ id: 'page.body.wallets.beneficiaries.title.confirm.new.account' },
                {coinname: currency.toUpperCase()});
        }

        if (isOpenFailModal) {
            return formatMessage({ id: 'page.body.wallets.beneficiaries.failAddModal.header' });
        }

        return formatMessage({ id: 'page.body.wallets.beneficiaries.title.withdrawal.limit' },
            {coinname: currency.toUpperCase()});

    };


    const closeModal = React.useCallback(() => {
        setOtpModalState(false);
        setCode2FA('');
        setSelectedId(-1);
     }, []);

    const deleteBeneficiary = React.useCallback(() => {
        dispatch(beneficiariesDelete({ id: selectedId, otp: code2FA }));
        setSelectedId(-1);
        setCode2FA('');
        setOtpModalState(false);
    }, [selectedId, code2FA]);

    return (
        <div className="beneficiaries-screen">
            {beneficiaries.length && currentWithdrawalBeneficiary.id && currentWithdrawalBeneficiary.currency === beneficiaries[0].currency ? renderAddressItem(currentWithdrawalBeneficiary) : renderAddAddress()}
            <CSSTransition
                in={isOpenAddressModal}
                timeout={{
                enter: 100,
                exit: 400
                }}
                unmountOnExit
            >
                <div className="modal-window">
                    <div className="modal-window__container wide scroll fadet">
                        <div className="modal-window__container__header"> 
                            <h1>{renderTitle()}</h1>
                            <div className="modal-window__container__header__close">
                                <IconButton 
                                    onClick={() => handleCloseModals()}
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
                        <div className="beneficiaries-modal-wrapper">
                            {beneficiaries.length ? renderTabPanel() : renderBeneficiariesAddModal()}
                        </div>
                    </div>
                </div>
            </CSSTransition>
            <CSSTransition
                in={isOpenOtpModal}
                timeout={{
                enter: 100,
                exit: 400
                }}
                unmountOnExit
            >
                <div className="modal-window"> 
                    <div className="modal-window__container fadet">
                        <div className="modal-window__container__header"> 
                            <h1>{formatMessage({id: 'page.body.wallets.beneficiaries.delete.2fa.header' })}</h1>
                            <div className="modal-window__container__header__close">
                                <IconButton 
                                    onClick={closeModal}
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
                        <div className="modal-window__container__content">
                            <div className="twofa__form__content__header">
                                {formatMessage({id: 'page.body.wallets.beneficiaries.delete.2fa.title' })}
                            </div>
                            <div className="modal-window__container__twofa">
                                <div className="twofa__form__content__body">
                                    <OtpInput
                                        inputType="number"
                                        value={code2FA}
                                        onChange={setCode2FA}
                                        numInputs={6}
                                        renderSeparator={<span>-</span>}
                                        shouldAutoFocus={true}
                                        skipDefaultStyles={true}
                                        inputStyle={{
                                            caretColor: "var(--accent)"
                                        }}
                                        renderInput={(props) => <input {...props} />}
                                    />
                                </div>
                                <div className="modal-window__container__footer"> 
                                    <Button
                                        disabled={!is2faValid(code2FA)}
                                        onClick={deleteBeneficiary}
                                        className="medium-button"
                                    >
                                        {formatMessage({id: 'page.body.wallets.beneficiaries.delete.2fa.button' })}
                                    </Button>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
}

const Beneficiaries = React.memo(BeneficiariesComponent);

export {
    Beneficiaries,
};