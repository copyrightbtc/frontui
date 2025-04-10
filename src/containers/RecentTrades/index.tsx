import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { TabPanelUnderlines } from '../../components';
import {
    Market,
    PublicTrade,
    resetHistory,
    RootState,
    selectCurrentMarket,
    selectCurrentPrice,
    selectMobileDeviceState,
    selectUserLoggedIn,
    setCurrentPrice,
} from '../../modules';
import { recentTradesFetch, selectRecentTradesOfCurrentMarket } from '../../modules/public/recentTrades';
import { RecentTradesMarket } from './Market';
import { RecentTradesYours } from './Yours';

interface ReduxProps {
    recentTrades: PublicTrade[];
    currentMarket: Market | undefined;
    currentPrice: number | undefined;
    userLoggedIn: boolean;
    isMobileDevice: boolean;
}

interface DispatchProps {
    resetHistory: typeof resetHistory;
    tradesFetch: typeof recentTradesFetch;
    setCurrentPrice: typeof setCurrentPrice;
}

interface State {
    tab: string;
    index: number;
    disable: boolean;
}

export type RecentTradesProps = DispatchProps & ReduxProps & IntlProps;

class RecentTradesComponent extends React.Component<RecentTradesProps, State> {
    public state = { tab: 'market', index: 0, disable: false };

    public tabMapping = ['market', 'yours'];

    public componentWillUnmount() {
        this.props.resetHistory();
    }

    public shouldComponentUpdate(nextProps: RecentTradesProps, nextState: State) {
        const {
            recentTrades,
            isMobileDevice,
            currentMarket,
            userLoggedIn,
        } = this.props;
        const { tab, index, disable } = this.state;

        return (
            JSON.stringify(nextProps.recentTrades) !== JSON.stringify(recentTrades) ||
            nextProps.currentMarket?.id !== currentMarket?.id ||
            nextProps.isMobileDevice !== isMobileDevice ||
            nextProps.userLoggedIn !== userLoggedIn ||
            nextState.disable !== disable ||
            nextState.index !== index ||
            nextState.tab !== tab
        );
    }

    public render() {
        return (
            <div className="recent-trades">
                {this.renderContent()}
            </div>
        );
    }

    private renderContent = () => {
        const { recentTrades, userLoggedIn } = this.props;

        return userLoggedIn ?
        (
            <TabPanelUnderlines
                panels={this.renderTabs()}
                onTabChange={this.handleMakeRequest}
                currentTabIndex={this.state.index}
                tradeClass={true}
                themes={true} 
                borders={true}
            />
        ) : (
            <React.Fragment>
                <div className="grid-item__header">
                    {this.props.intl.formatMessage({id: 'page.body.trade.header.recentTrades'})}
                </div>
                <RecentTradesMarket recentTrades={recentTrades}/>
            </React.Fragment>
        );

    };

    private renderTabs = () => {
        const { tab, index } = this.state;
        const { recentTrades } = this.props;

        return [
            {
                content: tab === 'market' && index === 0 ? <RecentTradesMarket recentTrades={recentTrades} /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.market' }),
            },
            {
                content: tab === 'yours' ? <RecentTradesYours /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.yours' }),
            },
        ];
    };

    private handleMakeRequest = (index: number) => {
        if (this.state.tab === this.tabMapping[index]) {
            return;
        }

        this.setState({
            tab: this.tabMapping[index],
            index: index,
        });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    recentTrades: selectRecentTradesOfCurrentMarket(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
    userLoggedIn: selectUserLoggedIn(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    tradesFetch: market => dispatch(recentTradesFetch(market)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    resetHistory: () => dispatch(resetHistory()),
});

export const RecentTrades = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(RecentTradesComponent) as any; // tslint:disable-line
