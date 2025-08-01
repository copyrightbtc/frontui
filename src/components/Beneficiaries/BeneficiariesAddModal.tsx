import classnames from 'classnames';
import * as WAValidator from 'multicoin-address-validator';
import * as React from 'react';
import { Button } from '@mui/material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { is2faValid } from '../../helpers';
import {
    beneficiariesCreate,
    BeneficiaryBank,
    selectCurrencies,
    selectMobileDeviceState,
    BlockchainCurrencies,
    selectBeneficiariesCreateSuccess,
    selectBeneficiariesCreateError,
    selectBeneficiaries,
} from '../../modules';
import { WarningIcon } from 'src/assets/images/WarningIcon';
import { CustomInput } from '../CustomInput';
import { DropdownBeneficiary } from './DropdownBeneficiary';
import { BeneficiariesBlockchainItem } from './BeneficiariesCrypto/BeneficiariesBlockchainItem';
import OtpInput from "react-otp-input";
import { getAddressWithoutTag, getTag, requiresMemoTag, requiresDTTag } from 'src/helpers/tagBasedAsset';

interface Props {
    currency: string;
    type: 'fiat' | 'coin';
    handleToggleAddAddressModal: () => void;
};

const defaultSelected = {
    blockchainKey: '',
    protocol: '',
    name: '',
    id: '',
    fee: '',
    minWithdraw: '',
};

