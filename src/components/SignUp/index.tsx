import cr from 'classnames';
import React, { useState } from 'react';
import { Button, IconButton, Checkbox, Accordion, AccordionSummary } from '@mui/material';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { IconInput, PasswordStrengthMeter } from '../';
import { isUsernameEnabled } from '../../api';
import { passwordMinEntropy } from '../../api/config';
import { RotateSpinner } from 'react-spinners-kit';
import { DoubleArrowDownIcon } from 'src/assets/images/DoubleArrowDownIcon';
import {
    EMAIL_REGEX,
    ERROR_LONG_USERNAME,
    ERROR_SHORT_USERNAME,
    PASSWORD_REGEX,
    USERNAME_REGEX,
} from '../../helpers';
import { GeetestCaptchaResponse } from '../../modules';
import { selectMobileDeviceState } from '../../modules/public/globalSettings';

import { NoVisible } from '../../assets/images/customization/NoVisible';
import { Visible } from '../../assets/images/customization/Visible';

export interface SignUpFormProps {
    isLoading?: boolean;
    title?: string;
    onSignUp: () => void;
    onSignIn?: () => void;
    className?: string;
    image?: string;
    labelSignIn?: string;
    labelSignUp?: string;
    usernameLabel?: string;
    emailLabel?: string;
    passwordLabel?: string;
    confirmPasswordLabel?: string;
    referralUIDLabel?: string;
    termsMessage?: string;
    referralUID: string;
    password: string;
    username: string;
    email: string;
    confirmPassword: string;
    handleChangeUsername: (value: string) => void;
    handleChangeEmail: (value: string) => void;
    handleChangePassword: (value: string) => void;
    handleChangeConfirmPassword: (value: string) => void;
    handleChangeReferralUID: (value: string) => void;
    hasConfirmed: boolean;
    clickCheckBox: (e: any) => void;
    validateForm: () => void;
    emailError: string;
    passwordError: string;
    confirmationError: string;
    handleFocusUsername: () => void;
    handleFocusEmail: () => void;
    handleFocusPassword: () => void;
    handleFocusConfirmPassword: () => void;
    handleFocusReferralUID: () => void;
    confirmPasswordFocused: boolean;
    referralUIDFocused: boolean;
    usernameFocused: boolean;
    emailFocused: boolean;
    passwordFocused: boolean;
    renderCaptcha: JSX.Element | null;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    captcha_response?: string | GeetestCaptchaResponse;
    captchaType: 'recaptcha' | 'geetest' | 'none';
    currentPasswordEntropy: number;
    passwordErrorFirstSolved: boolean;
    passwordErrorSecondSolved: boolean;
    passwordErrorThirdSolved: boolean;
    passwordErrorForthSolved: boolean;
    passwordPopUp: boolean;
    myRef: any;
    passwordWrapper: any;
    translate: (id: string) => string;
}

