import { RootState } from '../../../modules';
import { GlobalSettingsState } from './reducer';

export const selectCurrentColorTheme = (state: RootState): GlobalSettingsState['color'] =>
    state.public.globalSettings.color;

export const selectCurrentTabGridMode = (state: RootState): GlobalSettingsState['tabGridMode'] =>
    state.public.globalSettings.tabGridMode;

export const selectChartRebuildState = (state: RootState): GlobalSettingsState['chartRebuild'] =>
    state.public.globalSettings.chartRebuild;

export const selectMarketSelectorState = (state: RootState): GlobalSettingsState['marketSelectorActive'] =>
    state.public.globalSettings.marketSelectorActive;

export const selectMobileDeviceState = (state: RootState): GlobalSettingsState['isMobileDevice'] =>
    state.public.globalSettings.isMobileDevice;

export const selectApplyWindowEnvsTriggerState = (state: RootState): GlobalSettingsState['applyWindowEnvsTrigger'] =>
    state.public.globalSettings.applyWindowEnvsTrigger;

export const selectOrdersHideOtherPairsState = (state: RootState): GlobalSettingsState['ordersHideOtherPairs'] =>
    state.public.globalSettings.ordersHideOtherPairs;