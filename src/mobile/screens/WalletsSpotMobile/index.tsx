import * as React from 'react';
import { injectIntl } from 'react-intl';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { IconButton, Button } from '@mui/material';
import { CSSTransition } from "react-transition-group";
import { ArrowBackIcon } from '../../../assets/images/ArrowBackIcon';
import { BalanceWalletIcon } from '../../../assets/images/BalanceWalletIcon';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from 'src';
import {
    CurrencyInfo,
    WalletList,
} from 'src/components';
import { WalletHeaderSearch } from 'src/components/WalletsHeader/WalletHeaderSearch';
import { WalletDepositBody } from 'src/mobile/components';
import { DEFAULT_CCY_PRECISION } from 'src/constants';
import { Withdraw, WithdrawProps } from 'src/containers';
import { ModalWithdrawConfirmation } from 'src/mobile/components/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from 'src/containers/ModalWithdrawSubmit';
import {
    alertPush,
    beneficiariesFetch,
    Beneficiary,
    Currency,
    Market,
    marketsFetch,
    marketsTickersFetch,
    RootState,
    selectBeneficiariesActivateSuccess,
    selectBeneficiariesCreateSuccess,
    selectBeneficiariesDeleteSuccess,
    selectCurrencies,
    selectHistory,
    selectMarkets,
    selectMarketTickers,
    selectMobileWalletUi,
    selectUserInfo,
    selectWallets,
    selectWalletsLoading,
    selectWithdrawSuccess,
    //selectBeneficiariesCreateError,
    setMobileWalletUi,
    Ticker,
    User,
    Wallet,
    WalletHistoryList,
    walletsData,
    walletsFetch,
    walletsWithdrawCcyFetch,
    selectMemberLevels,
    MemberLevels,
    memberLevelsFetch,
} from 'src/modules';
import { DEFAULT_WALLET } from '../../../constants';
import LockDisabled from 'src/assets/images/LockDisabled.svg';
import TwoFaIcon from 'src/assets/images/TwoFaIcon.svg';

interface ReduxProps {
    user: User;
    wallets: Wallet[];
    withdrawSuccess: boolean;
    walletsLoading?: boolean;
    historyList: WalletHistoryList;
    mobileWalletChosen: string;
    beneficiariesActivateSuccess: boolean;
    beneficiariesDeleteSuccess: boolean;
    beneficiariesAddSuccess: boolean;
    memberLevels: MemberLevels;
    currencies: Currency[];
    markets: Market[];
    tickers: {
        [key: string]: Ticker,
    };
}

interface DispatchProps {
    fetchMarkets: typeof marketsFetch;
    fetchTickers: typeof marketsTickersFetch;
    fetchBeneficiaries: typeof beneficiariesFetch;
    fetchWallets: typeof walletsFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    fetchSuccess: typeof alertPush;
    setMobileWalletUi: typeof setMobileWalletUi;
    memberLevelsFetch: typeof memberLevelsFetch;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    blockchain_key: '',
    blockchain_name: '',
    data: {
        address: '',
    },
};

interface WalletsState {
    activeIndex: number;
    otpCode: string;
    amount: string;
    fee: string;
    beneficiary: Beneficiary;
    selectedWalletIndex: number;
    withdrawSubmitModal: boolean;
    withdrawConfirmModal: boolean; 
    bchAddress?: string;
    filterValue: string;
    filteredWallets?: Wallet[];
    tab: string;
    withdrawDone: boolean;
    total: string;
    currentTabIndex: number;
    showModalCurrency: boolean;
}

