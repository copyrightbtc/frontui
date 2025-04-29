import cr from 'classnames';
import React, { FormEvent } from 'react';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl'; 
import { IconInput } from '../IconInput'; 
import { EMAIL_REGEX } from '../../helpers';
import { GeetestCaptchaResponse } from '../../modules';
import { selectMobileDeviceState } from '../../modules/public/globalSettings';
import { RotateSpinner } from 'react-spinners-kit';

export interface EmailFormProps {
    image?: string;
    title?: string;
    buttonLabel?: string;
    errorMessage?: string;
    isLoading?: boolean;
    OnSubmit: () => void;
    className?: string;
    emailLabel?: string;
    email: string;
    message: string;
    emailError: string;
    emailFocused: boolean;
    placeholder?: string;
    validateForm: () => void;
    handleInputEmail: (value: string) => void;
    handleFieldFocus: () => void;
    handleReturnBack: () => void;
    captchaType?: 'recaptcha' | 'geetest' | 'none';
    renderCaptcha?: JSX.Element | null;
    reCaptchaSuccess?: boolean;
    geetestCaptchaSuccess?: boolean;
    captcha_response?: string | GeetestCaptchaResponse;
}

export const EmailForm: React.FC<EmailFormProps> = (props) => {
    const { formatMessage } = useIntl();
    const isMobileDevice = useSelector(selectMobileDeviceState);

    const {
        image,
        title,
        buttonLabel,
        isLoading,
        emailLabel,
        message,
        email,
        emailFocused,
        emailError,
        captchaType,
        geetestCaptchaSuccess,
        reCaptchaSuccess,
    } = props;

    const handleCancel = () => {
        props.handleReturnBack();
    };

    const handleSubmitForm = () => {
        props.OnSubmit();
    };

    const isValidForm = () => {
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid;
    };

    const isButtonDisabled = (): boolean => {
        if (isLoading || !email.match(EMAIL_REGEX)) {
            return true;
        }

        if (captchaType === 'recaptcha' && !reCaptchaSuccess) {
            return true;
        }

        if (captchaType === 'geetest' && !geetestCaptchaSuccess) {
            return true;
        }

        return false;
    };

    const loginFormClass = cr('login-form__content', {
        'login-form__content--extended': captchaType && captchaType !== 'none',
    });

    const handleClick = (e: FormEvent<HTMLInputElement>) => {
        if (e) {
            e.preventDefault();
        }
        if (!isValidForm()) {
            props.validateForm();
        } else {
            handleSubmitForm();
        }
    };
 

    const intl = useIntl(); 

    const renderBackloginButton = (
        <div className="simple_link" onClick={handleCancel}>  
            {intl.formatMessage({ id: 'page.header.signIn.backLogin' })}
        </div>
    );

    return (
        <form className="login-form">
            <div className={loginFormClass}>
                <h1>{title || 'Forgot password'}</h1>
                {image ? (
                    <div className="login-form__content__image">
                        <img src={image} alt="logo" />
                    </div>
                ) : null}
                <div className="login-form__content__title">
                    {message}
                </div>
                <div className={cr('login-form__content__group', {
                        'login-form__content__group--focused': emailFocused,
                    })}>
                        <IconInput
                            type="email"
                            placeholder={emailLabel || 'Email'}
                            handleChangeInput={props.handleInputEmail}
                            inputValue={email}
                            handleFocusInput={props.handleFieldFocus}
                            autoFocus={!isMobileDevice}
                        />
                        <svg className="iconfrom" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                            <path d="M18,30.5l6.3,5.1l7.3-5.6l10.6,13.6H7.7C7.7,43.7,18,30.5,18,30.5z M6.3,21.1l9.5,7.7L6.3,40.9
                                C6.3,40.9,6.3,21.1,6.3,21.1z M25,6.3L43.1,18L24.4,32.2L6.8,18C6.8,18,25,6.3,25,6.3z M43.7,40.9l-9.8-12.6l9.8-7.4V40.9z M25,3.7
                                L3.7,17v29.3h42.7V17C46.3,17,25,3.7,25,3.7z"/>
                        </svg>
                    </div>
                    {emailError && <div className="login-form__error">{emailError}</div>}
                    {props.renderCaptcha}
                    <div className="login-form__button">
                        <Button
                            className="big-button"
                            disabled={isButtonDisabled()}
                            onClick={e => handleClick(e as any)}
                        >
                            {isLoading ? <RotateSpinner size={29} color="#000"/> : buttonLabel ? buttonLabel : formatMessage({ id: 'page.forgotPassword.send' })}
                        </Button>
                    </div>
                    <div className="login-form__footer">
                        {renderBackloginButton}
                    </div>
                </div>
        </form>
    );
}
 