import cr from 'classnames';
import React from 'react';
import Select from 'react-select';
import { Button, IconButton } from '@mui/material';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { useIntl } from 'react-intl';
import { CustomInput } from '../CustomInput';

export const AddPaymentComponent = props => {
    const { formatMessage } = useIntl();

    const [payType, setPayType] = React.useState('');
    const [accountName, setAccountName] = React.useState('');
    const [bankName, setBankName] = React.useState('');
    const [bankBranch, setBankBranch] = React.useState('');
    const [bankAccount, setBankAccount] = React.useState('');
    const [accountNameFocus, setAccountNameFocus] = React.useState(false);
    const [bankNameFocus, setBankNameFocus] = React.useState(false);
    const [bankAccountFocus, setBankAccountFocus] = React.useState(false);
    const [bankBranchFocus, setBankBranchFocus] = React.useState(false);

    const intl = useIntl();

    const handleAddPayment = () => {
        const payload: {
            payment_type: string;
            account_name: string;
            data: Record<string, string>
        } = {
            payment_type: payType,
            account_name: accountName,
            data: {},
        }

        if (payType === 'bank') {
            payload.data = {
                bank_name: bankName,
                bank_branch: bankBranch,
                bank_account: bankAccount,
            }
        }

        props.handleAddPayment(payload);

        setPayType('')
        setAccountName('')
        setBankName('')
        setBankAccount('')
        setBankBranch('')
        setAccountNameFocus(false)
    }; 

    const handleFocusAccountName = () => {
        setAccountNameFocus(!accountNameFocus);
    };

    const handleFocusBankName = () => {
        setBankNameFocus(!bankNameFocus);
    };

    const handleFocusBankAccount = () => {
        setBankAccountFocus(!bankAccountFocus);
    };

    const handleFocusBankBranch = () => {
        setBankBranchFocus(!bankBranchFocus);
    };

    const isValidForm = () => {
        if (!payType.length) return false
        if (!accountName.length) return false
        if (payType === '') {
            if (!bankName.length) return false
            if (!bankAccount.length) return false
            if (!bankBranch.length) return false
        }

        return true;
    }; 

    const translBank = formatMessage({id: 'page.body.p2p.payments.type.bank'});
 
    const options = [
        { value: 'bank', label: translBank },
      ];

    const renderHeader = () => (
        <div className="modal-window__container__header"> 
            <h1>{props.title}</h1>
            <div className="modal-window__container__header__close">
                <IconButton 
                    onClick={props.closeModal}
                    sx={{
                        color: 'var(--color-dark)',
                        '&:hover': {
                            color: 'var(--color-accent)'
                        }
                    }}
                >
                    <CloseIcon className="icon_closeed themes"/>
                </IconButton>
            </div>
        </div>
    );
 

    const renderBody = () => {
 
        const handleEnterPress = React.useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
    
                    if (isValidForm()) {
                        handleAddPayment();
                    }
                }
            },
            [handleAddPayment]
        );

        const accountNameClass = cr('login-form__content__group', {
            'login-form__content__group--focused': accountNameFocus,
        });

        const bankNameClass = cr('login-form__content__group', {
            'login-form__content__group--focused': bankNameFocus,
        });

        const bankAccountClass = cr('login-form__content__group', {
            'login-form__content__group--focused': bankAccountFocus,
        });

        const bankBranchClass = cr('login-form__content__group', {
            'login-form__content__group--focused': bankBranchFocus,
        });

        return (
            <div onKeyPress={handleEnterPress}>
                <div className="selectdrop themes">
                    <Select
                        isSearchable
                        isClearable
                        className="selectdrop-dropdown"
                        classNamePrefix="selectdrop-dropdown__prefix"
                        placeholder={formatMessage({id: 'page.body.p2p.payments.modal.add.type'})}
                        onChange={(options) =>
                            !options ? setPayType("") : setPayType(options.value)
                          }
                        maxMenuHeight={222}
                        options={options}
                    />
                </div>
                {payType === 'bank' && (
                    <>
                        <div className={accountNameClass}>
                            <div className="l-padding">
                                <CustomInput
                                    type="text"
                                    placeholder={formatMessage({id:'page.body.p2p.payments.account_name'})}
                                    handleChangeInput={setAccountName}
                                    inputValue={accountName}
                                    handleFocusInput={handleFocusAccountName}
                                    autoFocus={false}
                                    defaultLabel={formatMessage({id:'page.body.p2p.payments.account_name'})}
                                    classNameLabel="absolute"
                                />
                            </div>
                        </div>
                        <div className={bankNameClass}>
                            <div className="l-padding">
                                <CustomInput
                                    type="text"
                                    placeholder={formatMessage({id:'page.body.p2p.payments.bank_name'})}
                                    handleChangeInput={setBankName}
                                    inputValue={bankName}
                                    handleFocusInput={handleFocusBankName}
                                    autoFocus={false}
                                    defaultLabel={formatMessage({id:'page.body.p2p.payments.bank_name'})}
                                    classNameLabel="absolute"
                                />
                            </div>
                        </div>
                        <div className={bankAccountClass}>
                            <div className="l-padding">
                                <CustomInput
                                    type="text"
                                    placeholder={formatMessage({id:'page.body.p2p.payments.bank_account'})}
                                    handleChangeInput={setBankAccount}
                                    inputValue={bankAccount}
                                    handleFocusInput={handleFocusBankAccount}
                                    autoFocus={false}
                                    defaultLabel={formatMessage({id:'page.body.p2p.payments.bank_account'})}
                                    classNameLabel="absolute"
                                />
                            </div>
                        </div>
                        <div className={bankBranchClass}>
                            <div className="l-padding">
                                <CustomInput
                                    type="text"
                                    placeholder={formatMessage({id:'page.body.p2p.payments.bank_branch'})}
                                    handleChangeInput={setBankBranch}
                                    inputValue={bankBranch}
                                    handleFocusInput={handleFocusBankBranch}
                                    autoFocus={false}
                                    defaultLabel={formatMessage({id:'page.body.p2p.payments.bank_branch'})}
                                    classNameLabel="absolute"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className="modal-window__button">
                <Button
                    disabled={!isValidForm()}
                    onClick={handleAddPayment} 
                    className="medium-button themes"
                >
                    {intl.formatMessage({id: 'page.body.p2p.payments.add'})}
                </Button>
            </div>
        );
    };

    return (
        <form className="modal-window__container fadet"> 
            <div className="login-form"> 
                <div className="login-form__content">
                    {props.title && renderHeader()}
                    {renderBody()}
                    {renderFooter()}
                </div>
            </div> 
        </form>
    );
};

export const AddPayment = React.memo(AddPaymentComponent);
