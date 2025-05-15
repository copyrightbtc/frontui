import classnames from 'classnames';
import * as React from 'react';
import { FillSpinner } from 'react-spinners-kit';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Route, RouterProps, Switch } from 'react-router';
import { Redirect, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import {
    minutesUntilAutoLogout,
    sessionCheckInterval,
} from '../../api';
import { ExpiredSessionModal } from '../../components';
import { WalletsFetch } from '../../containers'; 
import { toggleColorTheme } from '../../helpers';
import {
    ChangeForgottenPasswordMobileScreen,
    ConfirmMobileScreen,
    EmailVerificationMobileScreen,
    ForgotPasswordMobileScreen,
    LandingScreenMobile,
    OrdersMobileScreen,
    ProfileAccountActivityMobileScreen,
    ProfileApiKeysMobileScreen,
    ProfileAuthMobileScreen,
    ProfileMobileScreen,
    ProfileVerificationMobileScreen,
    SelectedWalletMobileScreen,
    SignInMobileScreen,
    SignUpMobileScreen,
    TradingScreenMobile,
    WalletDeposit,
    WalletsMobileScreen,
    WalletWithdraw,
    PayeerpaymentMobile,
    VoletpaymentMobile,
    InvitesScreenMobile,
    AdvertiserMobileScreen,
    AdvertisementMobileScreen,
    MyAdvertisementMobileScreen,
    ProfileP2POrdersScreen,
    ProfileP2PTradeScreen,
    ProfileP2PPaymentsScreen,
    ProfileP2PTradeMessagesScreen,
    CreateAdvertisementMobileScreen,
    ProfileSetUsernameMobileScreen,
} from '../../mobile/screens';
 
import {
    logoutFetch,
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectMobileDeviceState,
    selectPlatformAccessStatus,
    selectUserFetching,
    selectUserInfo,
    selectUserLoggedIn,
    toggleChartRebuild,
    User,
    userFetch,
    walletsReset,
    //AbilitiesInterface,
    //selectAbilities,
} from '../../modules';
import {
    ChangeForgottenPasswordScreen,
    ConfirmScreen,
    //DocumentationScreen,
    EmailVerificationScreen,
    ForgotPasswordScreen,
    HistoryScreen,
    InternalTransfer,
    LandingScreen,
    MagicLink,
    MaintenanceScreen,
    OrdersTabScreen,
    ProfileScreen,
    ProfileTwoFactorAuthScreen,
    RestrictedScreen,
    SignInScreen,
    SignUpScreen,
    TradingScreen,
    VerificationScreen,
    WalletsScreen,
    //QuickExchange, 
    ErrorScreen,
    FeesPolicy,
    AmlPolicy,
    CookiePolicy,
    PrivacyPolicy,
    TermsOfUse,
    InvitesScreen,
    ProfileApiKeys,
    P2PPaymentsScreen,
    P2POrdersScreen,
    AdvertisementScreen,
    AdvertiserScreen,
    P2PTradeScreen,
    CreateAdvertisementScreen,
    MyAdvertisementsScreen,
} from '../../screens';
 
interface ReduxProps {
    colorTheme: string;
    currentMarket?: Market;
    user: User;
    isLoggedIn: boolean;
    isMobileDevice: boolean;
    userLoading?: boolean;
    platformAccessStatus: string;
    //abilities: AbilitiesInterface;
}

interface DispatchProps {
    logout: typeof logoutFetch;
    userFetch: typeof userFetch;
    walletsReset: typeof walletsReset;
}

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}

interface LayoutState {
    isShownExpSessionModal: boolean;
}

interface OwnProps {
    toggleChartRebuild: typeof toggleChartRebuild;
}

export type LayoutProps = ReduxProps & DispatchProps & LocationProps & IntlProps & OwnProps;

const renderLoader = () => (
    <div className="spinner-loader-center fixed">
        <FillSpinner size={19} color="var(--color-accent)"/>
    </div>
);

const STORE_KEY = 'lastAction';

