import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
    AreaChart,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Area,
    XAxis,
    YAxis
} from 'recharts';

import { colors } from '../../constants';
import {
    selectCurrentMarket,
    selectLastRecentTrade,
    selectMarketTickers,
    Market,
    Ticker
} from '../../modules';

//import { convertRgbToHex, getStylesValueByKey } from '../../helpers';

export interface KeyValuePairMarketDepths {
    x: string | number;
    amt?: number;
    ask?: number;
    bid?: number;
    name?: string | number;
}

export interface TooltipColors {
    backgroundColor: string;
    color: string;
    border: string;
    fontSize: string;
}

// type TooltipPayloadProp = TooltipPayload & { payload?: TooltipPayload };

interface CustomToolTipProps {
    toolTipColors?: TooltipColors;
    active?: boolean;
    external: KeyValuePairMarketDepths[];
    payload?: any;
}

interface CustomActiveDotProps {
    stroke: string;
    strokeWidth: number;
    r: number;
    fill: string;
}

export interface MarketDepthsProps {
    /**
     * Additional class name for styling. By default element receives `market-depths`
     * class
     * @default empty
     */
    className?: string;
    /**
     * MarketDepths details data for building the plot
     */
    data: KeyValuePairMarketDepths[];
    /**
     * Defines colors of tooltip
     */
    toolTipColors?: TooltipColors;
    /**
     * Settings to be applied to a chart
     */
    settings?: MarketDepthsSettings;
    /**
     * If true, grid will be hidden
     * @default false
     */
    hideCartesianGrid?: boolean;
    /**
     * Defines interval of values that should be displayed on x-axis
     */
    intervalX?: number | 'preserveStartEnd' | 'preserveStart' | 'preserveEnd' | undefined;
    /**
     * Defines interval of values that should be displayed on y-axis
     */
    intervalY?: number | 'preserveStartEnd' | 'preserveStart' | 'preserveEnd' | undefined;
    /**
     * Orientation for y-axis
     * @default 'left'
     */
    orientation?: 'left' | 'right';
    /**
     * Chart type
     * @default 'step'
     */
    chartType?:
        | 'basis'
        | 'basisClosed'
        | 'basisOpen'
        | 'linear'
        | 'linearClosed'
        | 'natural'
        | 'monotoneX'
        | 'monotoneY'
        | 'monotone'
        | 'step'
        | 'stepBefore'
        | 'stepAfter';
    /**
     * Property for gradient of background of ask or bid
     * @default false
     */
    gradientHide?: boolean;
    /**
     * Current color theme mode
     *  @default 'dark'
     */
    colorTheme?: string;
}

export interface MarketDepthsSettings {
    /**
     * Defines what value should be displayed on x-axis
     */
    dataKeyX?: string;
    /**
     * Defines what value should be displayed on y-axis
     */
    dataKeyY?: string;
    /**
     * Defines whether tooltip is shown or nor
     * @default true
     */
    tooltip?: boolean;
    /**
     * Defines height of chart
     * @default 100%
     */
    height?: string;
    /**
     * Defines properties for active dot
     */
    activeDot?: CustomActiveDotProps;
}

 

const getColorSettings = (colorTheme?: string) => {
    if (colorTheme === 'light') {
        return {
            strokeAreaAskColor: colors.light.depth.strokeAreaAsk,
            strokeAreaBidColor: colors.light.depth.strokeAreaBid,
            strokeAxisColor: colors.light.depth.strokeAxis,
            strokeGridColor: 'transparent',
            fillAreaAskColor: colors.light.depth.fillAreaAsk,
            fillAreaBidColor: colors.light.depth.fillAreaBid,
            gridBackgroundStartColor: colors.light.depth.gridBackgroundStart,
            gridBackgroundEndColor: colors.light.depth.gridBackgroundEnd,
        };
    }

    return {
        strokeAreaAskColor: colors.light.depth.strokeAreaAsk,
        strokeAreaBidColor: colors.light.depth.strokeAreaBid,
        strokeAxisColor: '#e4e8ec', 
        strokeGridColor: 'transparent',
        fillAreaAskColor: colors.light.depth.fillAreaAsk,
        fillAreaBidColor: colors.light.depth.fillAreaBid,
        gridBackgroundStartColor: 'var(--rgb-background)',
        gridBackgroundEndColor: 'var(--rgb-background)',
    };
};

