import cr from 'classnames';
import React from 'react';
import { Button, IconButton } from '@mui/material';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { IconInput } from '../';
import { captchaLogin } from '../../api';
import { EMAIL_REGEX } from '../../helpers';
import { GeetestCaptchaResponse } from '../../modules';
import { selectMobileDeviceState } from '../../modules/public/globalSettings';
import { RotateSpinner } from 'react-spinners-kit';

import { NoVisible } from '../../assets/images/customization/NoVisible';
import { Visible } from '../../assets/images/customization/Visible';

export interface SignInProps {
    labelSignIn?: string;
    labelSignUp?: string;
    emailLabel?: string;
    passwordLabel?: string;
    receiveConfirmationLabel?: string;
    forgotPasswordLabel?: string;
    isLoading?: boolean;
    title?: string;
    onForgotPassword: (email?: string) => void;
    onConfirmationResend?: (email?: string) => void;
    onSignUp: () => void;
    onSignIn: () => void;
    className?: string;
    image?: string;
    email: string;
    emailError: string;
    password: string;
    passwordError: string;
    emailFocused: boolean;
    emailPlaceholder: string;
    passwordFocused: boolean;
    passwordPlaceholder: string;
    isFormValid: () => void;
    refreshError: () => void;
    handleChangeFocusField: (value: string) => void;
    changePassword: (value: string) => void;
    changeEmail: (value: string) => void;
    captchaType?: 'recaptcha' | 'geetest' | 'none';
    renderCaptcha?: JSX.Element | null;
    reCaptchaSuccess?: boolean;
    geetestCaptchaSuccess?: boolean;
    captcha_response?: string | GeetestCaptchaResponse;
}

