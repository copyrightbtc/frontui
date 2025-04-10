import { History } from 'history';
import * as React from 'react';
import { Button } from '@mui/material';
import { CSSTransition } from "react-transition-group";
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ProfileTwoFactorAuth } from '../';
import { IntlProps } from '../../';  
import { ChangePassword, TwoFactorCustom } from '../../components';
import { is2faValid, truncateEmail } from 'src/helpers';
import {
    entropyPasswordFetch, 
    RootState,
    selectCurrentPasswordEntropy, 
    selectMobileDeviceState,
    selectUserInfo,
    User,
} from '../../modules';
import {
    changePasswordFetch,
    selectChangePasswordSuccess,
    toggle2faFetch,
} from '../../modules/user/profile';


interface ReduxProps { 
    user: User;
    passwordChangeSuccess?: boolean;
    currentPasswordEntropy: number;
    isMobile: boolean;
}

interface RouterProps {
    history: History;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface DispatchProps {
    changePassword: typeof changePasswordFetch;
    clearPasswordChangeError: () => void;
    toggle2fa: typeof toggle2faFetch;
    fetchCurrentPasswordEntropy: typeof entropyPasswordFetch; 
}

interface ProfileProps {
    showModal: boolean;
}

interface State {
    showChangeModal: boolean;
    showModal: boolean;
    code2FA: string; 
}

type Props = ReduxProps & DispatchProps & RouterProps & ProfileProps & IntlProps & OnChangeEvent;

const TwoFaIcon = require('../../assets/images/TwoFaIcon.svg').default;
const TwoFaIconEnabled = require('../../assets/images/TwoFaIconEnabled.svg').default;
const PasswordIcon = require('../../assets/images/PasswordIcon.svg').default;

class ProfileSecurityComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showChangeModal: false,
            showModal: false,
            code2FA: '', 
        };
    }
 
    public componentWillReceiveProps(next: Props) {
        if (next.passwordChangeSuccess) {
            this.setState({ showChangeModal: false });
        }
    }

    public render() {
        const { currentPasswordEntropy } = this.props;
        const { code2FA } = this.state; 

        return (
            <div className="profile-section">
                <div className="profile-section__content">
                    <div className="profile-section__content__header">
                        <h2>{this.props.intl.formatMessage({ id: 'page.body.profile.header.account.security'})}</h2>
                    </div>
                    <div className="profile-section__authsecurity">
                        <div className="profile-section__authsecurity__row">
                            <img src={PasswordIcon} alt="PasswordIcon" draggable="false" />
                            <div className="profile-section__authsecurity__row__password"> 
                                <div className="profile-section__authsecurity__row__password__info"> 
                                    <h5>{this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password'})}</h5>
                                    <p>
                                        ************
                                    </p> 
                                </div> 
                                <div className="profile-section__authsecurity__row__password__button"> 
                                    <Button
                                        className="small-button"
                                        onClick={this.toggleChangeModal}
                                    >
                                        {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change'})}
                                    </Button>
                                </div>
                            </div> 
                        </div>
    
                        <CSSTransition
                            in={this.state.showChangeModal}
                            timeout={{
                                enter: 100,
                                exit: 400
                              }}
                            unmountOnExit
                        >
                            <div className="modal-window">
                                <div className="modal-window__container fadet">
                                    <ChangePassword
                                        handleChangePassword={this.props.changePassword}
                                        title={this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.change' })}
                                        closeModal={this.toggleChangeModal} 
                                        currentPasswordEntropy={currentPasswordEntropy}
                                        fetchCurrentPasswordEntropy={this.props.fetchCurrentPasswordEntropy}
                                    />
                                </div>
                            </div> 
                        </CSSTransition>
                        
                        <div className="profile-section__authsecurity__row">
                            {!this.props.user.otp ? <img src={TwoFaIcon} alt="2fa" draggable="false" /> : <img src={TwoFaIconEnabled} alt="2fa" draggable="false" /> }
                            <ProfileTwoFactorAuth 
                                is2faEnabled={this.props.user.otp} 
                                navigateTo2fa={this.handleNavigateTo2fa}
                            />
                        </div>
                        <CSSTransition
                            in={this.state.showModal}
                            timeout={{
                                enter: 100,
                                exit: 400
                              }}
                            unmountOnExit
                        >
                            <div className="modal-window"> 
                                <div className="modal-window__container fadet">
                                    <div className="modal-window__container__content">
                                        <div className="modal-window__container__twofa">
                                            <TwoFactorCustom
                                                handleClose2fa={this.closeModal}
                                                code={this.state.code2FA}
                                                handleOtpCodeChange={this.handleChange2FACode}
                                                title={this.props.intl.formatMessage({ id: 'page.body.profile.content.twofascreen.modalHeader'})}
                                            />
                                            <div className="modal-window__container__content__info"> 
                                                {this.props.intl.formatMessage({ id: 'page.body.profile.content.twofascreen.userinfo'})}{truncateEmail(this.props.user.email)}
                                            </div>
                                            <div className="modal-window__container__content__danger"> 
                                                {this.props.intl.formatMessage({ id: 'page.body.profile.content.twofascreen.userinfo.note'})}
                                            </div>
                                            <div className="modal-window__container__footer"> 
                                                <Button
                                                    disabled={!is2faValid(code2FA)}
                                                    className="medium-button"
                                                    onClick={this.handleDisable2FA}
                                                >
                                                    {this.props.intl.formatMessage({id: 'page.body.profile.content.twofascreen.disable'})}
                                                </Button>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </CSSTransition> 
                    </div>
                </div>
            </div>
        );
    }
 

    private handleChange2FACode = (value: string) => {
        this.setState({
            code2FA: value,
        });
    };

    private handleDisable2FA = () => {
        this.props.toggle2fa({
            code: this.state.code2FA,
            enable: false,
        });
        this.closeModal();
        this.handleChange2FACode('');
    };

    private closeModal = () => {
        this.setState({
            showModal: false,
        });
      };

    private toggleChangeModal = () => {
        this.setState({
            showChangeModal: !this.state.showChangeModal,
        });
    };

    private handleNavigateTo2fa = (enable2fa: boolean) => {
        if (enable2fa) {
            this.props.history.push('/security/twofa-authenticator', { enable2fa: true });
        } else {
            this.setState({
                showModal: !this.state.showModal,
            });
        }
    };
 
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    passwordChangeSuccess: selectChangePasswordSuccess(state),
    currentPasswordEntropy: selectCurrentPasswordEntropy(state), 
    isMobile: selectMobileDeviceState(state),
});

const mapDispatchToProps = dispatch => ({
    changePassword: ({ old_password, new_password, confirm_password }) =>
        dispatch(changePasswordFetch({ old_password, new_password, confirm_password })),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    fetchCurrentPasswordEntropy: payload => dispatch(entropyPasswordFetch(payload)), 
});

const ProfileSecurityConnected = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileSecurityComponent));
// tslint:disable-next-line:no-any
const ProfileSecurity = withRouter(ProfileSecurityConnected as any);

export {
    ProfileSecurity,
};
