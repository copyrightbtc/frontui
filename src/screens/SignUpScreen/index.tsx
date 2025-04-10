import cx from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { isUsernameEnabled } from '../../api';
import { Captcha, Modal, SignUpForm } from '../../components';
import { HeaderLanding, Footer } from '../../containers';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    ERROR_INVALID_PASSWORD,
    ERROR_PASSWORD_CONFIRMATION,
    PASSWORD_REGEX,
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
    passwordErrorForthSolution,
    setDocumentTitle,
} from '../../helpers';
import { IntlProps } from '../../index';
import {
    ConfigsAuth,
    entropyPasswordFetch, GeetestCaptchaResponse,
    LanguageState,
    resetCaptchaState,
    RootState,
    selectCaptchaResponse,
    selectAuthConfigs,
    selectCurrentLanguage,
    selectCurrentPasswordEntropy,
    selectGeetestCaptchaSuccess,
    selectRecaptchaSuccess,
    selectSignUpError,
    selectSignUpRequireVerification,
    signUp,
    selectMobileDeviceState,
} from '../../modules';

interface ReduxProps {
    configsAuth: ConfigsAuth;
    requireVerification?: boolean;
    loading?: boolean;
    currentPasswordEntropy: number;
    captcha_response?: string | GeetestCaptchaResponse;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    isMobileDevice: boolean;
}

interface DispatchProps {
    signUp: typeof signUp;
    fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
    resetCaptchaState: typeof resetCaptchaState;
}

interface RouterProps {
    location: {
        search: string;
    };
    history: History;
}

interface OwnProps {
    signUpError: boolean;
    i18n: LanguageState['lang'];
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps & OwnProps;
 
export const extractReferralUID = (props: RouterProps) => new URLSearchParams(props.location.search).get('referral_uid');

class SignUp extends React.Component<Props> {
    public readonly state = {
        showModal: false,
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        referralUID: '',
        hasConfirmed: false,
        emailError: '',
        passwordError: '',
        confirmationError: '',
        usernameFocused: false,
        emailFocused: false,
        passwordFocused: false,
        confirmPasswordFocused: false,
        referralUIDFocused: false,
        typingTimeout: 0,
        passwordErrorFirstSolved: false,
        passwordErrorSecondSolved: false,
        passwordErrorThirdSolved: false,
        passwordErrorForthSolved: false,
        passwordPopUp: false,
    };

    private myRef = React.createRef<HTMLInputElement>();
    private passwordWrapper = React.createRef<HTMLDivElement>();

    public componentDidMount() {
        setDocumentTitle(this.props.intl.formatMessage({id: 'page.header.signUp'})); 
        const localReferralUID = localStorage.getItem('referralUID');
        const referralUID = this.extractReferralUID(this.props.location.search);
        const referralCode = referralUID || localReferralUID || '';
        this.setState({
            referralUID: referralCode,
        });
        if (referralUID && referralUID !== localReferralUID) {
            localStorage.setItem('referralUID', referralCode);
        }

        document.addEventListener('click', this.handleOutsideClick, false);
    }

    public componentDidUpdate(prev: Props) {
        const { email } = this.state;

        if (!prev.requireVerification && this.props.requireVerification) {
            this.props.history.push('/email-verification', {email: email});
        }
    }

    public componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    public renderCaptcha = () => {
        const { signUpError } = this.props;
        const { confirmationError, emailError } = this.state;

        const error = signUpError || confirmationError || emailError;

        return <Captcha error={error} />;
    };

