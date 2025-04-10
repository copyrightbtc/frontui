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
    toggleMarketSelector,
} from '../../modules';
import { resetLayouts } from '../../modules/public/gridLayout';
import { MarketsList } from './MarketsList';
import { MarketsTabs } from './MarketsTabs';

interface ReduxProps {
    currentMarket?: Market;
    isOpen: boolean;
}

interface DispatchProps {
    resetLayouts: typeof resetLayouts;
    toggleMarketSelector: typeof toggleMarketSelector;
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
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.filterList = this.filterList.bind(this);
    }

    public componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    public componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    private handleClickOutside(event) {
        const { isOpen, toggleMarketSelector } = this.props;
        if ( this.wrapperRef && !this.wrapperRef.current.contains(event.target) && isOpen ) {
            toggleMarketSelector();
          }
    }

    private wrapperRef;

    private handleInputFocus = () => {
      this.setState({ focusedInput: true });
    };
  
    private handleInputBlur = () => {
      this.setState({ focusedInput: false });
    };

    public render() {
        const { isOpen } = this.props;
        const { searchFieldValue, marketsTabsSelectedValue } = this.state;
 
        const listClassName = classnames('trading-markets-menu', {
            'trading-markets-menu__open': isOpen,
            'trading-markets-menu__close': !isOpen,
        });

        const wrapperClassName = classnames('trading-markets-menu-wrapper', {
            'acts': isOpen,
            'nonacts': !isOpen,
        });

        const { focusedInput } = this.state;

        const focusedClass = classnames('trading-markets-menu__search', {
            'trading-markets-menu__search__focused': focusedInput,
        });

        return (
            <div className={wrapperClassName}>
                <div ref={this.wrapperRef} className={listClassName}>
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
 
                    <MarketsTabs onSelect={this.marketsTabsSelectHandler}/>
                    <MarketsList search={searchFieldValue} currencyQuote={marketsTabsSelectedValue}/>
                </div>
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
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    toggleMarketSelector: () => dispatch(toggleMarketSelector()),
    resetLayouts: (payload) => dispatch(resetLayouts(payload))
});


export const ToolBar = injectIntl(connect(reduxProps, mapDispatchToProps)(ToolBarComponent)) as any
