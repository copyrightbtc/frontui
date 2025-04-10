import { History } from 'history';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { Captcha, CountdownTimer } from '../../components';
import { EMAIL_REGEX, setDocumentTitle } from '../../helpers';
import {
    ConfigsAuth,
    emailVerificationFetch,
    GeetestCaptchaResponse,
    resetCaptchaState,
    RootState,
    selectCaptchaResponse,
    selectAuthConfigs,
    selectCurrentLanguage,
    selectGeetestCaptchaSuccess,
    selectMobileDeviceState,
    selectRecaptchaSuccess,
    selectSendEmailVerificationError,
    selectSendEmailVerificationLoading,
    selectSendEmailVerificationSuccess,
    selectUserInfo,
    User,
} from '../../modules';
import { CommonError } from '../../modules/types';
import { HeaderLanding, Footer } from '../../containers';

interface OwnProps {
    history: History;
    location: {
        state: {
            email: string;
        };
    };
    success: boolean;
    error?: CommonError;
}

interface DispatchProps {
    emailVerificationFetch: typeof emailVerificationFetch;
    resetCaptchaState: typeof resetCaptchaState;
}
interface State { 
    isButtonDisabled: boolean;
}
interface ReduxProps {
    emailVerificationLoading: boolean;
    isMobileDevice: boolean;
    configsAuth: ConfigsAuth;
    captcha_response?: string | GeetestCaptchaResponse;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    user: User;
}

type Props = DispatchProps & ReduxProps & OwnProps & IntlProps;

class EmailVerificationComponent extends React.Component<Props, State> {
    public componentDidMount() {
        setDocumentTitle(this.props.intl.formatMessage({id: 'page.body.header.up.titles.emailverification'}));

        if (!this.props.location.state) {
            this.props.history.push('/signin');
        }
    }

    constructor(props: Props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = { 
            isButtonDisabled: false, 
        };
 
    }
    public translate = (id: string) => this.props.intl.formatMessage({ id });

    public renderCaptcha = () => {
        const { error, success } = this.props;

        return (
            <Captcha
                error={error}
                success={success}
            />
        );
    };

    handleCountdownComplete = () => {
        this.setState({
            isButtonDisabled: false,
        });
    };

    public render() {
        const { emailVerificationLoading, isMobileDevice } = this.props; 

        return (
            <div className="login_form-screen">
                {!isMobileDevice && <HeaderLanding />} 
                <div className="login_form-screen__container">
                    <div className="login-form">
                        <div className="login-form__content">
                            <h1>{this.props.intl.formatMessage({ id: 'page.header.signUp.modal.header' })}</h1>
                            <div className="login_form-body">
                                <CountdownTimer
                                    intl={this.props.intl}
                                    renderCaptcha={this.renderCaptcha()}
                                    onCountdownComplete={this.handleCountdownComplete}
                                    onButtonClick={(e: Event) => this.handleClick(e)}
                                    isButtonDisabled={this.state.isButtonDisabled || this.disableButton()}
                                    emailVerificationLoading={emailVerificationLoading}
                                />
                                <div className="login-form__content__text">
                                    <svg className="iconfrom" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                                        <path d="M18,30.5l6.3,5.1l7.3-5.6l10.6,13.6H7.7C7.7,43.7,18,30.5,18,30.5z M6.3,21.1l9.5,7.7L6.3,40.9
                                            C6.3,40.9,6.3,21.1,6.3,21.1z M25,6.3L43.1,18L24.4,32.2L6.8,18C6.8,18,25,6.3,25,6.3z M43.7,40.9l-9.8-12.6l9.8-7.4V40.9z M25,3.7
                                            L3.7,17v29.3h42.7V17C46.3,17,25,3.7,25,3.7z"/>
                                    </svg>
                                    <h3>{this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body3' })}</h3>
                                    <span>{this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body4' })}</span>
                                    <span>{this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body5' })}{this.props.location.state.email}</span>
                                    <span>{this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body6' })}</span>
                                    <span>{this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body7' })}</span>
                                    <span>{this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body8' })}</span>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
                {!isMobileDevice && <Footer />} 
            </div>
        );
    }

    private handleClick = (e) => {
        const { configsAuth, captcha_response } = this.props;

        switch (configsAuth.captcha_type) {
            case 'recaptcha':
            case 'geetest':
                this.props.emailVerificationFetch({
                    email: this.props.location.state.email,
                    captcha_response,
                });
                break;
            default:
                this.props.emailVerificationFetch({
                    email: this.props.location.state.email,
                });
                break;
        }

        this.props.resetCaptchaState();
        e.preventDefault();
        this.setState({
            isButtonDisabled: true, 
        });

        this.props.emailVerificationFetch({
          email: this.props.location.state.email,
        });
  
        setTimeout(() => this.setState({ isButtonDisabled: false }), 5000);
    };

    private disableButton = (): boolean => {
        const {
            configsAuth,
            location,
            geetestCaptchaSuccess,
            reCaptchaSuccess,
        } = this.props;

        if (location.state && location.state.email && !location.state.email.match(EMAIL_REGEX)) {
            return true;
        }

        if (configsAuth.captcha_type === 'recaptcha' && !reCaptchaSuccess) {
            return true;
        }

        if (configsAuth.captcha_type === 'geetest' && !geetestCaptchaSuccess) {
            return true;
        }

        return false;
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    emailVerificationLoading: selectSendEmailVerificationLoading(state),
    i18n: selectCurrentLanguage(state),
    isMobileDevice: selectMobileDeviceState(state),
    configsAuth: selectAuthConfigs(state),
    error: selectSendEmailVerificationError(state),
    success: selectSendEmailVerificationSuccess(state),
    captcha_response: selectCaptchaResponse(state),
    reCaptchaSuccess: selectRecaptchaSuccess(state),
    geetestCaptchaSuccess: selectGeetestCaptchaSuccess(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps = {
    emailVerificationFetch,
    resetCaptchaState,
};

export const EmailVerificationScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(EmailVerificationComponent) as React.ComponentClass;
