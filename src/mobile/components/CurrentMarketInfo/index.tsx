import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { Decimal } from '../../../components';
import { DEFAULT_CCY_PRECISION, DEFAULT_PERCENTAGE_PRECISION } from '../../../constants';
import { MarketsComponent } from '../../../containers';
import { selectCurrentMarket, selectMarketTickers } from '../../../modules';
import { ChevronIcon } from '../../assets/images/ChevronIcon';
import { ModalMobile } from '../../components';

const defaultTicker = {
    amount: '0.0',
    last: '0.0',
    high: '0.0',
    open: '0.0',
    low: '0.0',
    price_change_percent: '+0.00%',
    volume: '0.0',
};

const CurrentMarketInfoComponent: React.FC = () => {
    const intl = useIntl();
    const currentMarket = useSelector(selectCurrentMarket);
    const tickers = useSelector(selectMarketTickers);
    const [isOpenMarketSelector, setOpenMarketSelector] = React.useState(false);

    const renderModalHeader = (
        <div className="mobile-modal__header">
            <div className="mobile-modal__header-title">
                {intl.formatMessage({ id: 'page.body.trade.header.markets.content.market' })}
            </div>
            <div className="mobile-modal__header-close" onClick={() => setOpenMarketSelector(false)}>
                <CloseIcon />
            </div>
        </div>
    );

    const currentMarketPricePrecision = currentMarket ? currentMarket.price_precision : DEFAULT_CCY_PRECISION;
    const currentMarketAmountPrecision = currentMarket ? currentMarket.amount_precision : DEFAULT_CCY_PRECISION;
    const currentMarketTicker = (currentMarket && tickers[currentMarket.id]) || defaultTicker;
    const currentMarketTickerChange = +(+currentMarketTicker.last - +currentMarketTicker.open).toFixed(currentMarketPricePrecision);
    const currentPriceClass = classnames('price', {
        'positive': (+currentMarketTickerChange || 0) >= 0,
        'negative': (+currentMarketTickerChange || 0) < 0,
    });
    const priceChanged = Number(currentMarketTicker.last) - Number(currentMarketTicker.open)
    const currentPricePercantage = classnames('percantage', {
        'positive': (+currentMarketTickerChange || 0) >= 0,
        'negative': (+currentMarketTickerChange || 0) < 0,
    });

    React.useEffect(() => {
        setOpenMarketSelector(false);
    }, [currentMarket]);
    
    const bidUnit = currentMarket && currentMarket.quote_unit.toUpperCase();
    const askUnit = currentMarket && currentMarket.base_unit.toUpperCase();

    return (
        <div className="mobile-market-info">
            <div className="mobile-market-info__left">
                <div className="mobile-market-info__selector" onClick={() => setOpenMarketSelector(!isOpenMarketSelector)}>
                    <h1>{currentMarket ? currentMarket.name : ''}</h1>
                    {isOpenMarketSelector ? (
                        <ChevronIcon className="arrow arrow__down" />
                    ) : (
                        <ChevronIcon className="arrow arrow__up" />
                    )}
                </div>
                <div className={currentPriceClass}>
                    {Decimal.format(currentMarketTicker.last, currentMarketPricePrecision, ',')}
                </div>
                <div className={currentPricePercantage}>
                    {Decimal.format(priceChanged, currentMarketPricePrecision, ',')}&#32; 
                    ({currentMarketTicker.price_change_percent?.charAt(0)}
                    {Decimal.format(currentMarketTicker.price_change_percent?.slice(1, -1), DEFAULT_PERCENTAGE_PRECISION, ',')}
                    %)
                </div>
            </div>
            <div className="mobile-market-info__right">
                <div className="mobile-market-info__right__tickerlist">
                    <div className="tickers" style={{gridArea: 'A'}}>
                        <span>{intl.formatMessage({id: 'page.body.trade.toolBar.highest'})}</span>
                        <div className="datas">
                            {Decimal.format(currentMarketTicker.high, currentMarketPricePrecision, ',')}
                        </div>
                    </div>
                    <div className="tickers" style={{gridArea: 'C'}}>
                        <span>{intl.formatMessage({id: 'page.body.trade.toolBar.lowest'})}</span>
                        <div className="datas">
                            {Decimal.format(currentMarketTicker.low, currentMarketPricePrecision, ',')}
                        </div>
                    </div>
                    <div className="tickers" style={{gridArea: 'B'}}>
                        <span>{intl.formatMessage({id: 'page.body.trade.toolBar.volume.s'})} ({askUnit})</span>
                        <div className="datas">
                            {Decimal.format(currentMarketTicker.amount, currentMarketAmountPrecision, ',')}
                        </div>
                    </div>
                    <div className="tickers" style={{gridArea: 'D'}}>
                        <span>{intl.formatMessage({id: 'page.body.trade.toolBar.volume.s'})} ({bidUnit})</span>
                        <div className="datas">
                            {Decimal.format(currentMarketTicker.volume, currentMarketPricePrecision, ',')}
                        </div>
                    </div>
                </div>
            </div> 
            <ModalMobile
                header={renderModalHeader}
                isOpen={isOpenMarketSelector}
                onClose={() => setOpenMarketSelector(!isOpenMarketSelector)}
                classNames='fullheight'
            > 
                <MarketsComponent /> 
            </ModalMobile>
        </div>
    );
};

export const CurrentMarketInfo = React.memo(CurrentMarketInfoComponent);
