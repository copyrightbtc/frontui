import * as React from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Decimal } from '../../components/Decimal';
import { MarketDepths } from '../../components/MarketDepths';
import {
    selectChartRebuildState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectDepthAsks,
    selectDepthBids,
    selectOrderBookLoading,
} from '../../modules';

export const MarketDepthsComponent = () => {
    const asksItems = useSelector(selectDepthAsks);
    const bidsItems = useSelector(selectDepthBids);
    const colorTheme = useSelector(selectCurrentColorTheme);
    const currentMarket = useSelector(selectCurrentMarket);
    const loading = useSelector(selectOrderBookLoading);

    const settings = React.useMemo(() => {
        return {
              tooltip: true,
              dataKeyX: 'price',
              dataKeyY: 'cumulativeVolume',
        };
    }, []); 

    const tipLayout = ({ price, cumulativeVolume, cumulativePrice }) => {
        const [askCurrency, bidCurrency] = [currentMarket.base_unit.toUpperCase(), currentMarket.quote_unit.toUpperCase()];

        return (
            <div className="area-chart-tooltip__tooltip">
                <span><FormattedMessage id="page.body.trade.header.marketDepths.content.price" /> {parseFloat(Number(price).toFixed(currentMarket.price_precision))} {bidCurrency}</span>
                <span><FormattedMessage id="page.body.trade.header.marketDepths.content.volume" /> {parseFloat(Number(cumulativeVolume).toFixed(currentMarket.amount_precision))} {askCurrency}</span>
                <span><FormattedMessage id="page.body.trade.header.marketDepths.content.cumulativePrice" /> {parseFloat(Number(cumulativePrice).toFixed(currentMarket.price_precision))} {bidCurrency}</span>
            </div>
        );
    };

    const cumulative = (data, type) => {
        let cumulativeVolumeData = 0;
        let cumulativePriceData = 0;

        return data.map((item) => {
            const [price, volume] = item;
            const numberVolume = Decimal.format(volume, currentMarket.amount_precision);
            const numberPrice = Decimal.format(price, currentMarket.price_precision);

            cumulativeVolumeData = +numberVolume + cumulativeVolumeData;
            cumulativePriceData = cumulativePriceData + (+numberPrice * +numberVolume);

            return {
                [type]: parseFloat(Number(cumulativeVolumeData).toFixed(currentMarket.amount_precision)),
                cumulativePrice: parseFloat(Number(cumulativePriceData).toFixed(currentMarket.price_precision)),
                cumulativeVolume: parseFloat(Number(cumulativeVolumeData).toFixed(currentMarket.amount_precision)),
                volume: parseFloat(Number(+volume).toFixed(currentMarket.amount_precision)),
                price: parseFloat(Number(+numberPrice).toFixed(currentMarket.price_precision)),
                name: tipLayout({ price, cumulativePrice: cumulativePriceData, cumulativeVolume: cumulativeVolumeData }),
            };
        });
    };

    const convertToCumulative = (data, type) => {
        const cumulativeData = cumulative(data, type);

        return type === 'bid' ? cumulativeData.sort((a, b) => b.bid - a.bid) : cumulativeData.sort((a, b) => a.ask - b.ask);
    };

    const convertToDepthFormat = () => {
        const resultLength = asksItems.length > bidsItems.length ? bidsItems.length : asksItems.length;

        const asks = asksItems.slice(0, resultLength);
        const bids = bidsItems.slice(0, resultLength);

        const asksVolume = convertToCumulative(asks, 'ask');
        const bidsVolume = convertToCumulative(bids, 'bid');

        return [...bidsVolume, ...asksVolume];
    };

    const renderMarketDepths = () => {
        return (
            <MarketDepths
                settings={settings}
                data={convertToDepthFormat()}
                colorTheme={colorTheme}
            />
        );
    };

    if (loading) {
        return null;
    }

    return (
        <div className="market-depths">
            {renderMarketDepths()}
        </div>
    );
};
