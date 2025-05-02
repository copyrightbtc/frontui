import cr from 'classnames';
import * as React from 'react';
import { Button } from '@mui/material';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { CustomInput } from '../../../components';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

import {
    changeUserLevel,
    resendCode,
    RootState,
    selectVerifyPhoneSuccess,
    sendCode,
    verifyPhone,
    selectMobileDeviceState,
} from '../../../modules';

interface ReduxProps {
    verifyPhoneSuccess?: string;
    isMobileDevice: boolean;
}

interface PhoneState {
    phoneNumber: string;
    phoneNumberFocused: boolean;
    confirmationCode: string;
    confirmationCodeFocused: boolean;
    resendCode: boolean;
}

interface DispatchProps {
    resendCode: typeof resendCode;
    sendCode: typeof sendCode;
    verifyPhone: typeof verifyPhone;
    changeUserLevel: typeof changeUserLevel;
}
 
type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

class PhoneComponent extends React.Component<Props, PhoneState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            phoneNumber: '',
            phoneNumberFocused: false,
            confirmationCode: '',
            confirmationCodeFocused: false,
            resendCode: false,
        };
    }

    public componentDidUpdate(prevProps: Props) {
        const { history, verifyPhoneSuccess, isMobileDevice } = this.props;

        if (verifyPhoneSuccess !== prevProps.verifyPhoneSuccess) {
            history.push('/profile');
        }
        if ( verifyPhoneSuccess !== prevProps.verifyPhoneSuccess && isMobileDevice){
            history.push('/profile/verification');
        }
    }

    public render() {
        const {
            phoneNumber, 
            confirmationCode,
            confirmationCodeFocused,
        } = this.state;
 

        const inputFocusedClass = cr('verification-modal__content__group', {
            'verification-modal__content__group--focused': confirmationCodeFocused,
        });

        return (
            <div className="verification-modal__content__phone">
                <PhoneInput
                    placeholder={this.translate('page.body.kyc.phone.phoneNumber')}
                    value={phoneNumber}
                    onChange={this.handleChangePhoneNumber}
                    enableAreaCodes={true}
                    enableAreaCodeStretch
                    enableSearch
                    inputClass="phone_input"
                    buttonClass="phone_input-flags"
                />
                <div className="verification-modal__content__phone__resend">
                    <Button
                        onClick={this.handleSendCode}
                        className="little-button blue"
                        disabled={!phoneNumber}
                    >
                        {this.state.resendCode ? this.translate('page.body.kyc.phone.resend') : this.translate('page.body.kyc.phone.send')}
                    </Button>
                </div>
                <div className={inputFocusedClass}>
                    <CustomInput
                        type="string"
                        defaultLabel={this.translate('page.body.kyc.phone.code')}
                        classNameLabel="absolute center"
                        handleChangeInput={this.handleChangeConfirmationCode}
                        onKeyPress={this.handleConfirmEnterPress}
                        inputValue={confirmationCode}
                        placeholder={this.translate('page.body.kyc.phone.code')}
                        handleFocusInput={this.handleFieldFocus('confirmationCode')}
                        classNameInput="text-center"
                    />
                </div>
                <div className="modal-window__container__footer">
                    <Button
                        onClick={this.props.isMobileDevice ? this.confirmMobilePhone : this.confirmPhone}
                        className="medium-button"
                        disabled={!confirmationCode}
                    >
                        {this.translate('page.body.kyc.next')}
                    </Button>
                </div>
            </div>
        );
    }

    private handleFieldFocus = (field: string) => {
        return() => {
            switch (field) {
                case 'confirmationCode':
                    this.setState({
                        confirmationCodeFocused: !this.state.confirmationCodeFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    };

    private handleConfirmEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.confirmPhone();
        }
    };
 
    private confirmMobilePhone = () => {
        const requestProps = {
            phone_number: String(this.state.phoneNumber),
            verification_code: String(this.state.confirmationCode),
        };
        this.props.verifyPhone(requestProps);
        this.props.history.push('/profile/verification');
    };

    private confirmPhone = () => {
        const requestProps = {
            phone_number: String(this.state.phoneNumber),
            verification_code: String(this.state.confirmationCode),
        };
        this.props.verifyPhone(requestProps);
        this.props.history.push('/profile');
    };
 
    private handleChangePhoneNumber = (value: string) => {
        this.setState({
            phoneNumber: value,
            resendCode: false,
        });
    };
 

    private handleChangeConfirmationCode = (value: string) => {
        if (this.inputConfirmationCode(value)) {
            this.setState({
                confirmationCode: value,
            });
        }
    };

    private inputConfirmationCode = (value: string) => {
        const convertedText = value.trim();
        const condition = new RegExp('^\\d*?$');

        return condition.test(convertedText);
    };

    private handleSendCode = event => {
        event.preventDefault();
        const requestProps = {
            phone_number: String(this.state.phoneNumber),
        };

        if (!this.state.resendCode) {
            this.props.sendCode(requestProps);
            this.setState({
                resendCode: true,
            });
        } else {
            this.props.resendCode(requestProps);
        }
    };

    private translate = (id: string) => this.props.intl.formatMessage({ id });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    verifyPhoneSuccess: selectVerifyPhoneSuccess(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        resendCode: phone => dispatch(resendCode(phone)),
        sendCode: phone => dispatch(sendCode(phone)),
        verifyPhone: payload => dispatch(verifyPhone(payload)),
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
    });

export const Phone = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(PhoneComponent) as any; 
