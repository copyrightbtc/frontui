import * as React from 'react';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { compose } from 'redux';
import { IntlProps } from '../../index';
import { GridMenuIcon } from '../../assets/images/GridMenuIcon';
import { Button } from '@mui/material';
import {
    changeTabGridMode,
    RootState,
    selectCurrentTabGridMode
} from '../../modules';
import { FixedTab } from '../../components/FixedMenupanel';
import { TradeHeadiconOne } from '../../assets/images/customization/TradeHeadiconOne';
import { TradeHeadiconTwo } from '../../assets/images/customization/TradeHeadiconTwo';
import { TradeHeadiconThree } from '../../assets/images/customization/TradeHeadiconThree';


interface ReduxProps {
    tabGridMode: string;
}

interface DispatchProps {
    changeTabGridMode: typeof changeTabGridMode;
}

interface OwnProps {
    onLinkChange?: () => void;
}

type Props = OwnProps & ReduxProps & IntlProps & DispatchProps;

interface State {
    isActive: boolean,
}

class TabGridModeSwitcherComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isActive: false,
        }
    }

    private dropdownRef = React.createRef<HTMLInputElement>();

    componentDidMount(): void {
        document.addEventListener("mousedown", this.checkIfClickedOutside);
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousedown", this.checkIfClickedOutside);
    }

    private checkIfClickedOutside = (event: any) => {
        if (this.state.isActive && !this.dropdownRef.current?.contains(event.target)) {
            this.setState({ isActive: false });
        }
    };

    public render() {
        return (
            <React.Fragment>
                <Button
                    className='menunav-button'
                    onClick={this.handleGridTypeDropdownToggle}
                >
                    <GridMenuIcon />
                </Button>
                <div 
                    ref={this.dropdownRef} 
                    className={`grid-menu-panel${this.state.isActive ? " active" : ""}`}
                >
                    {this.tabPanelRender()}
                </div>
            </React.Fragment>
        );
    }

    private handleGridTypeDropdownToggle = () => { 
        this.setState((prevState) => ({
            ...prevState,
            isActive: !prevState.isActive,
        }));
    }

    private createOnTabChangeHandler = (index: number, tab: FixedTab) => {
        if (this.props.changeTabGridMode) {
            this.props.changeTabGridMode(index.toString()); 
            this.handleGridTypeDropdownToggle();
        }
    }

    private panels = [
        {
            content: null,
            label: this.props.intl.formatMessage({ id: "page.body.header.up.titles.trading.grid.advanced" }),
            icon: <TradeHeadiconOne />
        },
        {
            content: null,
            label: this.props.intl.formatMessage({ id: "page.body.header.up.titles.trading.grid.classic" }),
            icon: <TradeHeadiconTwo />
        },
        {
            content: null,
            label: this.props.intl.formatMessage({ id: "page.body.header.up.titles.trading.grid.responsive" }),
            icon: <TradeHeadiconThree />
        }
    ];

    private renderTabPanel = (tab: FixedTab, index: number) => {
        const { label, icon } = tab;

        const active = parseInt(this.props.tabGridMode) === index;
        const cn = classnames('grid-menu-panel__tabs', {
            'active': active,
        });

        return (
            <button
                className={cn}
                key={index}
                onClick={() => this.createOnTabChangeHandler(index, tab)}
                tabIndex={index}
            >
                {label}
                {icon}
            </button>
        );
    };

    private tabPanelRender = () => {
        return (
            <div className="grid-menu-panel__navigation" role="tablist">
                {this.panels.map(this.renderTabPanel)}
            </div>
        ); 
    } 
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        tabGridMode: selectCurrentTabGridMode(state),
    });

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeTabGridMode: payload => dispatch(changeTabGridMode(payload)),
    });

export const TabGridModeSwitcher = compose(
    injectIntl, connect(mapStateToProps, mapDispatchToProps),
)(TabGridModeSwitcherComponent) as any;