    public render() {
        const {
            configsAuth,
            loading,
            currentPasswordEntropy,
            captcha_response,
            reCaptchaSuccess,
            geetestCaptchaSuccess,
            isMobileDevice,
        } = this.props;
        const {
            username,
            email,
            password,
            confirmPassword,
            referralUID,
            hasConfirmed,
            emailError,
            passwordError,
            confirmationError,
            usernameFocused,
            emailFocused,
            passwordFocused,
            confirmPasswordFocused,
            referralUIDFocused,
            passwordErrorFirstSolved,
            passwordErrorSecondSolved,
            passwordErrorThirdSolved,
            passwordErrorForthSolved,
            passwordPopUp,
        } = this.state;

        const className = cx('login_form-screen__container', { loading });

        return (
            <div className="login_form-screen">
                {!isMobileDevice && <HeaderLanding />}
                <div className={className}>
                    <SignUpForm
                        labelSignIn={this.props.intl.formatMessage({ id: 'page.header.signIn'})}
                        labelSignUp={this.props.intl.formatMessage({ id: 'page.header.signUp'})}
                        emailLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.email'})}
                        passwordLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.password'})}
                        confirmPasswordLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.confirmPassword'})}
                        referralUIDLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.referalCode'})}
                        termsMessage={this.props.intl.formatMessage({ id: 'page.header.signUp.terms'})}
                        referralUID={referralUID}
                        handleChangeReferralUID={this.handleChangeReferralUID}
                        isLoading={loading}
                        onSignIn={this.handleSignIn}
                        onSignUp={this.handleSignUp}
                        username={username}
                        handleChangeUsername={this.handleChangeUsername}
                        email={email}
                        handleChangeEmail={this.handleChangeEmail}
                        password={password}
                        handleChangePassword={this.handleChangePassword}
                        confirmPassword={confirmPassword}
                        handleChangeConfirmPassword={this.handleChangeConfirmPassword}
                        hasConfirmed={hasConfirmed}
                        clickCheckBox={this.handleCheckboxClick}
                        validateForm={this.handleValidateForm}
                        emailError={emailError}
                        passwordError={passwordError}
                        confirmationError={confirmationError}
                        confirmPasswordFocused={confirmPasswordFocused}
                        referralUIDFocused={referralUIDFocused}
                        usernameFocused={usernameFocused}
                        emailFocused={emailFocused}
                        passwordFocused={passwordFocused}
                        handleFocusUsername={this.handleFocusUsername}
                        handleFocusEmail={this.handleFocusEmail}
                        handleFocusPassword={this.handleFocusPassword}
                        handleFocusConfirmPassword={this.handleFocusConfirmPassword}
                        handleFocusReferralUID={this.handleFocusReferralUID}
                        captchaType={configsAuth.captcha_type}
                        renderCaptcha={this.renderCaptcha()}
                        reCaptchaSuccess={reCaptchaSuccess}
                        geetestCaptchaSuccess={geetestCaptchaSuccess}
                        captcha_response={captcha_response}
                        currentPasswordEntropy={currentPasswordEntropy}
                        passwordErrorFirstSolved={passwordErrorFirstSolved}
                        passwordErrorSecondSolved={passwordErrorSecondSolved}
                        passwordErrorThirdSolved={passwordErrorThirdSolved}
                        passwordErrorForthSolved={passwordErrorForthSolved}
                        passwordPopUp={passwordPopUp}
                        myRef={this.myRef}
                        passwordWrapper={this.passwordWrapper}
                        translate={this.translate}
                    />
                    <Modal
                        show={this.state.showModal}
                        header={this.renderModalHeader()}
                        content={this.renderModalBody()}
                        footer={this.renderModalFooter()}
                    />
                </div>
                {!isMobileDevice && <Footer />}
            </div>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});

    private handleOutsideClick = event => {
        const wrapperElement = this.passwordWrapper.current;

        if (wrapperElement && !wrapperElement.contains(event.target)) {
            this.setState({
                passwordPopUp: false,
            });
        }
    };

    private handleCheckboxClick = event => {
        if (event) {
            event.preventDefault();

            this.setState({
                hasConfirmed: !this.state.hasConfirmed,
            });
            this.clearFields();
        }
    };

    private handleChangeUsername = (value: string) => {
        this.setState({
            username: value.replace(/[^A-Za-z0-9]+/g, '').toLowerCase(),
        });
    };

    private handleChangeEmail = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private handleChangePassword = (value: string) => {
        const { passwordErrorFirstSolved, passwordErrorSecondSolved, passwordErrorThirdSolved, passwordErrorForthSolved } = this.state;

        if (passwordErrorFirstSolution(value) && !passwordErrorFirstSolved) {
            this.setState({
                passwordErrorFirstSolved: true,
            });
        } else if (!passwordErrorFirstSolution(value) && passwordErrorFirstSolved) {
            this.setState({
                passwordErrorFirstSolved: false,
            });
        }

        if (passwordErrorSecondSolution(value) && !passwordErrorSecondSolved) {
            this.setState({
                passwordErrorSecondSolved: true,
            });
        } else if (!passwordErrorSecondSolution(value) && passwordErrorSecondSolved) {
            this.setState({
                passwordErrorSecondSolved: false,
            });
        }

        if (passwordErrorThirdSolution(value) && !passwordErrorThirdSolved) {
            this.setState({
                passwordErrorThirdSolved: true,
            });
        } else if (!passwordErrorThirdSolution(value) && passwordErrorThirdSolved) {
            this.setState({
                passwordErrorThirdSolved: false,
            });
        }
        if (passwordErrorForthSolution(value) && !passwordErrorForthSolved) {
            this.setState({
                passwordErrorForthSolved: true,
            });
        } else if (!passwordErrorForthSolution(value) && passwordErrorForthSolved) {
            this.setState({
                passwordErrorForthSolved: false,
            });
        }
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
         }

