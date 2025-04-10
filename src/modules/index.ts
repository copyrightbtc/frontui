import { combineReducers } from 'redux';
import { all, call } from 'redux-saga/effects';
import { publicReducer, userReducer } from './app';
import { AlertState, rootHandleAlertSaga } from './public/alert';
import { BlockchainsState } from './public/blockchains';
import { BlocklistAccessState, rootBlocklistAccessSaga } from './public/blocklistAccess';
import { ConfigsState, rootConfigsSaga } from './public/configs';
import { ConfigsAuthState, rootConfigsAuthSaga } from './public/configsAuth';
import { CurrenciesState } from './public/currencies';
import { ErrorHandlerState, rootErrorHandlerSaga } from './public/errorHandler';
import { GlobalSettingsState } from './public/globalSettings';
import { GridLayoutState } from './public/gridLayout';
import { LanguageState } from './public/i18n';
import { KlineState, rootKlineFetchSaga } from './public/kline';
import { MarketsState, rootMarketsSaga } from './public/markets';
import { MemberLevelsState, rootMemberLevelsSaga } from './public/memberLevels';
import { MemberFeesState, rootMemberFeesSaga } from './public/memberFees';
import { DepthIncrementState, DepthState, OrderBookState, rootOrderBookSaga } from './public/orderBook';
import { RecentTradesState, rootRecentTradesSaga } from './public/recentTrades';
import { ApiKeysState } from './user/apiKeys';
import { rootApiKeysSaga } from './user/apiKeys/sagas';
import { AuthState, rootAuthSaga } from './user/auth';
//import { AbilitiesState, rootAbilitiesSaga } from './user/abilities';
import { BeneficiariesState, rootBeneficiariesSaga } from './user/beneficiaries';
import { GeetestCaptchaState, rootGeetestCaptchaSaga } from './user/captcha';
import { DocumentationState, rootDocumentationSaga } from './user/documentation';
import { EmailVerificationState, rootEmailVerificationSaga } from './user/emailVerification';
import { HistoryState, rootHistorySaga } from './user/history';
import { InternalTransfersState, rootInternalTransfersSaga } from './user/internalTransfers';
import { AddressesState, rootSendAddressesSaga } from './user/kyc/addresses';
import { DocumentsState, rootSendDocumentsSaga } from './user/kyc/documents';
import { IdentityState, rootSendIdentitySaga } from './user/kyc/identity';
import { LabelState, rootLabelSaga } from './user/kyc/label';
import { PhoneState, rootSendCodeSaga } from './user/kyc/phone';
import { OpenOrdersState, rootOpenOrdersSaga } from './user/openOrders';
import { OrdersState, rootOrdersSaga } from './user/orders';
import { OrdersHistoryState, rootOrdersHistorySaga } from './user/ordersHistory';
import { PasswordState, rootPasswordSaga } from './user/password';
import { ProfileState, rootProfileSaga } from './user/profile';
import { rootUserActivitySaga, UserActivityState } from './user/userActivity';
import { rootWalletsSaga, WalletsState } from './user/wallets';
//import { QuickExchangeState, rootQuickExchangeSaga } from './user/quickExchange';
import { rootWithdrawLimitSaga, WithdrawLimitState } from './user/withdrawLimit';
import { rootFeeGroupSaga, FeeGroupState } from './user/feeGroup';
import { rootWithdrawLimitsSaga, WithdrawLimitsState } from './public/withdrawLimits';
import { CommissionsState, rootCommissionsSaga } from './user/commissions';
import { InvitesState, rootInvitesSaga } from './user/invites';
import { AdvertisementsState, rootAdvertisementsSaga } from './public/advertisement';
import { AdvertiserState, rootAdvertiserSaga } from './public/advertiser';
import { PaymentsState, rootPaymentsSaga } from './user/payments';
import { P2POrdersState, rootP2POrdersSaga } from './user/p2pOrders';
import { P2PTradeState, rootP2PTradeSaga } from './user/p2pTrade';
import { P2PConversationsState, rootP2PConversationsSaga } from './user/p2pConversations';
import { P2PAdvertisementsState, rootP2PAdvertisementsSaga } from './user/p2pAdvertisement';
import { rootUsernameSaga, UsernameState } from './user/username';

