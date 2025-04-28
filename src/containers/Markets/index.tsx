import * as React from 'react';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';
import { SearchIcon } from "../../assets/images/SearchIcon";
import { SearchFieldCloseIcon } from '../../assets/images/SearchFieldCloseIcon';
import {
    connect,
    MapStateToProps,
    MapDispatchToPropsFunction
} from 'react-redux';
import { IntlProps } from '../../';
import {
    Market,
    RootState,
    selectCurrentMarket,
    selectMarketSelectorState,
    selectMobileDeviceState
} from '../../modules';
import { resetLayouts } from '../../modules/public/gridLayout';
import { MarketsListed } from './MarketsListed';
import { MarketsListedTabs } from './MarketsListedTabs';

interface ReduxProps {
    currentMarket?: Market;
    isOpen: boolean;
    isMobile: boolean;
}

interface DispatchProps {
    resetLayouts: typeof resetLayouts;
}

interface State {
    searchFieldValue: string;
    marketsTabsSelectedValue: string;
    focusedInput: boolean;
}

type Props = DispatchProps & ReduxProps & IntlProps;

class ToolBarComponent extends React.Component<Props, State> {

    public readonly state = {
        searchFieldValue: '',
        marketsTabsSelectedValue: '',
        focusedInput: false
    };

    constructor(props) {
        super(props);

        this.filterList = this.filterList.bind(this);
    }

    private handleInputFocus = () => {
      this.setState({ focusedInput: true });
    };
  
    private handleInputBlur = () => {
      this.setState({ focusedInput: false });
    };

    public render() {
        const { searchFieldValue, marketsTabsSelectedValue } = this.state;
 
        const { focusedInput } = this.state;

        const focusedClass = classnames('trading-markets-menu__search', {
            'trading-markets-menu__search__focused': focusedInput,
        });

        return (
            <div className={`markets-list${this.props.isMobile ? ' markets-list__mobile' : ''}`}> 
                <div className={focusedClass}> 
                    <div className="icon">
                        <SearchIcon />
                    </div>
                    <input
                        type='text'
                        className="s-field"
                        onChange={this.filterList}
                        value={searchFieldValue}
                        onFocus={this.handleInputFocus}
                        onBlur={this.handleInputBlur}
                        placeholder={this.translate('page.body.trade.header.markets.content.search')}
                    />
                    <div className="s-close">
                        <SearchFieldCloseIcon onClick={e => this.filterListNull()} />
                    </div>
                </div>
                <MarketsListedTabs onSelect={this.marketsTabsSelectHandler}/>
                <MarketsListed search={searchFieldValue} currencyQuote={marketsTabsSelectedValue}/>
            </div>
        );
    }

    private filterList = e => {
        this.setState({
            searchFieldValue: e.target.value,
        });
    };

    private filterListNull = () => {
        this.setState({
            searchFieldValue: '',
        });
    };

    private marketsTabsSelectHandler = value => {
        this.setState({
            marketsTabsSelectedValue: value,
        });
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };
}

const reduxProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currentMarket: selectCurrentMarket(state),
    isOpen: selectMarketSelectorState(state),
    isMobile: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    resetLayouts: (payload) => dispatch(resetLayouts(payload))
});


export const MarketsComponent = injectIntl(connect(reduxProps, mapDispatchToProps)(ToolBarComponent)) as any
