/* eslint-disable */
import { ThemeName } from '../../charting_library/charting_library.min';
import { colors } from '../../constants';
import { convertRgbToHex, getStylesValueByKey } from '../../helpers';

export const customWidgetParams = {};

export const customWidgetOptions = (colorTheme?: string) => {
    if (colorTheme === 'light') {

        const primaryColor = convertRgbToHex(getStylesValueByKey(colors.dark.chart.primary));
        const upColor = convertRgbToHex(getStylesValueByKey(colors.dark.chart.up));
        const downColor = convertRgbToHex(getStylesValueByKey(colors.dark.chart.down));

        return ({
            toolbar_bg: primaryColor,
            loading_screen: {
                backgroundColor: primaryColor,
            },
            overrides: {
                ['symbolWatermarkProperties.color']: primaryColor,
                ['volumePaneSize']: 'iny',
                ['mainSeriesProperties.candleStyle.upColor']: upColor,
                ['mainSeriesProperties.candleStyle.downColor']: downColor,
                ['mainSeriesProperties.candleStyle.borderUpColor']: upColor,
                ['mainSeriesProperties.candleStyle.borderDownColor']: downColor,
                ['mainSeriesProperties.candleStyle.wickUpColor']: upColor,
                ['mainSeriesProperties.candleStyle.wickDownColor']: downColor,
                ['paneProperties.background']:  primaryColor,
                ['paneProperties.vertGridProperties.color']: colors.dark.chart.lines,
                ['paneProperties.vertGridProperties.style']: 1,
                ['paneProperties.horzGridProperties.color']: colors.light.chart.lines,
                ['paneProperties.horzGridProperties.style']: 1,
                ['paneProperties.crossHairProperties.color']: colors.light.chart.white,
                ['paneProperties.crossHairProperties.width']: 1,
                ['paneProperties.crossHairProperties.style']: 2,
                ['scalesProperties.backgroundColor']: primaryColor,
            },
            studies_overrides: {
                ['volume.volume.color.0']: downColor,
                ['volume.volume.color.1']: upColor,
            },
            theme: 'Light' as ThemeName,
        });
    }

    const primaryColor = convertRgbToHex(getStylesValueByKey(colors.dark.chart.primary));
    const upColor = convertRgbToHex(getStylesValueByKey(colors.dark.chart.up));
    const downColor = convertRgbToHex(getStylesValueByKey(colors.dark.chart.down));

    return ({
        toolbar_bg: primaryColor,
        loading_screen: {
            backgroundColor: primaryColor,
        },
        overrides: {
            ['symbolWatermarkProperties.color']: primaryColor,
            ['volumePaneSize']: 'iny',
            ['mainSeriesProperties.candleStyle.upColor']: upColor,
            ['mainSeriesProperties.candleStyle.downColor']: downColor,
            ['mainSeriesProperties.candleStyle.borderUpColor']: upColor,
            ['mainSeriesProperties.candleStyle.borderDownColor']: downColor,
            ['mainSeriesProperties.candleStyle.wickUpColor']: upColor,
            ['mainSeriesProperties.candleStyle.wickDownColor']: downColor,
            ['paneProperties.background']: primaryColor,
            ['paneProperties.vertGridProperties.color']: colors.dark.chart.lines,
            ['paneProperties.vertGridProperties.style']: 1,
            ['paneProperties.horzGridProperties.color']: colors.dark.chart.lines,
            ['paneProperties.horzGridProperties.style']: 1,
            ['paneProperties.crossHairProperties.color']: colors.dark.chart.white,
            ['paneProperties.crossHairProperties.width']: 1,
            ['paneProperties.crossHairProperties.style']: 2,
            ['scalesProperties.backgroundColor']: primaryColor,
        },
        studies_overrides: {
            ['volume.volume.color.0']: downColor,
            ['volume.volume.color.1']: upColor,
        },
        theme: 'Dark' as ThemeName,
    });
};
