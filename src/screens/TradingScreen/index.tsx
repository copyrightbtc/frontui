import React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { incrementalOrderBook } from '../../api';
import { Decimal } from '../../components/Decimal';
import { GridChildInterface, GridItem } from '../../components/GridItem';
import { Responsive, WidthProvider } from 'react-grid-layout'
import { FixedMenupanel } from '../../components';
import { TradeHeadiconOne } from '../../assets/images/customization/TradeHeadiconOne';
import { TradeHeadiconTwo } from '../../assets/images/customization/TradeHeadiconTwo';
import { TradeHeadiconThree } from '../../assets/images/customization/TradeHeadiconThree';
import {
    Charts,
    MarketsComponent,
    TradeOpenOrders,
    OrderBook,
    OrderComponent,
    RecentTrades,
    Header,
    HeaderTrading,
    ToolBar,
} from '../../containers';
import { HeaderEmpty } from '../../containers/Header/HeaderEmpty';
import { getUrlPart, setDocumentTitle } from '../../helpers';
import {
    RootState,
    selectCurrentMarket,
    selectMarketTickers,
    selectUserInfo,
    selectUserLoggedIn,
    selectCurrentTabGridMode,
    setCurrentMarket,
    setCurrentPrice,
    Ticker,
    User,
} from '../../modules';
import { GridLayoutState, saveLayouts, selectGridLayoutState } from '../../modules/public/gridLayout';
import { Market, marketsFetch, selectMarkets } from '../../modules/public/markets';
import { depthFetch } from '../../modules/public/orderBook';

const breakpoints = {
    lg: 1200,
    sm: 996,
    xss: 768, 
};

const cols = {
    xs: 24,
    md: 24,
    lg: 24,
    sm: 24,
    xss: 12, 
};

interface ReduxProps {
    currentMarket: Market | undefined;
    markets: Market[];
    user: User;
    userLoggedIn: boolean;
    rgl: GridLayoutState;
    tickers: {
        [pair: string]: Ticker,
    };
}

interface DispatchProps {
    depthFetch: typeof depthFetch;
    marketsFetch: typeof marketsFetch;
    setCurrentPrice: typeof setCurrentPrice;
    setCurrentMarket: typeof setCurrentMarket;
    saveLayouts: typeof saveLayouts;
}

interface StateProps {
    orderComponentResized: number;
    orderBookComponentResized: number;
}

const ResponsiveReactGridLayout = WidthProvider(Responsive);
type Props = DispatchProps & ReduxProps & RouteComponentProps & IntlProps;

const TradingWrapper = props => {
    const  [currentTabMode] = useSelector(selectCurrentTabGridMode);
    const { orderComponentResized, orderBookComponentResized, layouts, handleResize, handeDrag } = props;
    const children = React.useMemo(() => {
        const data = [
            {
                i: 1,
                render: () => <Header />,
            },
            {
                i: 2,
                render: () => <RecentTrades />,
            },
            {
                i: 3,
                render: () => <Charts />,
            },
            {
                i: 4,
                render: () => <OrderBook />,
            },
            {
                i: 5,
                render: () => <TradeOpenOrders />,
            },
            { 
                i: 6,
                render: () => <OrderComponent />,
            }, 
        ];

        return data.map((child: GridChildInterface) => (
            <div key={child.i}>
                <GridItem>{child.render ? child.render() : `Child Body ${child.i}`}</GridItem>
            </div>
        ));
    }, [orderComponentResized, orderBookComponentResized]);
 
    const children_two = React.useMemo(() => {
        return (
            <div className='trade-window-classic'>
                <div style={{gridArea: 'lefts'}}></div>
                <div className='react-grid-item orderbook'>
                    <div className='grid-item'>
                        <OrderBook />
                    </div>
                </div>
                <div className='react-grid-item chart'>
                    <div className='grid-item'>
                        <Charts />
                    </div>
                </div>
                <div className='react-grid-item subHeader'>
                    <div className='grid-item'>
                        <HeaderEmpty />
                    </div>
                </div>
                <div className='react-grid-item orderform'>
                    <div className='grid-item'>
                        <OrderComponent />
                    </div>
                </div>
                <div className='react-grid-item recenttrades'>
                    <div className='grid-item'>
                        <RecentTrades />
                    </div>
                </div>
                <div className='react-grid-item market'>
                    <div className='grid-item'>
                        <MarketsComponent />
                    </div>
                </div>
                <div className='react-grid-item openorders'>
                    <div className='grid-item'>
                        <TradeOpenOrders />
                    </div>
                </div>
                <div style={{gridArea: 'rights'}}></div>
            </div>
        );
    }, []);
    const children_three = React.useMemo(() => {
    
        return (
            <div className='trade-responsive-layout'>
                <div className='react-grid-item subHeader'>
                    <div className='grid-item'>
                        <Header />
                    </div>
                </div>
                <div className='react-grid-item chart'>
                    <div className='grid-item'>
                        <Charts />
                    </div>
                </div>
                <div className='react-grid-item orderbook'>
                    <div className='grid-item'>
                        <OrderBook />
                    </div>
                </div>
                <div className='react-grid-item recenttrades'>
                    <div className='grid-item'>
                        <RecentTrades />
                    </div>
                </div>
                <div className='react-grid-item orderform'>
                    <div className='grid-item'>
                        <OrderComponent />
                    </div>
                </div>
                <div className='react-grid-item openorders'>
                    <div className='grid-item'>
                        <TradeOpenOrders />
                    </div>
                </div>
            </div>
        );
    }, []);
 
    const renderTabs = () => [
        {
            content: currentTabMode === '0' ?         
            <ResponsiveReactGridLayout
                breakpoints={breakpoints}
                cols={cols}
                autoSize={true}
                draggableHandle={false}
                rowHeight={30}
                layouts={layouts}
                onLayoutChange={() => {return;}}
                margin={[1, 1]}
                onResize={handleResize}
                onDrag={handeDrag}
            >
            {children}
        </ResponsiveReactGridLayout> : null,
            label: '',
            icon: <TradeHeadiconOne />,
        },
        {
            content: currentTabMode === '1' ?        
            <React.Fragment>
                {children_two}
            </React.Fragment>

        : null,
            label: '',
            icon: <TradeHeadiconTwo />,
        },
        {
            content: currentTabMode === '2' ?        
            <React.Fragment>
                {children_three}
            </React.Fragment>
        : null,
            label: '',
            icon: <TradeHeadiconThree />,
        },
         
    ];

    return (
        <FixedMenupanel 
            panels={renderTabs()}
            currentTabIndex={parseInt(currentTabMode) || 0}
        />
    );
};