//tslint:disable-next-line no-any
const PrivateRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }
    const renderCustomerComponent = props => <CustomComponent {...props} />;

    if (isLogged) {
        return <Route {...rest} render={renderCustomerComponent} />;
    }

    return (
        <Route {...rest}>
            <Redirect to={'/signin'} />
        </Route>
    );
};

//tslint:disable-next-line no-any
const PublicRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }

    if (isLogged) {
        //return <Route {...rest}>{window.history.back()}</Route>;
        return <Route {...rest}><Redirect to={'/profile'} /></Route>;
    }

    const renderCustomerComponent = props => <CustomComponent {...props} />;

    return <Route {...rest} render={renderCustomerComponent} />;
};

class LayoutComponent extends React.Component<LayoutProps, LayoutState> {
    public static eventsListen = [
        'click',
        'keydown',
        'scroll',
        'resize',
        'mousemove',
        'TabSelect',
        'TabHide',
    ];

    public timer;
    public walletsFetchInterval;

    constructor(props: LayoutProps) {
        super(props);
        this.initListener();

        this.state = {
            isShownExpSessionModal: false,
        };
    }

    public componentDidMount() {
        if (
            !(this.props.location.pathname.includes('/magic-link')
            || this.props.location.pathname.includes('/maintenance')
            || this.props.location.pathname.includes('/restriction'))
        ) {
            switch (this.props.platformAccessStatus) {
                case 'restricted':
                    this.props.history.replace('/restriction');
                    break;
                case 'maintenance':
                    this.props.history.replace('/maintenance');
                    break;
                default:
                    const token = localStorage.getItem('csrfToken');

                    if (token) {
                        this.props.userFetch();
                        this.initInterval();
                        this.check();
                    }
            }
        }
    }

    public componentWillReceiveProps(nextProps: LayoutProps) {
        if (
            !(nextProps.location.pathname.includes('/magic-link')
            || nextProps.location.pathname.includes('/restriction')
            || nextProps.location.pathname.includes('/maintenance'))
            || this.props.platformAccessStatus !== nextProps.platformAccessStatus
        ) {
            switch (nextProps.platformAccessStatus) {
                case 'restricted':
                    this.props.history.replace('/restriction');
                    break;
                case 'maintenance':
                    this.props.history.replace('/maintenance');
                    break;
                default:
                    break;
            }
        }

        if (!this.props.isLoggedIn && nextProps.isLoggedIn && !this.props.user.email) {
            this.initInterval();
            this.check();
        }
    }

    public componentDidUpdate(prevProps: LayoutProps) {
        const { isLoggedIn, userLoading } = this.props;

        if (!isLoggedIn && prevProps.isLoggedIn && !userLoading) {
            this.props.walletsReset();

            if (!this.props.location.pathname.includes('/trading')) {
                this.props.history.push('/trading/');
            }
        }
    }

    public componentWillUnmount() {
        for (const type of LayoutComponent.eventsListen) {
            document.body.removeEventListener(type, this.reset);
        }
        clearInterval(this.timer);
        clearInterval(this.walletsFetchInterval);
    }

    public translate = (key: string) => this.props.intl.formatMessage({id: key});