const SignIn: React.FC<SignInProps> = ({
    email,
    emailError,
    emailPlaceholder,
    password,
    passwordError,
    passwordPlaceholder,
    isLoading,
    image,
    labelSignIn,
    emailFocused,
    passwordFocused,
    onForgotPassword,
    forgotPasswordLabel,
    refreshError,
    onSignIn,
    isFormValid,
    handleChangeFocusField,
    changePassword,
    changeEmail,
    geetestCaptchaSuccess,
    reCaptchaSuccess,
    renderCaptcha,
    captchaType
}) => {
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const history = useHistory();
    const { formatMessage } = useIntl();

    const isValidForm = React.useCallback(() => {
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid && password;
    }, [email, password]);

    const handleChangeEmail = React.useCallback(
        (value: string) => {
            changeEmail(value);
        },
        [changeEmail]
    );

    const handleChangePassword = React.useCallback(
        (value: string) => {
            changePassword(value);
        },
        [changePassword]
    );

    const handleFieldFocus = React.useCallback(
        (field: string) => {
            handleChangeFocusField(field);
        },
        [handleChangeFocusField]
    );

    const isButtonDisabled = (): boolean => {
        return ((captchaLogin() && captchaType !== 'none' && !reCaptchaSuccess && !geetestCaptchaSuccess)) ? true : false;
    };

    const handleSubmitForm = React.useCallback(() => {
        refreshError();
        onSignIn();
    }, [onSignIn, refreshError]);

    const handleValidateForm = React.useCallback(() => {
        isFormValid();
    }, [isFormValid]);

    const handleClick = React.useCallback(
        (e?: MouseEvent) => {
            if (e) {
                e.preventDefault();
            }
            if (!isValidForm()) {
                handleValidateForm();
            } else {
                handleSubmitForm();
            }
        },
        [handleSubmitForm, handleValidateForm, isValidForm]
    );

    const handleEnterPress = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();

                handleClick();
            }
        },
        [handleClick]
    );

    const renderForgotButton = React.useMemo(
        () => ( 
            <div className="simple_link" onClick={() => onForgotPassword(email)}>
                {forgotPasswordLabel || formatMessage({ id: 'page.header.signin.forgotpassword' })} 
            </div> 
        ),
        [forgotPasswordLabel, onForgotPassword, email]
    );

    const renderRegister = React.useMemo(
        () => ( 
            <div className="simple_link" onClick={() => history.push('/signup')}>
                {formatMessage({ id: 'page.body.land.button.register' })}
            </div> 
        ),
        [formatMessage, history]
    ); 
    const [passwordShown, setPasswordShown] = React.useState(false); 
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
      }; 

    return (
        <form className="login-form"> 
            <div className="login-form__content" onKeyPress={handleEnterPress}>
            <h1>{formatMessage({ id: 'page.body.landing.header.login' })}</h1>
                {image ? (
                    <div className="login-form__content__image">
                        <img src={image} alt="logo" />
                    </div>
                ) : null}
                <div
                    className={cr('login-form__content__group', {
                        'login-form__content__group--focused': emailFocused,
                    })}>
                    <IconInput
                        type="email" 
                        placeholder={emailPlaceholder}
                        handleChangeInput={handleChangeEmail}
                        inputValue={email}
                        handleFocusInput={() => handleFieldFocus('email')}
                        autoFocus={!isMobileDevice}
                    />
                    <svg className="iconfrom" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                        <path d="M45,46.1h-2.3c0-0.1,0-3.6,0-4.8c0-0.1,0-0.1,0-0.2v-0.2c0-0.1,0-0.2,0-0.3c0-0.2-0.1-0.4-0.1-0.6
                            c0-0.1,0-0.2-0.1-0.3c0-0.1,0-0.1-0.1-0.2c0-0.1,0-0.2-0.1-0.3c-0.1-0.3-0.3-0.6-0.4-0.9c0-0.1-0.1-0.2-0.2-0.3
                            c-0.3-0.5-0.8-0.9-1.2-1.1c-1.6-0.8-9.2-2.6-12-3.7c-0.6-0.2-1.7-0.7-1.7-1.6c0-1,1.2-2.1,1.2-2.1c4-1.9,6.3-7.4,6.3-12.3
                            c0-6.1-1.5-11-9.3-11c-7.8,0-9.3,4.9-9.3,11c0,4.9,2.4,10.4,6.3,12.3c0,0,1.2,1.1,1.2,2.1c0,0.9-1.1,1.4-1.7,1.6
                            c-2.8,1.1-10.4,2.9-12,3.7c-0.4,0.2-0.9,0.6-1.2,1.1c-0.1,0.1-0.1,0.2-0.2,0.3c-0.2,0.3-0.3,0.6-0.4,0.9c0,0.1-0.1,0.2-0.1,0.3
                            c0,0.1,0,0.1-0.1,0.2c0,0.1,0,0.2-0.1,0.3c0,0.2-0.1,0.4-0.1,0.6c0,0.1,0,0.2,0,0.3v0.2c0,0,0,0.1,0,0.2c0,1.2,0,4.8,0,4.8H5
                            c0-0.1,0-5.2,0-5.2c0.1-2.1,1-4.2,2.1-5.3c1.2-1.1,10.9-3.3,13.3-3.8c-4.6-2.5-7.5-8.7-7.5-14.5c0-7.5,2.2-13.6,12-13.6v0
                            c0,0,0,0,0,0s0,0,0,0v0c9.8,0,12,6.1,12,13.6c0,5.8-2.8,12-7.5,14.5c2.4,0.5,12.1,2.7,13.3,3.8c1.2,1.1,2,3.2,2.1,5.3
                            C45,40.9,45,46,45,46.1z"/>
                    </svg> 
                </div>
                {emailError && <div className={'login-form__error'}>{emailError}</div>}
                <div
                    className={cr('login-form__content__group', {
                        'login-form__content__group--focused': passwordFocused,
                    })}>
                    <IconInput
                        type={passwordShown ? "text" : "password"}
                        placeholder={passwordPlaceholder}
                        handleChangeInput={handleChangePassword}
                        inputValue={password}
                        handleFocusInput={() => handleFieldFocus('password')} 
                        autoFocus={false}
                        maxLength={30}
                    />
                    <IconButton 
                        onClick={togglePasswordVisiblity}
                        className={passwordShown ? "passvisible" : "passnovisible"}
                    >
                        {passwordShown ? <Visible /> : <NoVisible  />}
                    </IconButton>
                    <svg className="iconfrom" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                        <path d="M25,27.7c-0.7,0-1.3,0.6-1.3,1.3v8c0,0.7,0.6,1.3,1.3,1.3c0.7,0,1.3-0.6,1.3-1.3v-8
                            C26.3,28.3,25.7,27.7,25,27.7z M39.7,41c0,1.5-1.2,2.7-2.7,2.7l-24,0c-1.5,0-2.7-1.2-2.7-2.7V25c0-1.5,1.2-2.7,2.7-2.7l24,0
                            c1.5,0,2.7,1.2,2.7,2.7V41z M15.7,15.7c0-5.2,4.2-9.3,9.3-9.3s9.3,4.2,9.3,9.3v4H15.7V15.7z M37,19.7v-4c0-6.6-5.4-12-12-12
                            c-6.6,0-12,5.4-12,12v4c-2.9,0-5.3,2.4-5.3,5.3l0,16v5.3H13h24h5.3V41V25C42.3,22.1,39.9,19.7,37,19.7z"/>
                    </svg> 
                </div>
                {passwordError && <div className={'login-form__error'}>{passwordError}</div>}
                {captchaLogin() && renderCaptcha}
                <div className="login-form__button">
                    <Button
                        className="big-button"
                        disabled={isLoading || !email.match(EMAIL_REGEX) || !password || isButtonDisabled()}
                        onClick={handleClick as any}
                    >
                        {isLoading ? <RotateSpinner size={29} color="#000"/> : labelSignIn ? labelSignIn : formatMessage({ id: 'page.body.land.button.enter' })}
                    </Button>
                </div>
                <div className="login-form__footer">
                    {renderForgotButton}
                    {renderRegister}
                </div>
            </div> 
        </form>
    );
};

export const SignInComponent = React.memo(SignIn);