class Trading extends React.Component<Props, StateProps> {
    public readonly state = {
        orderComponentResized: 5,
        orderBookComponentResized: 5,
    };

    public componentDidMount() {
        setDocumentTitle('Trading');
        const { markets, currentMarket } = this.props;

        if (markets.length < 1) {
            this.props.marketsFetch();
        }

        if (currentMarket && !incrementalOrderBook()) {
            this.props.depthFetch(currentMarket);
        }
    }

    public componentWillUnmount() {
        this.props.setCurrentPrice(undefined);
    }

    public componentWillReceiveProps(nextProps) {
        const {
            history,
            markets,
            currentMarket,
            user: { role },
        } = this.props;

        if (markets.length !== nextProps.markets.length) {
            this.setMarketFromUrlIfExists(nextProps.markets);
        }

        if (nextProps.currentMarket) {
            const marketFromUrl = history.location.pathname.split('/');
            const marketNotMatched = nextProps.currentMarket.id !== marketFromUrl[marketFromUrl.length - 1];

            if (marketNotMatched && nextProps.currentMarket.state) {
                history.replace(`/trading/${nextProps.currentMarket.id}`);

                if (!incrementalOrderBook()) {
                  this.props.depthFetch(nextProps.currentMarket);
                }
            }
        }

        if (nextProps.currentMarket && nextProps.tickers) {
            this.setTradingTitle(nextProps.currentMarket, nextProps.tickers);
        }

        if (currentMarket?.id !== nextProps.currentMarket?.id && nextProps.currentMarket && role !== 'admin' && role !== 'superadmin') {
            const firstActiveMarket = markets.length && markets.find(item => item.state && item.state !== 'hidden');

            if (nextProps.currentMarket.state && nextProps.currentMarket.state === 'hidden') {
                history.replace(`/trading/${firstActiveMarket.id}`);

                this.props.setCurrentMarket(firstActiveMarket);

                if (!incrementalOrderBook()) {
                    this.props.depthFetch(nextProps.currentMarket);
                }
            }
        }
    }

    public render() {
        const { orderComponentResized, orderBookComponentResized } = this.state;
        const { rgl } = this.props;

        return (
            <div className="trading-screen">
                <HeaderTrading
                    showChartSettings={true}
                />
                <div className="trading-wrap">
                    <ToolBar/>
                    <TradingWrapper
                        layouts={rgl.layouts}
                        orderComponentResized={orderComponentResized}
                        orderBookComponentResized={orderBookComponentResized}
                        handleResize={this.handleResize}
                        handeDrag={this.handeDrag}
                    />
                </div>
            </div>
        );
    }

    private setMarketFromUrlIfExists = (markets: Market[]): void => {
        const urlMarket: string = getUrlPart(2, window.location.pathname);
        const market: Market | undefined = markets.find(item => item.id === urlMarket);

        if (market) {
            this.props.setCurrentMarket(market);
        }
    };

    private setTradingTitle = (market: Market, tickers: ReduxProps['tickers']) => {
        const tickerPrice = tickers[market.id] ? tickers[market.id].last : '0.0';
        document.title = `${Decimal.format(tickerPrice, market.price_precision, ',')} 
            | ${market.base_unit.toUpperCase()} ${market.quote_unit.toUpperCase()}
            | Sfor.Trade`;
    };

    private handleResize = (oldItem, newItem) => {
        switch (oldItem.i) {
            case '1':
                this.setState({
                    orderComponentResized: newItem.w,
                });
                break;
            case '3':
                this.setState({
                    orderBookComponentResized: newItem.w,
                });
                break;
            default:
                break;
        }
    };

    private handeDrag = (layout) => {
        for (const elem of layout) {
            if (elem.y < 0) {
                elem.y = 0;
            }
        }
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currentMarket: selectCurrentMarket(state),
    markets: selectMarkets(state),
    user: selectUserInfo(state),
    userLoggedIn: selectUserLoggedIn(state),
    rgl: selectGridLayoutState(state),
    tickers: selectMarketTickers(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    marketsFetch: () => dispatch(marketsFetch()),
    depthFetch: payload => dispatch(depthFetch(payload)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    setCurrentMarket: payload => dispatch(setCurrentMarket(payload)),
    saveLayouts: payload => dispatch(saveLayouts(payload)),
});

export const TradingScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(Trading) as React.ComponentClass;