        this.setState({
            password: value,
            typingTimeout: setTimeout(() => {
                this.props.fetchCurrentPasswordEntropy({ password: value });
            }, 500),
        });
    };

    private handleChangeConfirmPassword = (value: string) => {
        this.setState({
            confirmPassword: value,
        });
    };

    private handleChangeReferralUID = (value: string) => {
        this.setState({
            referralUID: value,
        });
    }; 

    private handleFocusUsername = () => {
        this.setState({
            usernameFocused: !this.state.usernameFocused,
        });
    };

    private handleFocusEmail = () => {
        this.setState({
            emailFocused: !this.state.emailFocused,
        });
    };

    private handleFocusPassword = () => {
        this.setState({
            passwordFocused: !this.state.passwordFocused,
            passwordPopUp: !this.state.passwordPopUp,
        });
    };

    private handleFocusConfirmPassword = () => {
        this.setState({
            confirmPasswordFocused: !this.state.confirmPasswordFocused,
        });
    };

    private handleFocusReferralUID = () => {
        this.setState({
            referralUIDFocused: !this.state.referralUIDFocused,
        });
    }; 

    private handleSignIn = () => {
        this.props.history.push('/signin');
    };

    private handleSignUp = () => {
        const { configsAuth, i18n, captcha_response } = this.props;
        const {
            username,
            email,
            password,
            referralUID,
        } = this.state;
        let payload: any = {
            email,
            password,
            data: JSON.stringify({
                language: i18n,
            }),
        };

        if (isUsernameEnabled()) {
            payload = { ...payload, username };
        }

        if (referralUID) {
            payload = { ...payload, refid: referralUID };
        }

        switch (configsAuth.captcha_type) {
            case 'recaptcha':
            case 'geetest':
                payload = { ...payload, captcha_response };

                this.props.signUp(payload);
                break;
            default:
                this.props.signUp(payload);
                break;
        }

        this.props.signUp(payload);
        this.props.resetCaptchaState();
    };

    private renderModalHeader = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                {this.props.intl.formatMessage({id: 'page.header.signUp.modal.header'})}
            </div>
        );
    };

    private renderModalBody = () => {
        return (
            <div className="pg-exchange-modal-submit-body">
                <h2>
                    {this.props.intl.formatMessage({id: 'page.header.signUp.modal.body'})}
                </h2>
            </div>
        );
    };

    private renderModalFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    
                    onClick={this.closeModal}
                    size="lg"
                    variant="primary"
                >
                    {this.props.intl.formatMessage({id: 'page.header.signUp.modal.footer'})}
                </Button>
            </div>
        );
    };

    private closeModal = () => {
        this.setState({showModal: false});
        this.props.history.push('/signin');
    };
 
    private extractReferralUID = (url: string) => new URLSearchParams(url).get('referral_uid');

    private handleValidateForm = () => {
        const {email, password, confirmPassword} = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        if (!isEmailValid && !isPasswordValid) {
            this.setState({
                confirmationError: '',
                emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                passwordError: this.props.intl.formatMessage({ id: ERROR_INVALID_PASSWORD }),
                hasConfirmed: false,
            });

            return;
        }

        if (!isEmailValid) {
            this.setState({
                confirmationError: '',
                emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                passwordError: '',
                hasConfirmed: false,
            });

            return;
        }

        if (!isPasswordValid) {
            this.setState({
                confirmationError: '',
                emailError: '',
                passwordError: this.props.intl.formatMessage({ id: ERROR_INVALID_PASSWORD }),
                hasConfirmed: false,
            });

            return;
        }

        if (!isConfirmPasswordValid) {
            this.setState({
                confirmationError: this.props.intl.formatMessage({ id: ERROR_PASSWORD_CONFIRMATION }),
                emailError: '',
                passwordError: '',
                hasConfirmed: false,
            });

            return;
        }
    };

    private clearFields = () => {
        this.setState({
            confirmationError: '',
            emailError: '',
            passwordError: '',
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    configsAuth: selectAuthConfigs(state),
    i18n: selectCurrentLanguage(state),
    requireVerification: selectSignUpRequireVerification(state),
    signUpError: selectSignUpError(state),
    currentPasswordEntropy: selectCurrentPasswordEntropy(state),
    captcha_response: selectCaptchaResponse(state),
    reCaptchaSuccess: selectRecaptchaSuccess(state),
    geetestCaptchaSuccess: selectGeetestCaptchaSuccess(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        signUp: credentials => dispatch(signUp(credentials)),
        fetchCurrentPasswordEntropy: payload => dispatch(entropyPasswordFetch(payload)),
        resetCaptchaState: () => dispatch(resetCaptchaState()),
    });

export const SignUpScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(SignUp) as React.ComponentClass;
