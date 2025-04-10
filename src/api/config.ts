const hostUrl = window.location.hostname === 'localhost' ? 'http://localhost:9002' : window.location.origin;
const protocolSSL = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
const rangerHostUrl =  window.location.hostname === 'localhost' ? 'ws://localhost:9003' : `${protocolSSL}${window.location.hostname}`;

export const defaultConfig: Config = {
    api: {
        authUrl: `${hostUrl}/api/v2/authsfor`,
        tradeUrl: `${hostUrl}/api/v2/tradesfor`,
        applogicUrl: `${hostUrl}/api/v2/applogic`,
        rangerUrl: `${rangerHostUrl}/api/v2/ranger`,
        p2pUrl: `${hostUrl}/api/v2/p2p`,
    },
    withCredentials: false,
    incrementalOrderBook: true,
    isResizable: false,
    isDraggable: false, 
    sentryEnabled: false,
    captchaLogin: true,
    usernameEnabled: false,
    gaTrackerKey: '',
    minutesUntilAutoLogout: '240',
    msAlertDisplayTime: '5000',
    msPricesUpdates: '1000',
    sessionCheckInterval: '15000',
    balancesFetchInterval: '3000',
    passwordEntropyStep: '14',
    storage: {
        defaultStorageLimit: '50',
        orderBookSideLimit: '50'
    },
    languages: ['en', 'ru'],
    kycSteps: [
        //'email',
        'phone',
        'profile',
        'document',
        //'address'
    ],
    password_min_entropy: 14,
    barong_upload_size_min_range: '0',
    barong_upload_size_max_range: '5',
    tradesfor_platform_currency: 'usdt',
    tvDefaultCandles: 60,
};

export const Sfortrade = {
    config: defaultConfig,
};

Sfortrade.config = { ...defaultConfig, ...window.env };
Sfortrade.config.storage = { ...defaultConfig.storage, ...Sfortrade.config.storage };

const convertToBoolean = (value: any): boolean => {
    return String(value) === 'true';
}

export const tradeUrl = () => Sfortrade.config.api.tradeUrl;
export const authUrl = () => Sfortrade.config.api.authUrl;
export const applogicUrl = () => Sfortrade.config.api.applogicUrl;
export const rangerUrl = () => Sfortrade.config.api.rangerUrl;
export const p2pUrl = () => Sfortrade.config.api.p2pUrl;
export const withCredentials = () => convertToBoolean(Sfortrade.config.withCredentials);
export const incrementalOrderBook = () => convertToBoolean(Sfortrade.config.incrementalOrderBook);
export const isResizableGrid = () => convertToBoolean(Sfortrade.config.isResizable);
export const isDraggableGrid = () => convertToBoolean(Sfortrade.config.isDraggable);
export const sentryEnabled = () => convertToBoolean(Sfortrade.config.sentryEnabled);
export const captchaLogin = () => convertToBoolean(Sfortrade.config.captchaLogin);
export const minutesUntilAutoLogout = () => Sfortrade.config.minutesUntilAutoLogout;
export const sessionCheckInterval = () => Sfortrade.config.sessionCheckInterval;
export const balancesFetchInterval = () => Sfortrade.config.balancesFetchInterval;
export const gaTrackerKey = () => Sfortrade.config.gaTrackerKey;
export const msAlertDisplayTime = () => Sfortrade.config.msAlertDisplayTime;
export const msPricesUpdates = () => Sfortrade.config.msPricesUpdates;
export const defaultStorageLimit = () => Number(Sfortrade.config.storage.defaultStorageLimit);
export const orderBookSideLimit = () => Number(Sfortrade.config.storage.orderBookSideLimit);
export const passwordEntropyStep = () => Number(Sfortrade.config.passwordEntropyStep);
export const languages = (Sfortrade.config.languages && Sfortrade.config.languages.length > 0) ? Sfortrade.config.languages : ['en'];
export const kycSteps = () => Sfortrade.config.kycSteps;
export const isUsernameEnabled = () => convertToBoolean(Sfortrade.config.usernameEnabled);
export const passwordMinEntropy = () => Number(Sfortrade.config.password_min_entropy);
export const authsforUploadSizeMinRange = Number(Sfortrade.config.barong_upload_size_min_range || '0');
export const authsforUploadSizeMaxRange = Number(Sfortrade.config.barong_upload_size_max_range || '5');
export const platformCurrency = () => Sfortrade.config.tradesfor_platform_currency.toUpperCase();
export const tvDefaultCandles = () => Number(Sfortrade.config.tvDefaultCandles || 60);