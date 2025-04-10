import { combineReducers } from 'redux';
import { alertReducer  } from './public/alert';
import { blockchainsReducer } from './public/blockchains';
import { blocklistAccessReducer } from './public/blocklistAccess';
import { configsReducer } from './public/configs';
import { configsAuthReducer } from './public/configsAuth';
import { currenciesReducer } from './public/currencies';
import { errorHandlerReducer } from './public/errorHandler';
import { changeGlobalSettingsReducer  } from './public/globalSettings';
import { gridLayoutReducer } from './public/gridLayout';
import { changeLanguageReducer  } from './public/i18n';
import { klineReducer  } from './public/kline';
import { marketsReducer } from './public/markets';
import { memberLevelsReducer } from './public/memberLevels';
import { memberFeesReducer } from './public/memberFees';
import { depthReducer, incrementDepthReducer, orderBookReducer } from './public/orderBook';
import { recentTradesReducer  } from './public/recentTrades';
import { withdrawLimitsReducer  } from './public/withdrawLimits';
import { apiKeysReducer } from './user/apiKeys';
//import { abilitiesReducer } from './user/abilities';
import { authReducer  } from './user/auth';
import { beneficiariesReducer } from './user/beneficiaries';
import { getGeetestCaptchaReducer } from './user/captcha';
import { documentationReducer } from './user/documentation';
import { sendEmailVerificationReducer } from './user/emailVerification';
import { historyReducer  } from './user/history';
import { internalTransfersReducer } from './user/internalTransfers';
import {
    addressesReducer,
    documentsReducer,
    identityReducer,
    labelReducer,
    phoneReducer,
} from './user/kyc';
import { openOrdersReducer } from './user/openOrders';
import { ordersReducer  } from './user/orders';
import { ordersHistoryReducer  } from './user/ordersHistory';
import { passwordReducer  } from './user/password';
import { profileReducer  } from './user/profile';
import { userActivityReducer  } from './user/userActivity';
import { walletsReducer  } from './user/wallets';
import { withdrawLimitReducer  } from './user/withdrawLimit';
//import { quickExchangeReducer } from './user/quickExchange';
import { feeGroupReducer } from './user/feeGroup';
import { commissionsReducer } from './user/commissions';
import { invitesReducer } from './user/invites';
import { advertisementsReducer } from './public/advertisement';
import { advertiserReducer } from './public/advertiser';
import { paymentsReducer } from './user/payments';
import { p2pOrdersReducer } from './user/p2pOrders';
import { p2pTradeReducer } from './user/p2pTrade';
import { p2pConversationsReducer } from './user/p2pConversations';
import { p2pAdvertisementsReducer } from './user/p2pAdvertisement';
import { usernameReducer } from './user/username';

export const publicReducer = combineReducers({
    alerts: alertReducer,
    blockchains: blockchainsReducer,
    blocklistAccess: blocklistAccessReducer,
    globalSettings: changeGlobalSettingsReducer,
    configs: configsReducer,
    configsAuth: configsAuthReducer,
    currencies: currenciesReducer,
    errorHandler: errorHandlerReducer,
    rgl: gridLayoutReducer,
    i18n: changeLanguageReducer,
    kline: klineReducer,
    markets: marketsReducer,
    memberLevels: memberLevelsReducer,
    memberFees: memberFeesReducer,
    orderBook: orderBookReducer,
    depth: depthReducer,
    incrementDepth: incrementDepthReducer,
    recentTrades: recentTradesReducer,
    withdrawLimits: withdrawLimitsReducer,
    advertisements: advertisementsReducer,
    advertiser: advertiserReducer,
});

export const userReducer = combineReducers({
    addresses: addressesReducer,
    apiKeys: apiKeysReducer,
    auth: authReducer,
    beneficiaries: beneficiariesReducer,
    captcha: getGeetestCaptchaReducer,
    documentation: documentationReducer,
    history: historyReducer,
    documents: documentsReducer,
    identity: identityReducer,
    label: labelReducer,
    phone: phoneReducer,
    openOrders: openOrdersReducer,
    orders: ordersReducer,
    ordersHistory: ordersHistoryReducer,
    password: passwordReducer,
    profile: profileReducer,
    sendEmailVerification: sendEmailVerificationReducer,
    userActivity: userActivityReducer,
    wallets: walletsReducer,
    feeGroup: feeGroupReducer,
    withdrawLimit: withdrawLimitReducer,
    internalTransfers: internalTransfersReducer,
    //quickExchange: quickExchangeReducer,
    //abilities: abilitiesReducer,
    commissions: commissionsReducer,
    invites: invitesReducer,
    p2pOrders: p2pOrdersReducer,
    payments: paymentsReducer,
    p2pTrade: p2pTradeReducer,
    p2pConversations: p2pConversationsReducer,
    p2pAdvertisements: p2pAdvertisementsReducer,
    username: usernameReducer,
});
