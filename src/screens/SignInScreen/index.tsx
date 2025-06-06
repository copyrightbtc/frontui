import cx from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { captchaLogin } from '../../api';
import { Captcha, SignInComponent, TwoFactorSubmit } from '../../components';
import { EMAIL_REGEX, ERROR_EMPTY_PASSWORD, ERROR_INVALID_EMAIL, setDocumentTitle } from '../../helpers';
import { useReduxSelector } from '../../hooks';
import { HeaderLanding, Footer } from '../../containers';
import {
    selectAuthConfigs,
    selectMobileDeviceState,
    selectSignInRequire2FA,
    selectUserFetching,
    selectUserLoggedIn,
    signIn,
    signInError,
    signInRequire2FA,
    signUpRequireVerification,
    selectSignInError,
    selectRecaptchaSuccess,
    selectGeetestCaptchaSuccess,
    selectCaptchaResponse,
    resetCaptchaState,
} from '../../modules';

export const SignInScreen: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { formatMessage } = useIntl();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [codeFocused, setCodeFocused] = useState(true);
    const [otpCode, setOtpCode] = useState('');
    const [errorMessage, error2fa] = useState('');

    const isLoggedIn = useReduxSelector(selectUserLoggedIn);
    const loading = useReduxSelector(selectUserFetching);
    const require2FA = useReduxSelector(selectSignInRequire2FA);
    const requireEmailVerification = useReduxSelector((x) => x.user.auth.requireVerification);
    const errorSignIn = useReduxSelector(selectSignInError);
    const reCaptchaSuccess = useReduxSelector(selectRecaptchaSuccess);
    const geetestCaptchaSuccess = useReduxSelector(selectGeetestCaptchaSuccess);
    const captcha_response = useReduxSelector(selectCaptchaResponse);
    const isMobileDevice = useReduxSelector(selectMobileDeviceState);

    const configsAuth = useReduxSelector(selectAuthConfigs);

    useEffect(() => {
        setDocumentTitle(formatMessage({id: 'page.header.signIn'}))
        dispatch(signInError({ code: 0, message: [''] }));
        dispatch(signUpRequireVerification({ requireVerification: false }));

        return () => {
            dispatch(resetCaptchaState());
        }
    }, []);

    useEffect(() => {
        if (requireEmailVerification) {
            history.push('/email-verification', { email: email });
        }
    }, [requireEmailVerification, history]);

    useEffect(() => {
        if (isLoggedIn) {
            history.push('/profile');
        }
    }, [isLoggedIn, history]);

    useEffect(() => {
        if (configsAuth.captcha_type !== 'none' && captchaLogin() && errorSignIn && !require2FA) {
            dispatch(resetCaptchaState());
        }
    }, [errorSignIn, configsAuth.captcha_type, captchaLogin()]);

    const refreshError = useCallback(() => {
        setEmailError('');
        setPasswordError('');
    }, []);

    const handleChangeOtpCode = useCallback((value: string) => {
        setOtpCode(value);
    }, []);

    const handleSignIn = useCallback(() => {
        dispatch(
            signIn({
                email,
                password,
                ...(configsAuth.captcha_type !== 'none' && captchaLogin() && { captcha_response }),
            })
        );
    }, [dispatch, email, password, captcha_response, configsAuth.captcha_type]);

    const handle2FASignIn = useCallback(() => {
        if (otpCode) {
            dispatch(
                signIn({
                    email,
                    password,
                    otp_code: otpCode,
                    ...(configsAuth.captcha_type !== 'none' && captchaLogin() && { captcha_response }),
                })
            );
        }
    }, [dispatch, otpCode, email, password, configsAuth.captcha_type, captchaLogin()]);

    const handleSignUp = useCallback(() => {
        history.push('/signup');
    }, [history]);

    const forgotPassword = useCallback(() => {
        history.push('/forgot_password');
    }, [history]);

    const handleFieldFocus = useCallback(
        (field: string) => {
            switch (field) {
                case 'email':
                    setEmailFocused(!emailFocused);
                    break;
                case 'password':
                    setPasswordFocused(!passwordFocused);
                    break;
                case 'otpCode':
                    setCodeFocused(!codeFocused);
                    break;
                default:
                    break; 
            }
        },
        [emailFocused, passwordFocused, codeFocused]
    );

    const validateForm = useCallback(() => {
        const isEmailValid = email.match(EMAIL_REGEX);

        if (!isEmailValid) {
            setEmailError(formatMessage({ id: ERROR_INVALID_EMAIL }));
            setPasswordError('');

            return;
        }
        if (!password) {
            setEmailError('');
            setPasswordError(formatMessage({ id: ERROR_EMPTY_PASSWORD }));

            return;
        }
    }, [email, password, formatMessage]);

    const handleChangeEmailValue = useCallback((value: string) => {
        setEmail(value);
    }, []);

    const handleChangePasswordValue = useCallback((value: string) => {
        setPassword(value);
    }, []);

    const handleClose = useCallback(() => {
        setOtpCode('');
        error2fa('');
        dispatch(signInRequire2FA({ require2fa: false }));
    }, [dispatch]);

    const renderCaptcha = () => <Captcha error={errorSignIn || emailError} />;

    return (
        <div className="login_form-screen">
            {!isMobileDevice && <HeaderLanding/>}
            <div className={cx('login_form-screen__container', { loading })}> 
                {require2FA ? (
                    <TwoFactorSubmit
                        isLoading={loading} 
                        onSubmit={handle2FASignIn}
                        title={formatMessage({ id: 'page.password2fa' })}
                        message={formatMessage({ id: 'page.header.signin.email.2fa' })} 
                        code={otpCode}
                        errorMessage={errorMessage}
                        codeFocused={codeFocused}
                        handleOtpCodeChange={handleChangeOtpCode}
                        handleClose2fa={handleClose}
                    />
                ) : (
                    <SignInComponent
                        email={email}
                        emailError={emailError}
                        emailFocused={emailFocused}
                        emailPlaceholder={formatMessage({ id: 'page.header.signIn.email' })}
                        password={password}
                        passwordError={passwordError}
                        passwordFocused={passwordFocused}
                        passwordPlaceholder={formatMessage({ id: 'page.header.signIn.password' })}
                        labelSignIn={formatMessage({ id: 'page.header.signIn' })}
                        labelSignUp={formatMessage({ id: 'page.header.signUp' })}
                        emailLabel={formatMessage({ id: 'page.header.signIn.email' })}
                        passwordLabel={formatMessage({ id: 'page.header.signIn.password' })}
                        receiveConfirmationLabel={formatMessage({
                            id: 'page.header.signIn.receiveConfirmation',
                        })}
                        forgotPasswordLabel={formatMessage({ id: 'page.header.signIn.forgotPassword' })}
                        isLoading={loading}
                        onForgotPassword={forgotPassword}
                        onSignUp={handleSignUp}
                        onSignIn={handleSignIn}
                        handleChangeFocusField={handleFieldFocus}
                        isFormValid={validateForm}
                        refreshError={refreshError}
                        changeEmail={handleChangeEmailValue}
                        changePassword={handleChangePasswordValue}
                        renderCaptcha={renderCaptcha()}
                        reCaptchaSuccess={reCaptchaSuccess}
                        geetestCaptchaSuccess={geetestCaptchaSuccess}
                        captcha_response={captcha_response}
                    />
                )}
            </div>
            {!isMobileDevice && (<Footer/>)}
        </div>
    );
};