    public render() {
        const {
            colorTheme,
            isLoggedIn,
            isMobileDevice,
            userLoading,
            location,
            platformAccessStatus,
        } = this.props;
        const { isShownExpSessionModal } = this.state;
        const desktopCls = classnames('layout', {
            'trading-layout': location.pathname.includes('/trading'),
        });
        const mobileCls = classnames('layout layout--mobile', {
            'trading-layout': location.pathname.includes('/trading'),
        });
 
        toggleColorTheme(colorTheme);

        if (!platformAccessStatus.length) {
            return renderLoader();
        }

        if (isMobileDevice) {
            return (
                <div className={mobileCls}>
                    <Switch>
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signin" component={SignInMobileScreen} />
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signup" component={SignUpMobileScreen} />
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/forgot_password" component={ForgotPasswordMobileScreen} />
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/accounts/password_reset" component={ChangeForgottenPasswordMobileScreen} />
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/accounts/confirmation" component={VerificationScreen} />
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/email-verification" component={EmailVerificationMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:currency/overview" component={SelectedWalletMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:currency/withdraw" component={WalletWithdraw} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:currency/deposit" component={WalletDeposit} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profiles/kyc-steps" component={ConfirmMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets" component={WalletsMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/orders/:routeTab" component={OrdersMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/orders" component={OrdersMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/account-activity" component={ProfileAccountActivityMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/api-keys" component={ProfileApiKeysMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/referral" component={InvitesScreenMobile} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/2fa" component={ProfileAuthMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/verification" component={ProfileVerificationMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile" component={ProfileMobileScreen} /> 
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/p2p/my-payments/" component={ProfileP2PPaymentsScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/p2p/orders" component={ProfileP2POrdersScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/p2p/trade/messages/:tid" component={ProfileP2PTradeMessagesScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/p2p/trade/info/:tid" component={ProfileP2PTradeScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/p2p/myads" component={MyAdvertisementMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/p2p/advertisements/create" component={CreateAdvertisementMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/set-username" component={ProfileSetUsernameMobileScreen} />

                        <PrivateRoute exact={true} loading={userLoading} isLogged={isLoggedIn} path="/voletpayment" component={VoletpaymentMobile} /> 
                        <PrivateRoute exact={true} loading={userLoading} isLogged={isLoggedIn} path="/payeerpayment" component={PayeerpaymentMobile} />

                        <Route exact={true} path="/fees" component={FeesPolicy} /> 
                        <Route exact={true} path="/amlkyc-policy" component={AmlPolicy} />
                        <Route exact={true} path="/privacy-policy" component={PrivacyPolicy} /> 
                        <Route exact={true} path="/cookies-policy" component={CookiePolicy} />
                        <Route exact={true} path="/terms-of-use" component={TermsOfUse} />
                        <Route exact={true} path="/p2p" component={AdvertisementMobileScreen} />
                        <Route exact={true} path="/p2p/advertiser/:uid" component={AdvertiserMobileScreen} />

                        <Route exact={true} path="/trading/:market?" component={TradingScreenMobile} />
                        <Route exact={true} path="/" component={LandingScreenMobile} />

                        <Route path="**" component={ErrorScreen} />

                    </Switch>
                    {isLoggedIn && <WalletsFetch />}
                    {isShownExpSessionModal && this.handleRenderExpiredSessionModal()}
                </div>
            );
        }

        return (
            <div className={desktopCls}>
                <Switch>
                    <Route exact={true} path="/magic-link" component={MagicLink} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signin" component={SignInScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/accounts/confirmation" component={VerificationScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signup" component={SignUpScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/forgot_password" component={ForgotPasswordScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/accounts/password_reset" component={ChangeForgottenPasswordScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/email-verification" component={EmailVerificationScreen} /> 
                    <Route path="/restriction" component={RestrictedScreen} />
                    <Route path="/maintenance" component={MaintenanceScreen} />
                    <Route exact={true} path="/trading/:market?" component={TradingScreen} />
                    <Route exact={true} path="/" component={LandingScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/orders/:routeTab" component={OrdersTabScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/orders" component={OrdersTabScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/history/:routeTab" component={HistoryScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/history" component={HistoryScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile" component={ProfileScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profiles/kyc-steps" component={ConfirmScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/referral" component={InvitesScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/apikeys" component={ProfileApiKeys} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:routeTab/:currency/:action" component={WalletsScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:routeTab/:currency" component={WalletsScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:routeTab" component={WalletsScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets" component={WalletsScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/security/twofa-authenticator" component={ProfileTwoFactorAuthScreen} /> 
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/internal-transfer" component={InternalTransfer} />
                    
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/p2p/myads" component={MyAdvertisementsScreen} />
                    <PrivateRoute exact={true} loading={userLoading} isLogged={isLoggedIn} path="/p2p/my-payments/:uid" component={P2PPaymentsScreen} />
                    <PrivateRoute exact={true} loading={userLoading} isLogged={isLoggedIn} path="/p2p/advertisements/create" component={CreateAdvertisementScreen} />
                    <PrivateRoute exact={true} loading={userLoading} isLogged={isLoggedIn} path="/p2p/orders" component={P2POrdersScreen} />

                    <Route exact={true} path="/p2p/all-adverts/:currency/:fiatcoin" component={AdvertisementScreen} />
                    <Route exact={true} path="/p2p/all-adverts/" component={AdvertisementScreen} />
                    <Route exact={true} path="/p2p/advertiser/:id" component={AdvertiserScreen} />
                    <Route exact={true} path="/p2p/trade/:tid" component={P2PTradeScreen} />

                    <Route exact={true} path="/fees" component={FeesPolicy} /> 
                    <Route exact={true} path="/amlkyc-policy" component={AmlPolicy} />
                    <Route exact={true} path="/privacy-policy" component={PrivacyPolicy} /> 
                    <Route exact={true} path="/cookies-policy" component={CookiePolicy} />
                    <Route exact={true} path="/terms-of-use" component={TermsOfUse} /> 
                    <Route path="**" component={ErrorScreen} />
                </Switch>
                {isLoggedIn && <WalletsFetch/>}
                {isShownExpSessionModal && this.handleRenderExpiredSessionModal()}
            </div>
        );
    }
/* <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/confirm" component={ConfirmScreen} />
   <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/quick-exchange" component={QuickExchange} />*/
    private getLastAction = () => {
        if (localStorage.getItem(STORE_KEY) !== null) {
            return parseInt(localStorage.getItem(STORE_KEY) || '0', 10);
        }

        return 0;
    };

    private setLastAction = (lastAction: number) => {
        localStorage.setItem(STORE_KEY, lastAction.toString());
    };

    private initListener = () => {
        this.reset();
        for (const type of LayoutComponent.eventsListen) {
            document.body.addEventListener(type, this.reset);
        }
    };

    private reset = () => {
        this.setLastAction(Date.now());
    };

    private initInterval = () => {
        this.timer = setInterval(() => {
            this.check();
        }, parseFloat(sessionCheckInterval()));
    };

    private check = () => {
        const { user } = this.props;
        const now = Date.now();
        const timeleft = this.getLastAction() + parseFloat(minutesUntilAutoLogout()) * 60 * 1000;
        const diff = timeleft - now;
        const isTimeout = diff < 0;

        if (isTimeout && user.email) {
            if (user.state === 'active') {
                this.handleChangeExpSessionModalState();
            }

            this.props.logout();
            clearInterval(this.timer);
        }
    };

    private handleSubmitExpSessionModal = () => {
        const { history } = this.props;
        this.handleChangeExpSessionModalState();
        history.push('/signin');
    };

    private handleRenderExpiredSessionModal = () => (
        <ExpiredSessionModal
            title={this.translate('page.modal.expired.title')}
            buttonLabel={this.translate('page.modal.expired.submit')}
            handleChangeExpSessionModalState={this.handleChangeExpSessionModalState}
            handleSubmitExpSessionModal={this.handleSubmitExpSessionModal}
        />
    );

    private handleChangeExpSessionModalState = () => {
        this.setState({
            isShownExpSessionModal: !this.state.isShownExpSessionModal,
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    colorTheme: selectCurrentColorTheme(state),
    currentMarket: selectCurrentMarket(state),
    user: selectUserInfo(state),
    isLoggedIn: selectUserLoggedIn(state),
    isMobileDevice: selectMobileDeviceState(state),
    userLoading: selectUserFetching(state),
    platformAccessStatus: selectPlatformAccessStatus(state),
    //abilities: selectAbilities(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    logout: () => dispatch(logoutFetch()),
    toggleChartRebuild: () => dispatch(toggleChartRebuild()),
    userFetch: () => dispatch(userFetch()),
    walletsReset: () => dispatch(walletsReset()),
});

export const Layout = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(LayoutComponent) as any;
