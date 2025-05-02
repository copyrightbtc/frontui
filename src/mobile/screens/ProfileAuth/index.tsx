import { History } from 'history';
import * as React from 'react';
import { Button, IconButton } from '@mui/material';
import { ArrowBackIcon } from 'src/assets/images/ArrowBackIcon';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { CopyIcon } from 'src/assets/images/CopyIcon';
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip } from 'src/components';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { TwoFactorSimple } from 'src/components/TwoFactorCustom/TwoFactorSimple';
import { copy, setDocumentTitle } from 'src/helpers';
import { alertPush, RootState, selectMobileDeviceState } from 'src/modules'; 
import { ModalMobile } from '../../components/ModalMobile';
import {
    generate2faQRFetch,
    selectTwoFactorAuthBarcode,
    selectTwoFactorAuthQR,
    selectTwoFactorAuthSuccess,
    toggle2faFetch,
} from 'src/modules/user/profile';

interface RouterProps {
    history: History;
}

interface ReduxProps {
    barcode: string;
    qrUrl: string;
    success?: boolean;
    isMobileDevice: boolean;
}

interface DispatchProps {
    toggle2fa: typeof toggle2faFetch;
    generateQR: typeof generate2faQRFetch;
    fetchSuccess: typeof alertPush;
}

type Props = RouterProps & ReduxProps & DispatchProps & IntlProps;

interface State {
    otpCode: string;
    showModal: boolean;
}
const googletwofa = require('src/assets/images/googletwofa.svg').default;
const microsofttwofa = require('src/assets/images/microsofttwofa.svg').default;

class ToggleTwoFactoMobilerAuthComponent extends React.Component<Props, State> {
    public state = {
        otpCode: '',
        showModal: false,
    };