interface OwnProps {
    walletsError: {
        message: string;
    };
    currency?: string;
    action?: string;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps & OwnProps;

class WalletsSpotMobileComponent extends React.Component<Props, WalletsState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            activeIndex: 0,
            selectedWalletIndex: -1,
            withdrawSubmitModal: false,
            withdrawConfirmModal: false,
            otpCode: '',
            amount: '',
            fee: '',
            beneficiary: defaultBeneficiary,
            tab: this.translate('page.body.wallets.tabs.deposit'),
            withdrawDone: false,
            total: '',
            currentTabIndex: 0,
            filterValue: '',
            filteredWallets: [], 
            showModalCurrency: false,
        };
    }

    //tslint:disable member-ordering
    public translate = (id: string) => this.props.intl.formatMessage({ id });
    public tabMapping = ['deposit', 'withdraw'];

    public componentDidMount() {
        const { wallets, currency, action, markets, tickers, memberLevels } = this.props;
        const { currentTabIndex, selectedWalletIndex } = this.state;

        if (!memberLevels) {
            this.props.memberLevelsFetch();
        }

        if (this.props.wallets.length === 0) {
            this.props.fetchWallets();
        }

        if (wallets.length && selectedWalletIndex === -1) {
            const walletToSet = wallets.find(i => i.currency?.toLowerCase() === currency?.toLowerCase()) || wallets[0];

            this.setState({
                selectedWalletIndex: wallets.indexOf(walletToSet),
                activeIndex: wallets.indexOf(walletToSet),
                filteredWallets: wallets,
            });

            if (walletToSet?.currency && currency !== walletToSet?.currency) {
                this.props.history.push(`/wallets/${walletToSet.currency.toLowerCase()}/${this.tabMapping[currentTabIndex]}`);
            }

            const tabIndex = this.tabMapping.indexOf(action);

            if (tabIndex !== -1 && tabIndex !== currentTabIndex) {
                this.onTabChange(this.translate(`page.body.wallets.tabs.${action}`))
                this.onCurrentTabChange(tabIndex);
            }
        }

        if (!markets.length) {
            this.props.fetchMarkets();
        }

        if (!tickers.length) {
            this.props.fetchTickers();
        }
    }

    public componentWillReceiveProps(next: Props) {
        const {
            wallets,
            beneficiariesActivateSuccess,
            beneficiariesDeleteSuccess,
            withdrawSuccess,
            beneficiariesAddSuccess,
            currency,
            action,
        } = this.props;
        const { selectedWalletIndex, currentTabIndex } = this.state;

        if (!wallets.length && next.wallets.length && selectedWalletIndex === -1) {
            const walletToSet = next.wallets.find(i => i.currency?.toLowerCase() === currency?.toLowerCase()) || next.wallets[0];

            this.setState({
                selectedWalletIndex: next.wallets.indexOf(walletToSet),
                activeIndex: next.wallets.indexOf(walletToSet),
                filteredWallets: next.wallets,
            });

            if (walletToSet?.currency && currency !== walletToSet?.currency) {
                this.props.history.push(`/wallets/${walletToSet.currency.toLowerCase()}/${this.tabMapping[currentTabIndex]}`);
            }
            const tabIndex = this.tabMapping.indexOf(action);

            if (tabIndex !== -1 && tabIndex !== currentTabIndex) {
                this.onTabChange(this.translate(`page.body.wallets.tabs.${action}`))
                this.onCurrentTabChange(tabIndex);
            }
        }

        if (!withdrawSuccess && next.withdrawSuccess) {
            this.toggleSubmitModal();
        }

        if ((next.beneficiariesActivateSuccess && !beneficiariesActivateSuccess) ||
            (next.beneficiariesDeleteSuccess && !beneficiariesDeleteSuccess) ||
            (next.beneficiariesAddSuccess && !beneficiariesAddSuccess)) {
            const selectedCurrency = (next.wallets[selectedWalletIndex] || { currency: '' }).currency;

            this.props.fetchBeneficiaries({ currency_id: selectedCurrency.toLowerCase(), state: [ 'active', 'pending' ] });
        }
    }

    public componentDidUpdate(prevProps: Props, prevState: WalletsState) {
        const { action, wallets, currency } = this.props;
        const tabIndex = this.tabMapping.indexOf(action);

        if (prevState.currentTabIndex === 0 && tabIndex === 1 && wallets.length) {
            const walletToSet = wallets.find(i => i.currency?.toLowerCase() === currency?.toLowerCase()) || wallets[0];
            walletToSet?.currency && this.props.fetchBeneficiaries({ currency_id: walletToSet.currency?.toLowerCase(), state: [ 'active', 'pending' ] });
        }
    }

    public render() {
        const {
            wallets,
            currencies,
            //walletsLoading,
        } = this.props;
        const {
            amount,
            fee,
            otpCode,
            beneficiary,
            total,
            selectedWalletIndex,
            withdrawSubmitModal,
            withdrawConfirmModal,
            currentTabIndex, 
        } = this.state;
        const selectedCurrency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        const currencyType = (wallets[selectedWalletIndex] || { currency: '' }).type;
        const currencyItem = (currencies && currencies.find(item => item.id === selectedCurrency));
        const blockchainItem = currencyItem?.networks?.find(n => n.blockchain_key === beneficiary.blockchain_key);

        let confirmationAddress = '';
        let selectedWalletPrecision = DEFAULT_CCY_PRECISION;

        if (wallets[selectedWalletIndex]) {
            selectedWalletPrecision = wallets[selectedWalletIndex].fixed;

            if (wallets[selectedWalletIndex].type === 'fiat') {
                confirmationAddress = beneficiary.name;
            } else if (beneficiary.data) {
                confirmationAddress = beneficiary.data.address as string;
            }
        }

        return (
            <React.Fragment>
                {this.tabMapping[currentTabIndex] === 'deposit' ? this.renderDeposit() : this.renderWithdraw()}
                <ModalWithdrawSubmit
                    isMobileDevice
                    show={withdrawSubmitModal}
                    currency={selectedCurrency}
                    onSubmit={this.toggleSubmitModal}
                />
                <ModalWithdrawConfirmation
                    beneficiary={beneficiary}
                    protocol={blockchainItem?.protocol}
                    otpCode={otpCode}
                    show={withdrawConfirmModal}
                    type={currencyType}
                    amount={amount}
                    fee={fee}
                    total={total}
                    currency={selectedCurrency}
                    rid={confirmationAddress}
                    onSubmit={this.handleWithdraw}
                    onDismiss={this.toggleConfirmModal}
                    handleChangeCodeValue={this.handleChangeCodeValue}
                    precision={selectedWalletPrecision}
                />
            </React.Fragment>
        );
    }
 
    private formattedWallets = () => {
        const {filteredWallets } = this.state;

        return filteredWallets.map((wallet: Wallet) => ({
            ...wallet,
            currency: wallet.currency.toUpperCase(),
            iconUrl: wallet.iconUrl ? wallet.iconUrl : '',
        }));
    }
 
    private onTabChange = label => this.setState({ tab: label });
    private onActiveIndexChange = index => this.setState({ activeIndex: index });
    private onCurrentTabChange = index => {
        const { selectedWalletIndex } = this.state;
        const { wallets } = this.props;

        this.setState({ currentTabIndex: index });
        wallets && wallets[selectedWalletIndex] && this.props.history.push(`/wallets/${wallets[selectedWalletIndex].currency?.toLowerCase()}/${this.tabMapping[index]}`)
    };

    private toggleSubmitModal = () => {
        this.setState((state: WalletsState) => ({
            withdrawSubmitModal: !state.withdrawSubmitModal,
            withdrawDone: true,
        }));
    };

    private toggleConfirmModal = (amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string, fee?: string) => {
        this.setState((state: WalletsState) => ({
            amount: amount || '',
            beneficiary: beneficiary ? beneficiary : defaultBeneficiary,
            otpCode: otpCode ? otpCode : '',
            withdrawConfirmModal: !state.withdrawConfirmModal,
            total: total || '',
            fee: fee || '',
            withdrawDone: false,
        }));
    };

    private handleChangeCodeValue = (value: string) => {
        this.setState({
            otpCode: value,
        });
    };

    private handleWithdraw = () => {
        const { selectedWalletIndex, otpCode, amount, beneficiary } = this.state;
        if (selectedWalletIndex === -1) {
            return;
        }

        const { currency } = this.props.wallets[selectedWalletIndex];
        const withdrawRequest = {
            amount,
            currency: currency.toLowerCase(),
            otp: otpCode,
            beneficiary_id: String(beneficiary.id),
        };
        this.props.walletsWithdrawCcy(withdrawRequest);
        this.toggleConfirmModal();
        this.setState({ otpCode: '' });
    };

    private renderDeposit = () => {
        const { wallets, currency } = this.props;
        const { selectedWalletIndex } = this.state;
         
        const wallet = (wallets[selectedWalletIndex] || DEFAULT_WALLET);
        
        <React.Fragment>
            <div className="mobile-wallet--top__close">
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
                <p>{this.translate('page.body.profile.content.back' )}</p>
            </div>
            <WalletDepositBody wallet={wallet}/>
        </React.Fragment>
    };

    private renderWithdraw = () => {
        const { wallets, walletsError, user: { level }, memberLevels } = this.props;
        const { selectedWalletIndex } = this.state;
        const wallet = (wallets[selectedWalletIndex] || DEFAULT_WALLET);

        return (
            <React.Fragment>
                {level < memberLevels?.withdraw.minimum_level ? (
                    <div className="mobile-wallet__withdraw">
                        <div className="wallet-warning withdraw">
                            <img src={LockDisabled} alt="lock" draggable="false"/>
                            <h6>{this.translate('page.body.wallets.warning.withdraw.verification')}</h6>
                            <p>{this.translate('page.body.wallets.warning.withdraw.verification.hint')}</p>
                            <Button
                                className="medium-button themes"
                                href='/profile/verification'
                            >
                                {this.translate('page.body.wallets.warning.deposit.verification.button')}
                            </Button>
                        </div>
                    </div> 
                ) : (
                    <div className="mobile-wallet__withdraw">
                        {walletsError && <p className="wallet__error">{walletsError.message}</p>}
                        {this.renderWithdrawContent()}
                    </div>
                )}
            </React.Fragment>
        );
    };

    private renderWithdrawOTP = () => {
        return (
            <div className="wallet-warning withdraw">
                <img src={TwoFaIcon} alt="lock" draggable="false"/>
                <h6>{this.translate('page.body.wallets.tabs.withdraw.content.enable2fa')}</h6>
                <p>{this.translate('page.body.wallets.warning.withdraw.otp.hint')}</p>
                <Button
                    className="medium-button themes success"
                    onClick={this.handleNavigateTo2fa}
                >
                    {this.translate('page.body.wallets.tabs.withdraw.content.enable2faButton')}
                </Button>
            </div>
        )
    };

    private handleNavigateTo2fa = () => {
        this.props.history.push('/profile/2fa', { enable2fa: true });
    };
 
    private renderWithdrawWarningNoNetworks = () => {
        const { wallets } = this.props;
        const { selectedWalletIndex } = this.state;
        const wallet = (wallets[selectedWalletIndex] || DEFAULT_WALLET);
        return (
            <div className="wallet-warning withdraw">
                <img src={LockDisabled} alt="lock" draggable="false"/>
                <span>{this.props.intl.formatMessage({ id: 'page.body.wallets.warning.withdraw.no.networks'}, {currency: wallet.currency.toUpperCase()})}</span>
        </div>
        );
    };

    private renderWithdrawWarning = () => {
        const { selectedWalletIndex } = this.state;
        const { user: {otp}, currencies, wallets } = this.props;

        const wallet = wallets[selectedWalletIndex];
        const currencyItem = (currencies && currencies.find(item => item.id === wallet.currency));

        return (
            <React.Fragment>
                {!currencyItem?.networks && this.renderWithdrawWarningNoNetworks()}
                {!otp && this.renderWithdrawOTP()}
            </React.Fragment>
        );
    };

    private renderWithdrawContent = () => {
        const { withdrawDone, selectedWalletIndex, fee } = this.state;

        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }
        const { user: { level, otp }, wallets, currencies } = this.props;
        const wallet = wallets[selectedWalletIndex];
        const { currency, type, balance } = wallet;
        const fixed = (wallet || { fixed: 0 }).fixed;
        const currencyItem = (currencies && currencies.find(item => item.id === wallet.currency));

        const withdrawProps: WithdrawProps = {
            networks: currencyItem.networks,
            withdrawDone,
            isMobileDevice: true,
            price: currencyItem.price,
            name: currencyItem.name,
            currency,
            fee: +fee,
            balance,
            onClick: this.toggleConfirmModal,
            twoFactorAuthRequired: this.isTwoFactorAuthRequired(level, otp),
            fixed,
            type,
            withdrawAmountLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }),
            withdraw2faLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }),
            withdrawFeeLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }),
            withdrawSumlLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amounttol' }),
            withdrawTotalLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }),
            withdrawButtonLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }),
            withdrawAllButtonLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button.all' })
        };

       if (!otp || !currencyItem?.networks)  {
            return this.renderWithdrawWarning();
        }

        return <Withdraw {...withdrawProps} />;
    };

    private isTwoFactorAuthRequired(level: number, is2faEnabled: boolean) {
        return level >= this.props.memberLevels?.withdraw.minimum_level || (level === this.props.memberLevels?.withdraw.minimum_level && is2faEnabled);
    }

    private goBack = () => {
        window.history.back();
    };

    private closeModalCurrency = () => {
        this.setState({
            showModalCurrency: false,
        });
    };
 
    private setFilterValue = (value: string) => {
        this.setState({
            filterValue: value,
        });
    };

    private handleFilter = (result: object[]) => {
        this.setState({
            filteredWallets: result as Wallet[],
        });
    };

    private onWalletSelectionChange = (value: Wallet) => {
      const { wallets } = this.props;
      const { currentTabIndex } = this.state;

      const nextWalletIndex = this.props.wallets.findIndex(
          wallet => wallet.currency?.toLowerCase() === value.currency.toLowerCase()
      );

      this.setState({
          selectedWalletIndex: nextWalletIndex,
          withdrawDone: false,
          showModalCurrency: false,
      });

      currentTabIndex === 1 && this.props.fetchBeneficiaries({ currency_id: value.currency.toLowerCase(), state: [ 'active', 'pending' ] });
      this.props.history.push(`/wallets/${value.currency.toLowerCase()}/${this.tabMapping[currentTabIndex]}`);
      this.props.setMobileWalletUi(wallets[nextWalletIndex].name);
    };
 
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    markets: selectMarkets(state),
    tickers: selectMarketTickers(state),
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    walletsLoading: selectWalletsLoading(state),
    withdrawSuccess: selectWithdrawSuccess(state),
    historyList: selectHistory(state),
    mobileWalletChosen: selectMobileWalletUi(state),
    beneficiariesActivateSuccess: selectBeneficiariesActivateSuccess(state),
    beneficiariesDeleteSuccess: selectBeneficiariesDeleteSuccess(state),
    currencies: selectCurrencies(state),
    beneficiariesAddSuccess: selectBeneficiariesCreateSuccess(state),
    memberLevels: selectMemberLevels(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchTickers: () => dispatch(marketsTickersFetch()),
    fetchBeneficiaries: params => dispatch(beneficiariesFetch(params)),
    fetchWallets: () => dispatch(walletsFetch()),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    fetchSuccess: payload => dispatch(alertPush(payload)),
    setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
    memberLevelsFetch: () => dispatch(memberLevelsFetch()),
});

export const WalletsSpotMobile = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(WalletsSpotMobileComponent) as any; // tslint:disable-this-line:no-any