export * from './public/alert';
export * from './public/blockchains';
export * from './public/blocklistAccess';
export * from './public/configs';
export * from './public/configsAuth';
export * from './public/currencies';
export * from './public/errorHandler';
export * from './public/globalSettings';
export * from './public/i18n';
export * from './public/kline';
export * from './public/markets';
export * from './public/memberLevels';
export * from './public/memberFees';
export * from './public/orderBook';
export * from './public/recentTrades';
export * from './public/withdrawLimits';
export * from './user/apiKeys';
export * from './user/auth';
export * from './user/beneficiaries';
export * from './user/captcha';
export * from './user/documentation';
export * from './user/emailVerification';
export * from './user/history';
export * from './user/internalTransfers';
export * from './user/kyc';
export * from './user/openOrders';
export * from './user/orders';
export * from './user/ordersHistory';
export * from './user/password';
export * from './user/profile';
export * from './user/commissions';
export * from './user/invites';
export * from './user/userActivity';
export * from './user/wallets';
export * from './user/feeGroup';
export * from './user/withdrawLimit';
//export * from './user/quickExchange';
//export * from './user/abilities';
export * from './user/p2pOrders';
export * from './user/p2pAdvertisement';
export * from './user/p2pTrade';
export * from './user/p2pConversations';
export * from './user/invites';
export * from './user/payments';
export * from './user/username';
 
export interface RootState {
    public: {
        alerts: AlertState;
        blockchains: BlockchainsState;
        blocklistAccess: BlocklistAccessState;
        globalSettings: GlobalSettingsState;
        configs: ConfigsState;
        configsAuth: ConfigsAuthState;
        currencies: CurrenciesState;
        depth: DepthState;
        errorHandler: ErrorHandlerState;
        i18n: LanguageState;
        incrementDepth: DepthIncrementState;
        kline: KlineState;
        markets: MarketsState;
        memberLevels: MemberLevelsState;
        memberFees: MemberFeesState;
        orderBook: OrderBookState;
        recentTrades: RecentTradesState;
        rgl: GridLayoutState;
        withdrawLimits: WithdrawLimitsState,
        advertisements: AdvertisementsState;
        advertiser: AdvertiserState;
    };
    user: {
        //abilities: AbilitiesState;
        addresses: AddressesState;
        apiKeys: ApiKeysState;
        auth: AuthState;
        beneficiaries: BeneficiariesState;
        captcha: GeetestCaptchaState;
        documentation: DocumentationState;
        documents: DocumentsState;
        history: HistoryState;
        identity: IdentityState;
        internalTransfers: InternalTransfersState;
        label: LabelState;
        openOrders: OpenOrdersState;
        orders: OrdersState;
        commissions: CommissionsState;
        invites: InvitesState;
        ordersHistory: OrdersHistoryState;
        password: PasswordState;
        phone: PhoneState;
        profile: ProfileState;
        sendEmailVerification: EmailVerificationState;
        userActivity: UserActivityState;
        wallets: WalletsState;
        withdrawLimit: WithdrawLimitState;
        feeGroup: FeeGroupState;
        //quickExchange: QuickExchangeState;
        payments: PaymentsState;
        p2pOrders: P2POrdersState;
        p2pTrade: P2PTradeState;
        p2pConversations: P2PConversationsState;
        username: UsernameState;
        p2pAdvertisements: P2PAdvertisementsState;

    };
}

export const rootReducer = combineReducers({
    public: publicReducer,
    user: userReducer,
});

export function* rootSaga() {
    yield all([
        call(rootWithdrawLimitsSaga),
        call(rootFeeGroupSaga),
        //call(rootQuickExchangeSaga),
        //call(rootAbilitiesSaga),
        call(rootApiKeysSaga),
        call(rootAuthSaga),
        call(rootBeneficiariesSaga),
        call(rootBlocklistAccessSaga),
        call(rootDocumentationSaga),
        call(rootEmailVerificationSaga),
        call(rootErrorHandlerSaga),
        call(rootGeetestCaptchaSaga),
        call(rootHandleAlertSaga),
        call(rootHistorySaga),
        call(rootInternalTransfersSaga),
        call(rootKlineFetchSaga),
        call(rootLabelSaga),
        call(rootMarketsSaga),
        call(rootMemberLevelsSaga),
        call(rootMemberFeesSaga),
        call(rootOpenOrdersSaga),
        call(rootOrderBookSaga),
        call(rootOrdersHistorySaga),
        call(rootOrdersSaga),
        call(rootPasswordSaga),
        call(rootProfileSaga),
        call(rootRecentTradesSaga),
        call(rootSendAddressesSaga),
        call(rootSendCodeSaga),
        call(rootSendDocumentsSaga),
        call(rootSendIdentitySaga),
        call(rootUserActivitySaga),
        call(rootWalletsSaga),
        call(rootWithdrawLimitSaga),
        //call(rootQuickExchangeSaga),
        call(rootConfigsSaga),
        call(rootConfigsAuthSaga),
        call(rootCommissionsSaga),
        call(rootInvitesSaga),
        call(rootP2POrdersSaga),
        call(rootP2PTradeSaga),
        call(rootP2PConversationsSaga),
        call(rootPaymentsSaga),
        call(rootP2POrdersSaga),
        call(rootAdvertisementsSaga),
        call(rootAdvertiserSaga),
        call(rootP2PAdvertisementsSaga),
        call(rootUsernameSaga),
    ]);
}
