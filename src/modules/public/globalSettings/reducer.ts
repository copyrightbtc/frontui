import {
    CHANGE_COLOR_THEME,
    CHANGE_TAB_GRID_MODE,
    TOGGLE_CHART_REBUILD,
    TOGGLE_MARKET_SELECTOR,
    TOGGLE_MOBILE_DEVICE,
    TOGGLE_ORDERS_PAIRS_SWITCHER,
    TRIGGER_APPLY_WINDOW_ENVS,
} from './constants';

export interface GlobalSettingsState {
    color: string;
    tabGridMode: string;
    chartRebuild: boolean;
    marketSelectorActive: boolean;
    isMobileDevice: boolean;
    applyWindowEnvsTrigger: boolean;
    ordersHideOtherPairs: boolean;
}

const currentGlobalSettings: string = localStorage.getItem('colorTheme') || 'dark';
let currentGlobaTabGridModeSetting: string = localStorage.getItem('tabGridMode') || '0';
let tabGridValueToValidate = parseInt(currentGlobaTabGridModeSetting);

if (tabGridValueToValidate) {
    if (tabGridValueToValidate !== 0 && tabGridValueToValidate !== 1 && tabGridValueToValidate !== 2) {
        currentGlobaTabGridModeSetting = '0';
    }
}

export const initialChangeGlobalSettingsState: GlobalSettingsState = {
    color: currentGlobalSettings,
    tabGridMode: currentGlobaTabGridModeSetting,
    chartRebuild: false,
    marketSelectorActive: false,
    isMobileDevice: false,
    applyWindowEnvsTrigger: false,
    ordersHideOtherPairs: true,
};

export const changeGlobalSettingsReducer = (state = initialChangeGlobalSettingsState, action) => {
    switch (action.type) {
        case CHANGE_COLOR_THEME:
            localStorage.setItem('colorTheme', action.payload);

            return {
                ...state,
                color: action.payload,
            };
        case CHANGE_TAB_GRID_MODE:
            localStorage.setItem('tabGridMode', action.payload);

            return {
                ...state,
                tabGridMode: action.payload,
            };
        case TOGGLE_CHART_REBUILD:
            return {
                ...state,
                chartRebuild: !state.chartRebuild,
            };
        case TOGGLE_MARKET_SELECTOR:
            return {
                ...state,
                marketSelectorActive: !state.marketSelectorActive
            };
        case TOGGLE_MOBILE_DEVICE:
            return {
                ...state,
                isMobileDevice: action.payload,
            };
        case TRIGGER_APPLY_WINDOW_ENVS:
            return {
                ...state,
                applyWindowEnvsTrigger: !state.applyWindowEnvsTrigger,
            };
        case TOGGLE_ORDERS_PAIRS_SWITCHER:
            return {
                ...state,
                ordersHideOtherPairs: action.payload,
            };
        default:
            return state;
    }
};