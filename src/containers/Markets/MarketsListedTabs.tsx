import classnames from 'classnames';
import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Tabs } from '@mui/material';
import { injectIntl } from 'react-intl';
import { IntlProps } from '../../';
import {
    RootState,
    selectUserInfo,
    User,
} from '../../modules';
import {
    Market,
    selectMarkets,
} from '../../modules/public/markets';

interface ReduxProps {
    markets: Market[];
    user: User;
}

interface OwnProps {
    onSelect?: (value: string) => void;
}

interface State {
    selectedItem: number;
}

type Props = ReduxProps & OwnProps & IntlProps;

export class MarketsListedTabsComponent extends React.Component<Props, State> {

    public readonly state = {
        selectedItem: 0,
    };

    public constructor(props) {
        super(props);
    }

    public render() {
        return this.fastSearchButtons();
    }

    private fastSearchButtons = () => {
        const { markets, user: { role } } = this.props;
        let listOfQuote: string[] = [this.props.intl.formatMessage({ id: 'page.body.marketsTable.filter.all' })];
        if (markets.length > 0) {
            const data = role !== 'admin' && role !== 'superadmin' ? markets.filter(item => item && item.state !== 'hidden') : markets;

            listOfQuote = data.reduce(this.quoteCurrencies, listOfQuote);
        }

        return (
            <Tabs
                value={0}
                variant="scrollable"
                allowScrollButtonsMobile
                scrollButtons
                className='tabs-arrows'
                sx={{ '& .MuiTabs-indicator': { display: 'none' } }}
            >
                {listOfQuote.map(this.renderFastSearchButton)}
            </Tabs>
        );
    };

    private renderFastSearchButton = (item: string, index: number) => {
        const classname = classnames('tabs-button', {
            'tabs-button__active': this.state.selectedItem === index,
        });

        return (
            //tslint:disable-next-line
            <button
                key={index} 
                onClick={() => this.handleSelectButton(index)}
                className={classname}
            >
                {item}
            </button>
        );
    };

    private handleSelectButton = (index: number) => {
        this.setState({
            selectedItem: index,
        }, () => {
            if (this.props.onSelect) {
                const { markets } = this.props;
                let listOfQuote: string[] = ['ALL'];
                if (markets.length > 0) {
                    listOfQuote = markets.reduce(this.quoteCurrencies, listOfQuote);
                }
                this.props.onSelect(listOfQuote[this.state.selectedItem]);
            }
        });
    };

    private quoteCurrencies = (pV: string[], cV: Market) => {
        const [, quote] = cV.name.split('/');
        if (pV.indexOf(quote) === -1) {
            pV.push(quote);
        }

        return pV;
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    markets: selectMarkets(state),
    user: selectUserInfo(state),
});

//tslint:disable-next-line:no-any
export const MarketsListedTabs = compose(
    injectIntl,
    connect(mapStateToProps, {}),
)(MarketsListedTabsComponent) as any; // tslint:disable-line