const BeneficiariesAddModalComponent: React.FC<Props> = (props: Props) => {
    const [coinAddress, setCoinAddress] = React.useState('');
    const [coinAddressValid, setCoinAddressValid] = React.useState(false);
    const [coinTestnetAddressValid, setCoinTestnetAddressValid] = React.useState(false);
    const [coinBlockchainName, setCoinBlockchainName] = React.useState(defaultSelected);
    const [coinBeneficiaryName, setCoinBeneficiaryName] = React.useState('');
    const [coinDescription, setCoinDescription] = React.useState('');
    const [coinDestinationTag, setCoinDestinationTag] = React.useState('');
    const [coinAddressFocused, setCoinAddressFocused] = React.useState(false);
    const [coinBeneficiaryNameFocused, setCoinBeneficiaryNameFocused] = React.useState(false);
    const [coinDescriptionFocused, setCoinDescriptionFocused] = React.useState(false);
    const [coinDestinationTagFocused, setCoinDestinationTagFocused] = React.useState(false);

    const [fiatName, setFiatName] = React.useState('');
    const [fiatFullName, setFiatFullName] = React.useState('');
    const [fiatAccountNumber, setFiatAccountNumber] = React.useState('');
    const [fiatBankName, setFiatBankName] = React.useState('');
    //const [fiatNetworkName, setFiatNetworkName] = React.useState(defaultSelected);
    const [fiatBankSwiftCode, setFiatBankSwiftCode] = React.useState('');
    const [fiatIntermediaryBankName, setFiatIntermediaryBankName] = React.useState('');
    const [fiatIntermediaryBankSwiftCode, setFiatIntermediaryBankSwiftCode] = React.useState('');
    const [fiatNameFocused, setFiatNameFocused] = React.useState(false);
    const [fiatFullNameFocused, setFiatFullNameFocused] = React.useState(false);
    const [fiatAccountNumberFocused, setFiatAccountNumberFocused] = React.useState(false);
    const [fiatBankNameFocused, setFiatBankNameFocused] = React.useState(false);
    const [fiatBankSwiftCodeFocused, setFiatBankSwiftCodeFocused] = React.useState(false);
    const [fiatIntermediaryBankNameFocused, setFiatIntermediaryBankNameFocused] = React.useState(false);
    const [fiatIntermediaryBankSwiftCodeFocused, setFiatIntermediaryBankSwiftCodeFocused] = React.useState(false);

    const [code2FA, setCode2FA] = React.useState<string>('');

    const { type, handleToggleAddAddressModal, currency } = props;
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const beneficiaries = useSelector(selectBeneficiaries);
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const currencies = useSelector(selectCurrencies);
    const createSuccess = useSelector(selectBeneficiariesCreateSuccess);
    const createError = useSelector(selectBeneficiariesCreateError);
    const currencyItem =  currencies.find(item => item.id === currency);
    const isDestinationTagExists = requiresDTTag(currency);
    const isMemoTagExists = requiresMemoTag(currency);

    React.useEffect(() => {
        if (createSuccess) {
            handleClearModalsInputs();
        } else if (createError) {
            setCode2FA('');
        }
    }, [createSuccess, createError]);

    const handleClearModalsInputs = React.useCallback(() => {
        setCoinAddress('');
        setCoinBeneficiaryName('');
        setCoinBlockchainName(defaultSelected);
        setCoinDescription('');
        setCoinDestinationTag('');
        setCoinAddressFocused(false);
        setCoinBeneficiaryNameFocused(false);
        setCoinDescriptionFocused(false);
        setCoinDestinationTagFocused(false);
        setCoinAddressValid(false);
        setCoinTestnetAddressValid(false);

        setFiatAccountNumber('');
        setFiatName('');
        setFiatFullName('');
        setFiatBankName('');
        //setFiatNetworkName(defaultSelected);
        setFiatBankSwiftCode('');
        setFiatIntermediaryBankName('');
        setFiatIntermediaryBankSwiftCode('');
        setFiatNameFocused(false);
        setFiatFullNameFocused(false);
        setFiatAccountNumberFocused(false);
        setFiatBankNameFocused(false);
        setFiatBankSwiftCodeFocused(false);
        setFiatIntermediaryBankNameFocused(false);
        setFiatIntermediaryBankSwiftCodeFocused(false);

        setCode2FA('');
    }, []);

    const currencyPayloadAddress = () => {
        const address = isDestinationTagExists && coinDestinationTag ? `${coinAddress}?dt=${coinDestinationTag}`
            : isMemoTagExists && coinDestinationTag ? `${coinAddress}?memo=${coinDestinationTag}`
            : coinAddress;

        return address;
    };

    const handleSubmitAddAddressCoinModal = React.useCallback(() => {
        const payload = {
            currency: currency || '',
            name: coinBeneficiaryName,
            blockchain_key: coinBlockchainName.blockchainKey,
            data: JSON.stringify({
                address: currencyPayloadAddress(),
            }),
            ...(coinDescription && { description: coinDescription }),
            otp: code2FA,
        };

        dispatch(beneficiariesCreate(payload));
    }, [coinAddress, coinBeneficiaryName, coinDescription, currency, coinBlockchainName, coinDestinationTag, code2FA]);

    const getState = React.useCallback(key => {
        switch (key) {
            case 'coinAddress':
                return coinAddress;
            case 'coinBeneficiaryName':
                return coinBeneficiaryName;
            case 'coinDestinationTag':
                return coinDestinationTag;
            case 'coinDescription':
                return coinDescription;
            case 'coinAddressFocused':
                return coinAddressFocused;
            case 'coinBeneficiaryNameFocused':
                return coinBeneficiaryNameFocused;
            case 'coinDescriptionFocused':
                return coinDescriptionFocused;
            case 'coinDestinationTagFocused':
                return coinDestinationTagFocused;
            case 'fiatName':
                return fiatName;
            case 'fiatFullName':
                return fiatFullName;
            case 'fiatAccountNumber':
                return fiatAccountNumber;
            case 'fiatBankName':
                return fiatBankName;
            case 'fiatBankSwiftCode':
                return fiatBankSwiftCode;
            case 'fiatIntermediaryBankName':
                return fiatIntermediaryBankName;
            case 'fiatIntermediaryBankSwiftCode':
                return fiatIntermediaryBankSwiftCode;
            case 'fiatNameFocused':
                return fiatNameFocused;
            case 'fiatFullNameFocused':
                return fiatFullNameFocused;
            case 'fiatAccountNumberFocused':
                return fiatAccountNumberFocused;
            case 'fiatBankNameFocused':
                return fiatBankNameFocused;
            case 'fiatBankSwiftCodeFocused':
                return fiatBankSwiftCodeFocused;
            case 'fiatIntermediaryBankNameFocused':
                return fiatIntermediaryBankNameFocused;
            case 'fiatIntermediaryBankSwiftCodeFocused':
                return fiatIntermediaryBankSwiftCodeFocused;
            case 'code2FA':
                return code2FA;
            default:
                return '';
        }
    }, [
        coinAddress,
        coinAddressFocused,
        coinBeneficiaryName,
        coinBeneficiaryNameFocused,
        coinDescription,
        coinDescriptionFocused,
        coinDestinationTag,
        coinDestinationTagFocused,
        fiatAccountNumber,
        fiatAccountNumberFocused,
        fiatBankName,
        fiatBankNameFocused,
        fiatBankSwiftCode,
        fiatBankSwiftCodeFocused,
        fiatFullName,
        fiatFullNameFocused,
        fiatIntermediaryBankName,
        fiatIntermediaryBankNameFocused,
        fiatIntermediaryBankSwiftCode,
        fiatIntermediaryBankSwiftCodeFocused,
        fiatName,
        fiatNameFocused,
        code2FA,
    ]);

    const validateCoinAddressFormat = React.useCallback((value: string) => {
        const doesCurrencyExistsInPackage = WAValidator.findCurrency(currency);

        if (doesCurrencyExistsInPackage) {
            if (currency !== 'usdt') {
                setCoinAddressValid(WAValidator.validate(value.trim(), currency));
                setCoinTestnetAddressValid(WAValidator.validate(value.trim(), currency, 'testnet'));
            } else {
                setCoinAddressValid(true);
                setCoinTestnetAddressValid(true);
            }
        } else {
            setCoinAddressValid(true);
            setCoinTestnetAddressValid(true);
        }
    }, [currency]);

    const handleChangeFieldValue = React.useCallback((key: string, value: string) => {
        switch (key) {
            case 'coinAddress':
                const address = getAddressWithoutTag(value);
                setCoinAddress(address);
                validateCoinAddressFormat(address);

                const memoTag = getTag(value);
                if (memoTag !== '-') {
                    setCoinDestinationTag(memoTag);
                }
                break;
            case 'coinBeneficiaryName':
                setCoinBeneficiaryName(value);
                break;
            case 'coinDescription':
                setCoinDescription(value);
                break;
            case 'coinDestinationTag':
                setCoinDestinationTag(value);
                break;
            case 'fiatName':
                setFiatName(value);
                break;
            case 'fiatFullName':
                setFiatFullName(value);
                break;
            case 'fiatAccountNumber':
                setFiatAccountNumber(value);
                break;
            case 'fiatBankName':
                setFiatBankName(value);
                break;
            case 'fiatBankSwiftCode':
                setFiatBankSwiftCode(value);
                break;
            case 'fiatIntermediaryBankName':
                setFiatIntermediaryBankName(value);
                break;
            case 'fiatIntermediaryBankSwiftCode':
                setFiatIntermediaryBankSwiftCode(value);
                break;
            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDestinationTagExists, isMemoTagExists]);

    const handleChangeFieldFocus = React.useCallback((key: string) => {
        switch (key) {
            case 'coinAddressFocused':
                setCoinAddressFocused(v => !v);
                break;
            case 'coinBeneficiaryNameFocused':
                setCoinBeneficiaryNameFocused(v => !v);
                break;
            case 'coinDescriptionFocused':
                setCoinDescriptionFocused(v => !v);
                break;
            case 'coinDestinationTagFocused':
                setCoinDestinationTagFocused(v => !v);
                break;
            case 'fiatNameFocused':
                setFiatNameFocused(v => !v);
                break;
            case 'fiatFullNameFocused':
                setFiatFullNameFocused(v => !v);
                break;
            case 'fiatAccountNumberFocused':
                setFiatAccountNumberFocused(v => !v);
                break;
            case 'fiatBankNameFocused':
                setFiatBankNameFocused(v => !v);
                break;
            case 'fiatBankSwiftCodeFocused':
                setFiatBankSwiftCodeFocused(v => !v);
                break;
            case 'fiatIntermediaryBankNameFocused':
                setFiatIntermediaryBankNameFocused(v => !v);
                break;
            case 'fiatIntermediaryBankSwiftCodeFocused':
                setFiatIntermediaryBankSwiftCodeFocused(v => !v);
                break;
            default:
                break;
        }
    }, []);

    const renderAddAddressModalBodyItem = React.useCallback((field: string, optional?: boolean) => {
        const focusedClass = classnames('verification-modal__content__group', {
            'verification-modal__content__group--focused': getState(`${field}Focused`),
            'verification-modal__content__group--optional': optional,
        });

        return (
            <div key={field} className={focusedClass}>
                <div className={`${field === 'coinAddress' ? 'input-with-paste' : null}`}>
                    <CustomInput
                        type="text"
                        label={formatMessage({ id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}` })}
                        placeholder={formatMessage({ id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}` })}
                        handleChangeInput={value => handleChangeFieldValue(field, value)}
                        // @ts-ignore
                        inputValue={getState(field)}
                        handleFocusInput={() => handleChangeFieldFocus(`${field}Focused`)}
                        autoFocus={field === 'coinAddress' || field === 'fiatName'}
                        defaultLabel={formatMessage({ id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}` })}
                        classNameLabel="absolute"
                        pasteIcon={field === 'coinAddress' ? true : false}
                    />
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formatMessage, getState]);

    const renderAddAddressModalBodyItemCoinDescription = React.useCallback((field: string, optional?: boolean) => {
        const focusedClass = classnames('verification-modal__content__group', {
            'verification-modal__content__group--focused': getState(`${field}Focused`),
            'verification-modal__content__group--optional': optional,
        });
        const maxLength = 80;
        return (
            <div key={field} className={focusedClass}>
                <div className="input-withcounter">
                    <div className="input-counter">{coinDescription.length} / {maxLength}</div>
                        <CustomInput
                            type="text"
                            label={formatMessage({ id: `.body.wallets.beneficiaries.addAddressModal.body.description.${field}` })}
                            placeholder={formatMessage({ id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}` })}
                            handleChangeInput={value => handleChangeFieldValue(field, value)}
                            // @ts-ignore
                            inputValue={getState(field)}
                            handleFocusInput={() => handleChangeFieldFocus(`${field}Focused`)}
                            autoFocus={field === 'coinDescription'}
                            defaultLabel={formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.description' })}
                            classNameLabel="absolute"
                            maxLength={maxLength}
                        />
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formatMessage, getState]);

    const renderInvalidAddressMessage = () => {
        return (
          <div className="beneficiaries-list-modal__error">
            {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.invalidAddress' })}
          </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    const renderTestnetAddressMessage = () => {
        return (
          <div className="beneficiaries-list-modal__warning">
            {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.testnetAddress' })}
          </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    const handleChangeBlockchain = React.useCallback((type: string) => (index: number) => {
        const blockchainItem = currencyItem.networks[index];
        const item = {
            blockchainKey: blockchainItem.blockchain_key,
            protocol: blockchainItem.protocol || '',
            name: currencyItem.name,
            id: currencyItem.id,
            fee: blockchainItem?.withdraw_fee,
            minWithdraw: blockchainItem.min_withdraw_amount,
        };

        type === 'coin' ? setCoinBlockchainName(item) : null; //setFiatNetworkName(item)
    }, [currencyItem]);

    const renderDropdownItem = React.useCallback((name, fixed, price) => (item: BlockchainCurrencies, index) => {
        return (
            <BeneficiariesBlockchainItem
                blockchainKey={item.blockchain_key}
                protocol={item.protocol}
                name={name}
                id={item.currency_id}
                fee={item?.withdraw_fee}
                minWithdraw={item.min_withdraw_amount}
                fixed={fixed}
                price={price}
                disabled={item.status === 'disabled'}
                isHidden={item.status === 'hidden'}
            />
        );
    }, []);

    const render2FACode = () => {
        return (
            <div className="twofa__form__content">
                <div className="twofa__form__content__header">
                    {formatMessage({ id: 'page.mobile.twoFactorModal.subtitle' })}
                </div>
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
            </div>
        );
    };

    const renderAddAddressModalCryptoBody = () => {
        const addressValid = coinAddressValid || coinTestnetAddressValid;
        const isDisabled = !coinAddress || !coinBeneficiaryName || !addressValid || !coinBlockchainName.blockchainKey || !is2faValid(code2FA);

        return (
            <React.Fragment>
                <div className="beneficiaries-list-modal__body">
                    {renderAddAddressModalBodyItem('coinAddress')}
                    {!coinAddressValid && !coinTestnetAddressValid && coinAddress && renderInvalidAddressMessage()}
                    {!coinAddressValid && coinTestnetAddressValid && coinAddress && renderTestnetAddressMessage()}
                    <div className="verification-modal__content__group">
                        <DropdownBeneficiary
                            list={currencyItem?.networks?.map(renderDropdownItem(currencyItem.name, currencyItem.precision, currencyItem.price))}
                            selectedValue={coinBlockchainName}
                            onSelect={handleChangeBlockchain('coin')}
                            placeholder={formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.blockchain.networks' })}
                            clear={false}
                        />
                    </div>
                    {renderAddAddressModalBodyItem('coinBeneficiaryName')}
                    {renderAddAddressModalBodyItemCoinDescription('coinDescription', true)}
                    {(isDestinationTagExists || isMemoTagExists) && renderAddAddressModalBodyItem('coinDestinationTag', true)}
                    {render2FACode()}
                </div>
                <div className="beneficiaries-list-modal__footer">
                    <Button
                        onClick={handleSubmitAddAddressCoinModal}
                        disabled={isDisabled}
                        className={`medium-button ${isMobileDevice && 'themes'}`}
                    >
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.button' })}
                    </Button>
                </div>
            </React.Fragment>
             
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    const handleSubmitAddAddressFiatModal = React.useCallback(() => {
        const data: BeneficiaryBank = {
            full_name: fiatFullName,
            account_number: fiatAccountNumber,
            bank_name: fiatBankName,
            ...(fiatBankSwiftCode && { bank_swift_code: fiatBankSwiftCode }),
            ...(fiatIntermediaryBankName && { intermediary_bank_name: fiatIntermediaryBankName }),
            ...(fiatIntermediaryBankSwiftCode && { intermediary_bank_swift_code: fiatIntermediaryBankSwiftCode }),
        };

        const payload = {
            //blockchain_key: fiatNetworkName.blockchainKey,
            currency: currency || '',
            name: fiatName,
            data: JSON.stringify(data),
            otp: code2FA,
        };

        dispatch(beneficiariesCreate(payload));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        fiatAccountNumber,
        fiatBankName,
        fiatBankSwiftCode,
        fiatFullName,
        fiatIntermediaryBankName,
        fiatIntermediaryBankSwiftCode,
        fiatName,
        code2FA,
    ]);

    const renderAddAddressModalFiatBody = () => {
        const isDisabled = !fiatName || !fiatFullName || !fiatAccountNumber || !fiatBankName || !is2faValid(code2FA);

        return (
            <React.Fragment>
                <div className="beneficiaries-list-modal__body">
                    {renderAddAddressModalBodyItem('fiatName')}
                    {renderAddAddressModalBodyItem('fiatFullName')}
                    {renderAddAddressModalBodyItem('fiatAccountNumber')}
                    {renderAddAddressModalBodyItem('fiatBankName')}
                    {renderAddAddressModalBodyItem('fiatBankSwiftCode', true)}
                    {renderAddAddressModalBodyItem('fiatIntermediaryBankName', true)}
                    {renderAddAddressModalBodyItem('fiatIntermediaryBankSwiftCode', true)}
                    {render2FACode()}
                </div>
                <div className="beneficiaries-list-modal__footer">
                    <Button
                        onClick={handleSubmitAddAddressFiatModal}
                        disabled={isDisabled}
                        className={`medium-button ${isMobileDevice && 'themes'}`}
                    >
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.button' })}
                    </Button>
                </div>
            </React.Fragment>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    const renderContent = React.useCallback(() => {
        const addModalClass = classnames('beneficiaries-list-modal', {
            'beneficiaries-list-modal--coin': type === 'coin',
            'beneficiaries-list-modal--fiat': type === 'fiat',
        });

        return (
            <div className={addModalClass}>
                {beneficiaries.length >= 10 ? (
                    <div className="beneficiaries-list-modal__body">
                        <div className="beneficiaries-list-modal__body__empty">
                            <WarningIcon />
                            {formatMessage({ id: 'error.beneficiaries.max10.warning' })}
                        </div>
                    </div>
                ) : (
                    type === 'coin' ? renderAddAddressModalCryptoBody() : renderAddAddressModalFiatBody()
                )}
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, isMobileDevice, getState]);

    return (
        renderContent()
    );
};

export const BeneficiariesAddModal = React.memo(BeneficiariesAddModalComponent);