const SignUpFormComponent: React.FC<SignUpFormProps> = ({
    username,
    email,
    confirmPassword,
    referralUID,
    onSignIn,
    image,
    isLoading, 
    labelSignUp,
    usernameLabel,
    emailLabel,
    confirmPasswordLabel,
    passwordFocused,
    referralUIDLabel, 
    geetestCaptchaSuccess,
    hasConfirmed,
    reCaptchaSuccess,
    currentPasswordEntropy,
    password,
    passwordLabel,
    emailError,
    translate,
    confirmationError,
    usernameFocused,
    emailFocused,
    passwordErrorFirstSolved,
    passwordErrorSecondSolved,
    confirmPasswordFocused,
    handleChangePassword,
    passwordErrorThirdSolved,
    passwordErrorForthSolved,
    handleFocusPassword,
    referralUIDFocused,
    validateForm,
    onSignUp,
    handleChangeUsername,
    handleFocusUsername,
    handleChangeEmail,
    handleFocusEmail,
    handleChangeConfirmPassword,
    handleFocusConfirmPassword,
    handleChangeReferralUID,
    handleFocusReferralUID,
    clickCheckBox,
    renderCaptcha,
    captchaType
}) => {
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const history = useHistory();
    const { formatMessage } = useIntl();

    const disableButton = (): boolean => {

        if (!hasConfirmed || isLoading || !email.match(EMAIL_REGEX) || !password || !confirmPassword ||
            (isUsernameEnabled() && !username.match(USERNAME_REGEX))) {

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

    const renderPasswordInput = () => {
 
        return (
            <div className={cr('login-form__content__group', {
                'login-form__content__group--focused': passwordFocused,
                })}>
                <IconInput
                    type={passwordShown ? "text" : "password"}
                    placeholder={passwordLabel || 'Password'}
                    handleChangeInput={handleChangePassword}
                    inputValue={password}
                    handleFocusInput={handleFocusPassword}
                    classNameInput="login-form__input"
                    autoFocus={false}
                    maxLength={30}
                /> 
                
                <IconButton
                    onClick={togglePasswordVisiblity}
                    className={passwordShown ? "passvisible" : "passnovisible"}
                    >{passwordShown ? <Visible /> : <NoVisible />}
                </IconButton>
                <svg className="iconfrom" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                    <path d="M25,27.7c-0.7,0-1.3,0.6-1.3,1.3v8c0,0.7,0.6,1.3,1.3,1.3c0.7,0,1.3-0.6,1.3-1.3v-8
                        C26.3,28.3,25.7,27.7,25,27.7z M39.7,41c0,1.5-1.2,2.7-2.7,2.7l-24,0c-1.5,0-2.7-1.2-2.7-2.7V25c0-1.5,1.2-2.7,2.7-2.7l24,0
                        c1.5,0,2.7,1.2,2.7,2.7V41z M15.7,15.7c0-5.2,4.2-9.3,9.3-9.3s9.3,4.2,9.3,9.3v4H15.7V15.7z M37,19.7v-4c0-6.6-5.4-12-12-12
                        c-6.6,0-12,5.4-12,12v4c-2.9,0-5.3,2.4-5.3,5.3l0,16v5.3H13h24h5.3V41V25C42.3,22.1,39.9,19.7,37,19.7z"/>
                </svg> 
                {password ?
                    <PasswordStrengthMeter
                        minPasswordEntropy={passwordMinEntropy()}
                        currentPasswordEntropy={currentPasswordEntropy}
                        passwordExist={password !== ''}
                        passwordErrorFirstSolved={passwordErrorFirstSolved}
                        passwordErrorSecondSolved={passwordErrorSecondSolved}
                        passwordErrorThirdSolved={passwordErrorThirdSolved}
                        passwordErrorForthSolved={passwordErrorForthSolved}
                        passwordPopUp={true}
                        translate={translate}
                    /> : null}
            </div>
        );
    }; 

    const handleSubmitForm = React.useCallback(() => {
        onSignUp();
    }, [onSignUp]);

    const isValidForm = React.useCallback(() => {
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        return email && isEmailValid && password && isPasswordValid && confirmPassword && isConfirmPasswordValid;
    }, [confirmPassword, email, password]);

    const handleClick = React.useCallback(
        (e?: React.FormEvent<HTMLInputElement>) => {
            if (e) {
                e.preventDefault();
            }

            if (!isValidForm()) {
                validateForm();
            } else {
                handleSubmitForm();
            }
        },
        [handleSubmitForm, isValidForm, validateForm]
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

    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordShownSecond, setPasswordShownSecond] = useState(false);

    const togglePasswordVisiblity = () => {
      setPasswordShown(passwordShown ? false : true);
    };
    const togglePasswordVisiblitySecond = () => { 
        setPasswordShownSecond(passwordShownSecond ? false : true);
    };

    const renderSignin = React.useMemo(
        () => ( 
            <div className="simple_link" onClick={() => history.push('/signin')}>
                {formatMessage({ id: 'page.header.signIn.backLogin' })}
            </div> 
        ),
        [formatMessage, history]
    );

    const renderUsernameError = (nick: string) => {
        return nick.length < 3 ? translate(ERROR_SHORT_USERNAME) : translate(ERROR_LONG_USERNAME);
    };

    return (
        <form className="login-form">
            <div className="login-form__content" onKeyPress={handleEnterPress}>
            <h1>{formatMessage({ id: 'page.body.land.button.register' })}</h1>
                {image ? (
                    <div className="login-form__content__image">
                        <img src={image} alt="logo" />
                    </div>
                ) : null}
                    {isUsernameEnabled() ? (
                        <div
                            className={cr('login-form__content__group', {
                                'login-form__content__group--focused': usernameFocused,
                                'login-form__content__group--errored': username.length &&
                                !usernameFocused && !username.match(USERNAME_REGEX),
                            })}>
                            <IconInput
                                type="text"
                                placeholder={usernameLabel || 'Username'}
                                handleChangeInput={handleChangeUsername}
                                inputValue={username}
                                handleFocusInput={handleFocusUsername}
                                classNameInput="cr-sign-up-form__input"
                                autoFocus={!isMobileDevice}
                            />
                            {!username.match(USERNAME_REGEX) && !usernameFocused && username.length ? (
                                <div className="login-form__error">
                                    {renderUsernameError(username)}
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                    <div
                        className={cr('login-form__content__group', {
                            'login-form__content__group--focused': emailFocused,
                        })}>
                        <IconInput
                            type="email"
                            placeholder={emailLabel || 'Email'}
                            handleChangeInput={handleChangeEmail}
                            inputValue={email}
                            handleFocusInput={handleFocusEmail}
                            classNameInput="cr-sign-up-form__input"
                            autoFocus={!isUsernameEnabled() && !isMobileDevice}
                        />
                        <svg className="iconfrom" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                            <path d="M18,30.5l6.3,5.1l7.3-5.6l10.6,13.6H7.7C7.7,43.7,18,30.5,18,30.5z M6.3,21.1l9.5,7.7L6.3,40.9
                                C6.3,40.9,6.3,21.1,6.3,21.1z M25,6.3L43.1,18L24.4,32.2L6.8,18C6.8,18,25,6.3,25,6.3z M43.7,40.9l-9.8-12.6l9.8-7.4V40.9z M25,3.7
                                L3.7,17v29.3h42.7V17C46.3,17,25,3.7,25,3.7z"/>
                        </svg> 
                    </div>
                    {emailError && <div className="login-form__error">{emailError}</div>}
                    {renderPasswordInput()}
                    <div className={cr('login-form__content__group', {
                        'login-form__content__group--focused': confirmPasswordFocused,
                        })}>
                        <IconInput
                            type={passwordShownSecond ? "text" : "password"}
                            placeholder={confirmPasswordLabel || 'Confirm Password'}
                            handleChangeInput={handleChangeConfirmPassword}
                            inputValue={confirmPassword}
                            handleFocusInput={handleFocusConfirmPassword}
                            classNameInput="login-form__input"
                            autoFocus={false}
                            maxLength={30}
                        />
                        <IconButton 
                            onClick={togglePasswordVisiblitySecond}
                            className={passwordShownSecond ? "passvisible" : "passnovisible"}
                            >{passwordShownSecond ? <Visible /> : <NoVisible />}
                        </IconButton> 
                        <svg className="iconfrom" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                            <path d="M25,27.7c-0.7,0-1.3,0.6-1.3,1.3v8c0,0.7,0.6,1.3,1.3,1.3c0.7,0,1.3-0.6,1.3-1.3v-8
                                C26.3,28.3,25.7,27.7,25,27.7z M39.7,41c0,1.5-1.2,2.7-2.7,2.7l-24,0c-1.5,0-2.7-1.2-2.7-2.7V25c0-1.5,1.2-2.7,2.7-2.7l24,0
                                c1.5,0,2.7,1.2,2.7,2.7V41z M15.7,15.7c0-5.2,4.2-9.3,9.3-9.3s9.3,4.2,9.3,9.3v4H15.7V15.7z M37,19.7v-4c0-6.6-5.4-12-12-12
                                c-6.6,0-12,5.4-12,12v4c-2.9,0-5.3,2.4-5.3,5.3l0,16v5.3H13h24h5.3V41V25C42.3,22.1,39.9,19.7,37,19.7z"/>
                        </svg>
                    </div>
                    {confirmationError && <div className={'login-form__error'}>{confirmationError}</div>}
                    <Accordion>
                        <AccordionSummary 
                            aria-controls="panel1-content"
                            id="panel1-header"
                            expandIcon={<DoubleArrowDownIcon />}
                        > 
                        {formatMessage({ id: 'page.header.signUp.refferal' })}
                        </AccordionSummary> 
                        <div className={cr('login-form__content__group __refferal', {
                                'login-form__content__group--focused': referralUIDFocused,
                            })}>
                            <IconInput
                                type="text"
                                placeholder={referralUIDLabel || 'UID Referral'}
                                handleChangeInput={handleChangeReferralUID}
                                inputValue={referralUID}
                                handleFocusInput={handleFocusReferralUID}
                                classNameInput="login-form__input"
                                autoFocus={false}
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
                    </Accordion> 
                    <div className="login-form__agrees"> 
                        <Checkbox 
                            checked={hasConfirmed} 
                            onClick={clickCheckBox} 
                            required 
                            sx={{ '& .MuiSvgIcon-root': { 
                                fontSize: 22,
                                color: 'var(--accent)',
                                } 
                            }}
                        />
                        <p>
                            {formatMessage({ id: 'page.header.signup.terms' })}
                            <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">{formatMessage({ id: 'page.body.landing.footer.terms' })}</a>
                            {formatMessage({ id: 'page.header.signup.terms.and' })}
                            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">{formatMessage({ id: 'page.body.landing.footer.privacy' })}</a>
                        </p>
                    </div>
                    {renderCaptcha}
                    <div className="login-form__button">
                        <Button
                            className="big-button"
                            disabled={disableButton()}
                            onClick={(e) => handleClick(e as any)}
                        >
                            {isLoading ? <RotateSpinner size={29} color="#000"/> : labelSignUp ? labelSignUp : formatMessage({ id: 'page.body.land.button.register' })}
                        </Button>
                    </div>
                    <div className="login-form__footer">
                        {renderSignin}
                    </div>
            </div>
        </form>
    );
};

export const SignUpForm = React.memo(SignUpFormComponent);
