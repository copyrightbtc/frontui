import {
    CHANGE_COLOR_THEME,
    CHANGE_TAB_GRID_MODE,
    TOGGLE_CHART_REBUILD,
    TOGGLE_MARKET_SELECTOR,
    TOGGLE_MOBILE_DEVICE,
    TOGGLE_ORDERS_PAIRS_SWITCHER,
    TRIGGER_APPLY_WINDOW_ENVS,
} from './constants';

export interface ChangeColorThemeAction {
    type: string;
    payload: string;
}

export interface changeTabGridModeAction {
    type: string;
    payload: string;
}

export interface ToggleChartRebuildAction {
    type: string;
}

export interface ToggleMarketSelectorAction {
    type: string;
}

export interface ToggleMobileDeviceAction {
    type: string;
    payload: boolean;
}

export interface TriggerApplyWindowEnvs {
    type: string;
}

export interface ToggleOpenOrdersPairsSwitcher {
    type: string;
    payload: boolean;
}

export type UIActions =
    | ChangeColorThemeAction
    | ToggleChartRebuildAction
    | ToggleMarketSelectorAction
    | ToggleMobileDeviceAction
    | TriggerApplyWindowEnvs
    | ToggleOpenOrdersPairsSwitcher;

export const toggleChartRebuild = (): ToggleChartRebuildAction => ({
    type: TOGGLE_CHART_REBUILD,
});

export const changeColorTheme = (payload: string): ChangeColorThemeAction => ({
    type: CHANGE_COLOR_THEME,
    payload,
});

export const changeTabGridMode = (payload: string): changeTabGridModeAction => ({
    type: CHANGE_TAB_GRID_MODE,
    payload,
})

export const toggleMarketSelector = (): ToggleMarketSelectorAction => ({
    type: TOGGLE_MARKET_SELECTOR,
});

export const setMobileDevice = (payload: boolean): ToggleMobileDeviceAction => ({
    type: TOGGLE_MOBILE_DEVICE,
    payload,
});

export const triggerApplyWindowEnvs = (): TriggerApplyWindowEnvs => ({
    type: TRIGGER_APPLY_WINDOW_ENVS,
});

export const toggleOpenOrdersPairsSwitcher = (payload: boolean): ToggleOpenOrdersPairsSwitcher => ({
    type: TOGGLE_ORDERS_PAIRS_SWITCHER,
    payload,
});