    public componentDidMount() { 
        setDocumentTitle(this.props.intl.formatMessage({ id: 'page.body.header.up.titles.twofa'}));
        const enable2fa = this.get2faAction();
        if (enable2fa) {
            this.props.generateQR();
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (!this.props.success && next.success) {
            this.handleNavigateToProfile();
        }
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public copySecrete = () => {
        copy('mfa-id');
        this.props.fetchSuccess({message: ['page.body.header.up.secretecode.twofa.copied'], type: 'success'});
    };

    public render() {
        const enable2fa = this.get2faAction();

        return (
            <React.Fragment>
                {this.renderToggle2fa(enable2fa)} 
            </React.Fragment>
        );
    };

    private renderToggle2fa = (enable2fa: boolean) => {
 
        const {
            barcode,
            qrUrl,
        } = this.props;
        const { otpCode } = this.state;

        const secretRegex = /secret=(\w+)/;
        const secretMatch = qrUrl.match(secretRegex);
        const secret = secretMatch ? secretMatch[1] : null;
        const submitHandler = enable2fa ? this.handleEnable2fa : this.handleDisable2fa;
 
        return ( 
            <div className="mobile twofa-screen">
                <div className="twofa-screen__container"> 
                    <div className="twofa-screen__header"> 
                        <div className="twofa-screen__header__close">
                            <IconButton 
                                onClick={this.goBack}
                                sx={{
                                    width: '40px',
                                    height: '40px',
                                    color: 'var(--color-light-grey)',
                                    '&:hover': {
                                        color: 'var(--color-accent)'
                                    }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <p>{this.translate('page.body.profile.content.back')}</p>
                        </div>
                        <h1>{this.translate('page.body.profile.content.twofascreen.header')}</h1>
                    </div>
                    <div className="twofa-screen__body">
                        <p>{this.translate('page.body.profile.content.twofascreen.message.1')}</p>
                        <p>{this.translate('page.body.profile.content.twofascreen.message.2')}</p>
                        <div className="twofa-screen__body__apps">
                            <div className="twofa-screen__body__apps__row">
                                <div className="icon">
                                    <img src={googletwofa} alt="google 2fa"/>
                                </div>
                                <span>Google Authenticator</span>
                            </div>
                            <div className="twofa-screen__body__apps__row">
                                <div className="icon">
                                    <img src={microsofttwofa} alt="microsoft 2fa"/>
                                </div>
                                <span>Microsoft Authenticator</span>
                            </div>
                        </div>
                    </div>
                    <div className="twofa-screen__footer">
                        <Button
                            className="medium-button themes"
                            onClick={this.showModal}
                        >
                            {this.translate('page.body.profile.content.twofascreen.header.start')}
                        </Button>
                    </div>
                </div>
                <ModalMobile
                    isOpen={this.state.showModal}
                    onClose={!this.state.showModal}
                    classNames='maxheight'
                >
                    <div className="mobile-modal__header">
                        <div className="mobile-modal__header-title">
                            {this.translate('page.body.profile.content.twofascreen.header.connect')}
                        </div>
                        <div className="mobile-modal__header-close" onClick={this.closeModal}>
                            <CloseIcon />
                        </div>
                    </div>
                    <div className='mobile-modal-2fa'>
                        <div className="mobile-modal-2fa__content">
                            <div className="twofa-modal__text">
                                <p>{this.translate('page.body.profile.content.twofascreen.message.3')} {this.translate('page.body.profile.content.twofascreen.message.4')}</p>
                                {enable2fa && this.renderTwoFactorAuthQR(barcode)}
                                <p>{this.translate('page.body.profile.content.twofascreen.message.5')}
                                    <OverlayTrigger 
                                        placement="auto"
                                        delay={{ show: 250, hide: 300 }} 
                                        overlay={<Tooltip className="themes" title="page.body.profile.content.twofascreen.message.warning" />}>
                                            <div className="tip_icon_container">
                                                <InfoIcon />
                                            </div>
                                    </OverlayTrigger></p>
                                {enable2fa && secret && this.renderSecret(secret)}
                                <p style={{textAlign: 'center'}}>{this.translate('page.body.profile.content.twofascreen.message.7')}</p>
                            </div>
                            <TwoFactorSimple
                                code={otpCode}
                                handleOtpCodeChange={this.handleChange2FACode}
                            /> 
                        </div> 
                        <div className="mobile-modal__button">
                            <Button
                                disabled={this.handleCheckButtonDisabled(otpCode)}
                                className="medium-button themes"
                                onClick={submitHandler}
                            >
                                {this.translate('page.body.profile.content.twofascreen.enable')}
                            </Button>
                        </div>
                    </div>
                </ModalMobile>
            </div> 
        );
    }; 

    private showModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
      };

    private closeModal = () => {
        this.setState({
            showModal: false,
        });
      };


    private handleCheckButtonDisabled = (otpCode: string) => { 
        return !Boolean(otpCode.match('^[0-9]{6}$'));
    };

    private renderTwoFactorAuthQR = (barcode: string) => {
        const src = `data:image/png;base64,${barcode}`;

        return barcode.length > 0 && <div className="twofa-modal__qr"><img alt="" src={src} /></div>;
    };
 
    private renderSecret = (secret: string) => {
        return (
            <React.Fragment> 
                <div className="twofa-modal__secret">
                    <input value={secret} className="twofa-modal__secret__code" id="mfa-id" spellCheck="false"/>
                    <IconButton
                        onClick={this.copySecrete}
                        className="copy_button"
                    >
                        <CopyIcon className="copy-iconprop"/> 
                    </IconButton>
                </div>
            </React.Fragment>
        );
    };

    private handleChange2FACode = (value: string) => {
        this.setState({
            otpCode: value,
        });
    };

    private handleEnable2fa = () => {
        this.props.toggle2fa({
            code: this.state.otpCode,
            enable: true,
        });
    };

    private handleDisable2fa = () => {
        this.props.toggle2fa({
            code: this.state.otpCode,
            enable: false,
        });
    };

    private handleNavigateToProfile = () => {
        this.props.history.push('/profile');
    };

    private get2faAction = () => {
        const routingState = this.props.history.location.state as any;

        return routingState ? routingState.enable2fa : false;
    };

    private goBack = () => {
        window.history.back();
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, Props, RootState> = state => ({
    qrUrl: selectTwoFactorAuthQR(state),
    barcode: selectTwoFactorAuthBarcode(state),
    success: selectTwoFactorAuthSuccess(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    generateQR: () => dispatch(generate2faQRFetch()),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    fetchSuccess: payload => dispatch(alertPush(payload)),
});

export const ProfileAuthMobileScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ToggleTwoFactoMobilerAuthComponent) as React.ComponentClass;