const CustomTooltip = (props: CustomToolTipProps) => {
    const defaultToolTipColors = {
        padding: '6px 12px',
        backgroundColor: 'var(--color-main-dark)',
        color: 'var(--color-dark)',
        border: 'none',
        boxShadow: 'var(--box-shadow-small)',
        borderRadius: 'var(--small-border-radius)',
        fontSize: '13px',
    };
    const { active, payload, external, toolTipColors = defaultToolTipColors } = props;
    const { backgroundColor, color, border, fontSize } = toolTipColors; 

    const currentMarket = useSelector(selectCurrentMarket);
    const lastRecentTrade = useSelector(selectLastRecentTrade);
    const marketTickers = useSelector(selectMarketTickers);

    const [askCurrency, bidCurrency] = [currentMarket.base_unit.toUpperCase(), currentMarket.quote_unit.toUpperCase()];
    
    let lastPrice = ''; 

    const getTickerValueLPrice = (currentMarket: Market, tickers: { [key: string]: Ticker }) => {
        const defaultTicker = {last: '0'};

        return tickers[currentMarket.id] || defaultTicker;
    };

    if (lastRecentTrade?.market === currentMarket.id) {
        lastPrice = lastRecentTrade.price;

    } else {
        const currentTicker = currentMarket && getTickerValueLPrice(currentMarket, marketTickers);
        lastPrice = currentTicker.last;
    } 

    const renderPayload = () => {
        if (!payload || !payload[0]) {
            return '';
        }

        const { value } = payload[0];

        const sumd = Number(100 - (Number(payload[0].payload.price) / Number(lastPrice)) * 100).toFixed(2);
         return (
            <div className="area-chart-tooltip__tooltip">
                <span><FormattedMessage id="page.body.trade.header.marketDepths.content.price" /> {payload[0].payload.price} ({sumd}%)</span>
                <span><FormattedMessage id="page.body.trade.header.marketDepths.content.volume" /> {payload[0].payload.volume} {askCurrency}</span>
                <span><FormattedMessage id="page.body.trade.header.marketDepths.content.cumulativeVolume" /> {value} {askCurrency}</span>
            </div> 
        );
    };

    if (active) {
        const style = {
            padding: '6px 12px',
            backgroundColor,
            border,
            color,
            fontSize,
            boxShadow: 'var(--box-shadow-small)',
        };
        const payloadData = payload && payload[0] ? payload[0].payload : null;
        const currData = payloadData
            ? external.find((entry: KeyValuePairMarketDepths) => entry.name === payloadData.name)
            : null;

        return (
            <div className="area-chart-tooltip" style={style}>
                {!currData ? renderPayload() : null}
                {currData ? renderPayload() : null}
            </div>
        );
    }

    return null;
};
 
/**
 * Component to display MarketDepths component.
 * It gives a visualization of demand or supply of a particular stock or commodity or a cryptocurrency.
 */
export class MarketDepths extends React.PureComponent<MarketDepthsProps> {
    public defaultSettings = {
        dataKeyX: 'ask',
        dataKeyY: 'bid',
        tooltip: true,
        height: '100%'
    };

    public render() {
        const {
            chartType,
            colorTheme,
            className,
            data,
            hideCartesianGrid,
            intervalX,
            intervalY,
            toolTipColors,
            settings = this.defaultSettings,
            orientation,
            gradientHide,
        } = this.props;
        const cx = classnames('market-depths__wrapper', className);
        const colorSettings = getColorSettings(colorTheme);

        return (
            <div className={cx}>
                <ResponsiveContainer width="100%" height={settings.height}>
                    <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 1 }}>
                        {this.defineGradient(colorSettings, gradientHide)}
                        {hideCartesianGrid ? null : (
                            <CartesianGrid
                                stroke={colorSettings.strokeGridColor}
                                strokeDasharray="1 1"
                                fill="url(#fillGrid)"
                            />
                        )} 
                        <XAxis
                            dataKey={settings.dataKeyX || 'ask'}
                            interval={intervalX || 'preserveStartEnd'}
                            stroke={colorSettings.strokeAxisColor}
                            axisLine={true}
                            tickLine={true}
                            style={{
                                fontSize: '12px', 
                            }}
                        />
                        <YAxis
                            orientation={orientation ? orientation : 'right'}
                            dataKey={settings.dataKeyY || 'bid'}
                            interval={intervalY || 'preserveStartEnd'}
                            stroke={colorSettings.strokeAxisColor} 
                            mirror={true}
                            axisLine={false}
                            tickLine={true}
                            style={{
                                fontSize: '13px',
                            }}
                        /> 
                        {settings.tooltip ? (
                            <Tooltip cursor={{ stroke: "var(--color-light-grey)", strokeDasharray: 4, strokeWidth: 1, opacity: .4 }} 
                                content={<CustomTooltip toolTipColors={toolTipColors} external={data} />} />
                        ) : null}
                        <Area
                            type={chartType ? chartType : 'step'}
                            dataKey="bid"
                            stroke={colorSettings.strokeAreaBidColor}
                            fill="url(#bidChartColor)"
                            activeDot={{fill: 'var(--color-success)', stroke: '#04af6280', strokeWidth: '10', r: 4}}
                        /> 
                        <Area
                            type={chartType ? chartType : 'step'}
                            dataKey="ask"
                            stroke={colorSettings.strokeAreaAskColor}
                            fill="url(#askChartColor)"
                            activeDot={{fill: 'var(--color-danger)', stroke: '#f8496080', strokeWidth: '10', r: 4}}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }

    public defineGradient = (colorSettings, value?: boolean) => {
        if (value) {
            return (
                <defs>
                    <linearGradient id="bidChartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor={colorSettings.fillAreaBidColor} />
                    </linearGradient>
                    <linearGradient id="askChartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor={colorSettings.fillAreaAskColor} />
                    </linearGradient>
                    <linearGradient id="fillGrid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colorSettings.gridBackgroundStartColor} stopOpacity={.2} />
                        <stop offset="95%" stopColor={colorSettings.gridBackgroundEndColor} stopOpacity={.1} />
                    </linearGradient>
                </defs>
            );
        }

        return (
            <defs>
                <linearGradient id="bidChartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorSettings.fillAreaBidColor} stopOpacity={.2} />
                    <stop offset="95%" stopColor={colorSettings.fillAreaBidColor} stopOpacity={.1} />
                </linearGradient>
                <linearGradient id="askChartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorSettings.fillAreaAskColor} stopOpacity={.2} />
                    <stop offset="95%" stopColor={colorSettings.fillAreaAskColor} stopOpacity={.1} />
                </linearGradient>
                <linearGradient id="fillGrid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorSettings.gridBackgroundStartColor} stopOpacity={.2} />
                    <stop offset="95%" stopColor={colorSettings.gridBackgroundEndColor} stopOpacity={.1} />
                </linearGradient>
            </defs>
        );
    };
}