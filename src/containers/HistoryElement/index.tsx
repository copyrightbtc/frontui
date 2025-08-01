import * as React from 'react';
import classnames from 'classnames';
import { FillSpinner } from "react-spinners-kit";
import { injectIntl } from 'react-intl';
import {connect, MapDispatchToPropsFunction} from 'react-redux';
import { compose } from 'redux';
import { IntlProps } from '../../';
import DatePicker from 'react-date-picker';
import { Button, IconButton } from '@mui/material';
import { LoupeIcon } from 'src/assets/images/LoupeIcon';
import { LinkIconNew } from 'src/assets/images/LinkIconNew';
import { CopyIcon } from 'src/assets/images/CopyIcon';
import { SearchIcon } from '../../assets/images/SearchIcon';
import { SearchFieldCloseIcon } from '../../assets/images/SearchFieldCloseIcon';
import { CalendarIcon } from '../../assets/images/CalendarIcon';
import { Decimal, Pagination, NoResultData, DropdownFilter, Tooltip } from '../../components';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { ReloadIcon } from "src/assets/images/ReloadIcon";
import { OverlayTrigger } from 'react-bootstrap';
import {
    localeDate,
    setTradesType,
    truncateMiddle,
    copyToClipboard,
} from '../../helpers';
import {
    Currency,
    fetchHistory,
    Market,
    RootState,
    selectCurrencies,
    selectCurrentPage,
    selectFirstElemIndex,
    selectHistory,
    selectHistoryLoading,
    selectLastElemIndex,
    selectMarkets,
    selectNextPageExists,
    selectWallets,
    Wallet,
    WalletHistoryList,
    alertPush
} from '../../modules';
import { FailIcon } from '../Wallets/FailIcon';
import { SucceedIcon } from '../Wallets/SucceedIcon';
import { PendingIcon } from '../Wallets/PendingIcon';

interface HistoryProps {
    type: string;
}

interface ReduxProps {
    currencies: Currency[];
    marketsData: Market[];
    wallets: Wallet[];
    list: WalletHistoryList;
    fetching: boolean;
    page: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
}

interface DispatchProps {
    fetchHistory: typeof fetchHistory;
    fetchSuccess: typeof alertPush;
}

interface HistoryState {
    filters: {
        [key: string]: any
    };
    focusedInput: boolean;
}
 
type Props = HistoryProps & ReduxProps & DispatchProps & IntlProps;

const defaultMarket = {
    market: '',
    price_precision: 0,
    amount_precision: 0,
    quote_unit: '',
    base_unit: ''
};

const paginationLimit = 25;

class HistoryComponent extends React.Component<Props, HistoryState> {
    constructor(props: Props | Readonly<Props>) {
        super(props);
        this.state = {
            filters: {},
            focusedInput: false,
        }
    }
 
    public componentDidMount() {
        this.fetchData();
        this.retrieveData();
    }

    private fetchData = () => {
        const { type, page } = this.props;
        const { filters } = this.state;

        const fetchParams = {
            page: page || 0,
            limit: paginationLimit,
            type,
            ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
                if (key === 'time_from' || key === 'time_to') {
                    value = value ? new Date(value).getTime() / 1000 : undefined;
                }
                if (typeof value === 'object' && value['value']) {
                    value = value['value'];
                }
                return { ...acc, [key]: value };
            }, {}))
        };

        this.props.fetchHistory(fetchParams);
    };

    public render() {
        const { list, fetching } = this.props;

        return (
            <div className={`profile-history__wrapper ${list.length ? '' : 'profile-history__wrapper-empty'}`}>
                {this.renderFilterRow()}
                {fetching && <div className="spinner-loader-center fixed"><FillSpinner size={19} color="var(--accent)"/></div>}
                {list.length ? this.renderContent() : null}
                {!list.length && !fetching ? <NoResultData /> : null}
            </div>
        );
    }

    private renderFilterRow = () => {
        const { type } = this.props;
        const today = new Date().toISOString().split('T')[0];

        return (
            <div className="filter-elements">
                <div className="filter-elements__left">
                    <div className="filter-cell__dates">
                        <div className="cell-date">
                            <div className="suffix-date">{this.props.intl.formatMessage({ id: 'page.body.filters.dateFrom' })}</div>
                            <DatePicker
                                className="input-date"  
                                onChange={this.handleDateFrom}
                                value={this.state.filters?.time_from || ''}
                                maxDate = {new Date(this.state.filters?.time_to || new Date(today))}
                                format="dd-MM-y"
                                calendarIcon={<CalendarIcon />}
                                dayPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.dd' })}
                                monthPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.mm' })}
                                yearPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.yy' })}
                            />
                        </div>
                        <hr/>
                        <div className="cell-date">
                            <div className="suffix-date">{this.props.intl.formatMessage({ id: 'page.body.filters.dateTo' })}</div>
                            <DatePicker
                                className="input-date"  
                                onChange={this.handleDateTo}
                                value={this.state.filters?.time_to || ''}
                                minDate={new Date(this.state.filters?.time_from || null)}
                                maxDate={new Date(today)}
                                format="dd-MM-y"
                                calendarIcon={<CalendarIcon />}
                                dayPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.dd' })}
                                monthPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.mm' })}
                                yearPlaceholder={this.props.intl.formatMessage({ id: 'page.body.filters.yy' })}
                            />
                        </div>
                    </div>
                    {this.renderSearchtypes(type)}
                </div>
                <div className="filter-elements__right">
                    <Button 
                        className="search-button" 
                        onClick={this.handleSearch}
                    >
                        {this.props.intl.formatMessage({ id: 'page.body.filters.search' })}
                    </Button>
                    <Button 
                        className="reset-button" 
                        onClick={this.handleReset}
                    >
                        {this.props.intl.formatMessage({ id: 'page.body.filters.reset' })}
                    </Button>
                    {this.renderReloadtypes(type)}
                </div>
            </div>
        );
    }
 
    private handleDateFrom = (value: Date) => {
        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                time_from: value,
            },
        }));
    };
    private handleDateTo = (value: Date) => {
        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                time_to: value,
            },
        }));
    };
    
    private selectDropdownItem = (key: string, option: {
        label: string;
        value: string;
    }) => {
        this.setState({
            filters: {
                ...this.state.filters,
                [key]: option
            }
        });
    }

    private setSearchKeyword = (key: string, value: string) => {
        this.setState({
            filters: {
                ...this.state.filters,
                [key]: value
            }
        })
    }

    private setSearchSide = (option: {
        label: string;
        value: string;
    }) => {
        this.setState({
            filters: {
                ...this.state.filters,
                sides: option
            }
        });
    }

    private handleSearch = () => {
        const { filters } = this.state;
        const filterParams = {
            page: 0,
            type: this.props.type,
            limit: paginationLimit,
            state: filters.status && filters.status.value !== 'all' ? filters.status.value : undefined,
            currency: filters.currencys && filters.currencys.value !== 'all' ? filters.currencys.value : undefined,
            market: filters.marketes && filters.marketes.value !== 'all' ? filters.marketes.value : undefined,
            side: filters.sides && filters.sides.value !== 'all' ? filters.sides.value : undefined,
            ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
                if (key === 'time_from' || key === 'time_to') {
                    value = value ? new Date(value).getTime() / 1000 : undefined;
                }
                if (typeof value === 'object' && value['value']) {
                    value = value['value']
                }
                
                return { ...acc, [key]: value };
            }, {}))
        };
    
        this.props.fetchHistory(filterParams);
    };

    private handleReset = () => {
        this.setState({ filters: {} }, () => {
            const filterParams = {
                page: 0,
                type: this.props.type,
                limit: paginationLimit,
            };
            this.props.fetchHistory(filterParams);
        });
    };


    public renderContent = () => {
        const { type, firstElemIndex, lastElemIndex, page, nextPageExists } = this.props;

        return (
            <React.Fragment>
                <div className="table-main with-hover">
                    {this.renderHeaders(type)}
                    <tbody>{this.retrieveData()}</tbody>
                </div>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    page={page}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                />
            </React.Fragment>
        );
    };

    private onClickPrevPage = () => {
        const { page, type } = this.props;
        const { filters } = this.state;

        this.props.fetchHistory({
            page: Number(page) - 1,
            type,
            limit: paginationLimit,
            state: filters.status && filters.status.value !== 'all' ? filters.status.value : undefined,
            currency: filters.currencys && filters.currencys.value !== 'all' ? filters.currencys.value : undefined,
            market: filters.marketes && filters.marketes.value !== 'all' ? filters.marketes.value : undefined,
            side: filters.sides && filters.sides.value !== 'all' ? filters.sides.value : undefined,
            ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
                if (key === 'time_from' || key === 'time_to') {
                    value = value ? new Date(value).getTime() / 1000 : undefined;
                }
                if (typeof value === 'object' && value['value']) {
                    value = value['value']
                }
                
                return { ...acc, [key]: value };
            }, {}))
        });
    };

    private onClickNextPage = () => {
        const { page, type } = this.props;
        const { filters } = this.state;

        this.props.fetchHistory({
            page: Number(page) + 1,
            type,
            limit: paginationLimit,
            state: filters.status && filters.status.value !== 'all' ? filters.status.value : undefined,
            currency: filters.currencys && filters.currencys.value !== 'all' ? filters.currencys.value : undefined,
            market: filters.marketes && filters.marketes.value !== 'all' ? filters.marketes.value : undefined,
            side: filters.sides && filters.sides.value !== 'all' ? filters.sides.value : undefined,
            ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
                if (key === 'time_from' || key === 'time_to') {
                    value = value ? new Date(value).getTime() / 1000 : undefined;
                }
                if (typeof value === 'object' && value['value']) {
                    value = value['value']
                }
                
                return { ...acc, [key]: value };
            }, {}))
        });
    };

    private handleInputFocus = () => {
        this.setState({ focusedInput: true });
    };
  
    private handleInputBlur = () => {
      this.setState({ focusedInput: false });
    };

    private renderReloadtypes = (type: string) => {
        
        switch (type) {
            case 'deposits':
            case 'withdraws':
                return [
                    <div className="filter-elements__refresh">
                        <OverlayTrigger 
                            placement="top"
                            delay={{ show: 250, hide: 300 }} 
                            overlay={<Tooltip title="page.body.filters.reload.tolltip" />}>
                            <IconButton
                                onClick={() => this.fetchData()}
                                sx={{
                                    color: 'var(--success)',
                                    '&:hover': {
                                        color: 'var(--success)'
                                    }
                                }}
                            >
                                <div><ReloadIcon /></div>
                            </IconButton>
                        </OverlayTrigger>
                    </div>
                ];
            default:
                return [];
        }
    };

    private renderSearchtypes = (type: string) => {
        const { focusedInput } = this.state;

        const focusedClass = classnames('keyword-search-cell', {
            'focused': focusedInput,
        });
        
        switch (type) {
            case 'deposits':
                return [ 
                    <div className="filter-cell">
                         <DropdownFilter
                             fixedWidth={200}
                             maxMenuHeight={350}
                             placeholder=""
                             suffix={this.props.intl.formatMessage({ id: 'page.body.filters.status' })}
                             emptyTitle={this.props.intl.formatMessage({id: 'search.options.empty'})}
                             options={[
                                { value: 'all', label: this.props.intl.formatMessage({ id: 'page.body.filters.all' }) },
                                { value: 'submitted', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.submitted' }) },
                                { value: 'accepted', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.accepted' }) },
                                { value: 'canceled', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.canceled' }) },
                                { value: 'rejected', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.rejected' }) },
                                { value: 'collected', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.succeed' }) },
                                { value: 'skipped', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.skipped' }) },
                                { value: 'processing', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.processing' }) },
                                { value: 'fee_processing', label: this.props.intl.formatMessage({id: 'page.body.history.deposit.content.status.fee_processing' }) }
                             ]}
                             onSelect={value => this.selectDropdownItem('status', value)}
                             value={this.state.filters?.status || {
                                 value: 'all',
                                 label: this.props.intl.formatMessage({ id: 'page.body.filters.all' })
                             }}
                         />
                     </div>,
                     <div className="filter-cell">
                         <DropdownFilter
                             fixedWidth={200}
                             placeholder=""
                             suffix={this.props.intl.formatMessage({ id: 'page.body.filters.currency' })}
                             emptyTitle={this.props.intl.formatMessage({id: 'search.options.empty'})}
                             options={[
                                { value: 'all', label: this.props.intl.formatMessage({ id: 'page.body.filters.all' }) },
                                ...this.props.currencies.map(currency => ({
                                    value: currency.id,
                                    label: currency.id.toUpperCase()
                                })),
                             ]}
                             onSelect={value => this.selectDropdownItem('currencys', value)}
                             value={this.state.filters?.currencys || {
                                 value: 'all',
                                 label: this.props.intl.formatMessage({ id: 'page.body.filters.all' })
                             }}
                         />
                     </div>,
                     <div className="filter-cell">
                         <div className={focusedClass}>
                             <span className="keyword-search-cell__icon">
                                 <SearchIcon />
                             </span>
                             <input
                                 className='keyword-search-cell__input'
                                 onFocus={this.handleInputFocus}
                                 onBlur={this.handleInputBlur}
                                 placeholder={this.props.intl.formatMessage({ id: 'page.body.filters.txid' })}
                                 type='text'
                                 value={this.state.filters?.txid || ''}
                                 onChange={(e) => {
                                     this.setSearchKeyword('txid', e.target.value);
                                 }}
                             />
                             <span className="keyword-search-cell__cancel">
                                 <SearchFieldCloseIcon onClick={() => {
                                     this.setState({
                                         filters: {
                                             ...this.state.filters,
                                             'txid': ''
                                         }
                                     })
                                 }} />
                             </span>
                         </div>
                     </div>
                ];
                case 'withdraws':
                    return [ 
                        <div className="filter-cell">
                            <DropdownFilter
                                fixedWidth={200}
                                placeholder=""
                                suffix={this.props.intl.formatMessage({ id: 'page.body.filters.status' })}
                                emptyTitle={this.props.intl.formatMessage({id: 'search.options.empty'})}
                                options={[
                                    { value: 'all', label: this.props.intl.formatMessage({ id: 'page.body.filters.all' }) },
                                    { value: 'succeed', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.succeed' }) },
                                    { value: 'prepared', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.prepared' }) },
                                    { value: 'rejected', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.rejected' }) },
                                    { value: 'accepted', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.accepted' }) },
                                    { value: 'skipped', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.skipped' }) },
                                    { value: 'processing', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.processing' }) },
                                    { value: 'confirming', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.confirming' }) },
                                    { value: 'under_review', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.under_review' }) },
                                    { value: 'canceled', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.canceled' }) },
                                    { value: 'failed', label: this.props.intl.formatMessage({id: 'page.body.wallets.table.failed' }) },
                                    { value: 'errored', label: this.props.intl.formatMessage({id: 'page.body.history.deposit.content.status.errored' }) },
                                ]}
                                onSelect={value => this.selectDropdownItem('status', value)}
                                value={this.state.filters?.status || {
                                    value: 'all',
                                    label: this.props.intl.formatMessage({ id: 'page.body.filters.all' })
                                }}
                            />
                        </div>,
                        <div className="filter-cell">
                            <DropdownFilter
                                fixedWidth={200}
                                placeholder=""
                                suffix={this.props.intl.formatMessage({ id: 'page.body.filters.currency' })}
                                emptyTitle={this.props.intl.formatMessage({id: 'search.options.empty'})}
                                options={[
                                    { value: 'all', label: this.props.intl.formatMessage({ id: 'page.body.filters.all' }) },
                                    ...this.props.currencies.map(currency => ({
                                        value: currency.id,
                                        label: currency.id.toUpperCase()
                                    })),
                                ]}
                                onSelect={value => this.selectDropdownItem('currencys', value)}
                                value={this.state.filters?.currencys || {
                                    value: 'all',
                                    label: this.props.intl.formatMessage({ id: 'page.body.filters.all' })
                                }}
                            />
                        </div>,
                        <div className="filter-cell">
                            <div className={focusedClass}>
                                <span className="keyword-search-cell__icon">
                                    <SearchIcon />
                                </span>
                                <input
                                    className='keyword-search-cell__input'
                                    onFocus={this.handleInputFocus}
                                    onBlur={this.handleInputBlur}
                                    placeholder={this.props.intl.formatMessage({ id: 'page.body.filters.address' })}
                                    type='text'
                                    value={this.state.filters?.rid || ''}
                                    onChange={(e) => {
                                        this.setSearchKeyword('rid', e.target.value);
                                    }}
                                />
                                <span className="keyword-search-cell__cancel">
                                    <SearchFieldCloseIcon onClick={() => {
                                        this.setState({
                                            filters: {
                                                ...this.state.filters,
                                                'rid': ''
                                            }
                                        })
                                    }} />
                                </span>
                            </div>
                        </div>
                    ];
                case 'trades':
                    return [
                        <div className="filter-cell">
                            <DropdownFilter
                                fixedWidth={200}
                                placeholder=""
                                suffix={this.props.intl.formatMessage({ id: 'page.body.filters.side' })}
                                emptyTitle={this.props.intl.formatMessage({id: 'search.options.empty'})}
                                options={[
                                    { value: 'all', label: this.props.intl.formatMessage({ id: 'page.body.filters.all' }) },
                                    { value: 'buy', label: this.props.intl.formatMessage({id: 'page.body.openOrders.content.side.buy' }) },
                                    { value: 'sell', label: this.props.intl.formatMessage({id: 'page.body.openOrders.content.side.sell' }) }
                                ]}
                                onSelect={this.setSearchSide}
                                value={this.state.filters?.sides || {
                                    value: 'all',
                                    label: this.props.intl.formatMessage({ id: 'page.body.filters.all' })
                                }}
                            />
                        </div>,
                        <div className="filter-cell">
                            <DropdownFilter
                                fixedWidth={200}
                                placeholder=""
                                suffix={this.props.intl.formatMessage({ id: 'page.body.filters.market' })}
                                emptyTitle={this.props.intl.formatMessage({id: 'search.options.empty'})}
                                options={[
                                    { value: 'all', label: this.props.intl.formatMessage({ id: 'page.body.filters.all' }) },
                                    ...this.props.marketsData.map(marketData => ({
                                        value: marketData.id,
                                        label: marketData.name
                                    }))
                                ]}
                                onSelect={value => this.selectDropdownItem('marketes', value)}
                                value={this.state.filters?.marketes || {
                                    value: 'all',
                                    label: this.props.intl.formatMessage({ id: 'page.body.filters.all' })
                                }}
                            />
                        </div>
                    ]
            default:
                return [];
        }
    };

    private renderHeaders = (type: string) => {
        switch (type) {
            case 'deposits':
                return [
                    <thead>
                        <tr> 
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.date' })}</th>
                            <th>TID</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.blockchain' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.currency' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.amount' })}</th>
                            <th className="right">{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.txid' })}</th>
                            <th className="right">{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.confirmations' })}</th>
                            <th className="right">{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.status' })}</th>
                        </tr>
                    </thead>
                ];
            case 'withdraws':
                return [
                    <thead>
                        <tr>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.date' })}</th>
                            <th>TID</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.blockchain' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.currency' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.amount' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.fee' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.wallets.tabs.withdraw.content.totalamount' })}</th>
                            <th className="right">{this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.address' })}</th>
                            <th className="right">{this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.status' })}</th>
                        </tr>
                    </thead>
                ];
            case 'trades':
                return [
                    <thead>
                        <tr>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.trade.header.date' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.trade.header.pair' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.trade.header.side' })}</th>
                            <th className="right">{this.props.intl.formatMessage({id: 'page.body.history.trade.header.price' })}</th>
                            <th className="right">{this.props.intl.formatMessage({id: 'page.body.history.trade.header.amount' })}</th>
                            <th className="right">{this.props.intl.formatMessage({id: 'page.body.history.trade.header.fee' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.trade.header.role' })}</th>
                            <th className="right">{this.props.intl.formatMessage({id: 'page.body.history.trade.header.total' })}</th>
                        </tr>
                    </thead>
                ];
            /*case 'quick_exchange':
                return [
                    <thead>
                        <tr>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.quick.header.date' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.quick.header.amountGive' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.quick.header.currencyGive' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.quick.header.amountReceive' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.quick.header.currencyReceive' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.quick.header.status' })}</th>
                        </tr>
                    </thead>
                ];*/
          default:
              return [];
        }
    };


    private retrieveData = () => {
        const { type, list } = this.props;

        return [...list]
            .map(item => this.renderTableRow(type, item));
    };

    private renderTableRow = (type, item) => {
        const {
            currencies,
            intl,
            marketsData,
            wallets,
        } = this.props;
        switch (type) {
            case 'deposits': {
                const { amount, created_at, confirmations, currency, txid, protocol, tid } = item;
                const blockchainLink = this.getBlockchainLink(currency, txid);
                const wallet = wallets.find(obj => obj.currency === currency);
                const itemCurrency = currencies && currencies.find(cur => cur.id === currency);

                const blockchainCurrency = itemCurrency?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === item.blockchain_key);
                const minConfirmations = blockchainCurrency?.min_confirmations;
                
                const state = 'state' in item ? this.formatTxState(item.state) : '';

                const confirms = `${confirmations === 'N/A' ? '--' : confirmations} ${intl.formatMessage({id: `page.body.history.deposit.content.status.of`})} ${minConfirmations} ${intl.formatMessage({id: `page.body.history.deposit.content.status.min`})}`;

                return [
                    <tr>
                        <td>
                            <div className="date-split">
                                <div className="date">{localeDate(created_at, 'date')}</div>
                                <div className="time">{localeDate(created_at, 'time')}</div>
                            </div>
                        </td>
                        <td>
                            <div>{tid}</div>
                        </td>
                        <td>
                            <div>{protocol?.toUpperCase()}</div>
                        </td>
                        <td>
                            <div className="coins-block">
                                <CryptoIcon className="crypto-icon" code={currency?.toUpperCase()} />
                                <span>{currency?.toUpperCase()}</span>
                            </div>
                        </td>
                        <td>
                            <div>{wallet && <Decimal fixed={wallet.fixed} thousSep=",">{amount}</Decimal>}</div>
                        </td>
                        <td className="right">
                            <div className="blockchainLink" key={txid}>
                                {truncateMiddle(txid, 40)} 
                                <IconButton
                                    onClick={() => this.copyTx(txid)}
                                    className="copy_button"
                                >
                                    <CopyIcon className="copy-iconprop"/> 
                                </IconButton>
                                <a href={blockchainLink} className="link" target="_blank" rel="noopener noreferrer">
                                    <LinkIconNew />
                                </a>
                            </div>
                        </td>
                        <td className="right">
                            <div>
                                {confirmations > minConfirmations ? this.props.intl.formatMessage({id: 'page.body.history.deposit.content.status.reached' }) : confirms}
                            </div>
                        </td>
                        <td className="right">
                            <div key={txid}>{state}</div>
                        </td>
                    </tr>
                ];
            }
            case 'withdraws': {
                const { created_at, currency, amount, fee, rid, protocol, blockchain_txid, tid, blockchain_key } = item;
                const state = 'state' in item && this.formatTxState(item.state);
                const blockchainRid = this.getBlockchainRid(currency, blockchain_key, rid);
                const blockchainLinkTx = this.getBlockchainLink(currency, blockchain_txid);
                const wallet = wallets.find(obj => obj.currency === currency);

                const popover = (  
                    <div className="blocktip--popover"> 
                        <div className="blocktip--popover__wrap"> 
                            <span>txID: {blockchain_txid}</span>
                            <span>{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.txid.modal' })}</span>
                        </div> 
                    </div> 
                );

                return [
                    <tr>
                        <td>
                            <div className="date-split">
                                <div className="date">{localeDate(created_at, 'date')}</div>
                                <div className="time">{localeDate(created_at, 'time')}</div>
                            </div>
                        </td>
                        <td>
                            <div>{tid}</div>
                        </td>
                        <td>
                            <div>{protocol?.toUpperCase()}</div>
                        </td>
                        <td>
                            <div className="coins-block">
                                <CryptoIcon className="crypto-icon" code={currency && currency.toUpperCase()} />
                                <span>{currency && currency.toUpperCase()}</span>
                            </div>
                        </td>
                        <td>
                            <div><Decimal fixed={wallet && wallet.fixed} thousSep=",">{Number(amount) - Number(fee)}</Decimal></div>
                        </td>
                        <td>
                            <div><Decimal fixed={wallet && wallet.fixed} thousSep=",">{fee}</Decimal></div>
                        </td>
                        <td>
                            <div><Decimal fixed={wallet && wallet.fixed} thousSep=",">{amount}</Decimal></div>
                        </td>
                        <td className="right">
                            <div className="blockchainLink" key={rid}>
                                {truncateMiddle(rid, 40)}
                                <div className="copy-field noborder">
                                    <IconButton
                                        onClick={() => this.copyAddress(rid)}
                                        className="copy_button"
                                    >
                                        <CopyIcon className="copy-iconprop"/>
                                    </IconButton>
                                </div>
                                <a href={blockchainRid} className="link" target="_blank" rel="noopener noreferrer">
                                    <LinkIconNew className='loupe-icon'/>
                                </a>
                                {item.state !== 'failed' ? <OverlayTrigger 
                                    placement="auto"
                                    delay={{ show: 200, hide: 200 }} 
                                    overlay={popover}>
                                    <a href={blockchainLinkTx} className="link" target="_blank" rel="noopener noreferrer">
                                        <LoupeIcon className='loupe-icon'/>
                                    </a>
                                </OverlayTrigger> : 
                                <a className="link dark" target="_blank" rel="noopener noreferrer">
                                    <LoupeIcon className='loupe-icon'/>
                                </a>}
                            </div>
                        </td>
                        <td className="right">
                            <div key={rid}>{state}</div>
                        </td>
                    </tr>
                ];
            }
            case 'trades': {
                const { id, created_at, side, market, price, amount, total, fee_amount, fee_currency } = item;
                const marketToDisplay = marketsData.find(m => m.id === market) ||
                    { name: '', price_precision: 0, amount_precision: 0 };
                const marketName = marketToDisplay ? marketToDisplay.name : market;
                const sideText = setTradesType(side).text.toLowerCase() ? intl.formatMessage({id: `page.body.history.trade.content.side.${setTradesType(side).text.toLowerCase()}`}) : '';
                const curMarket = this.props.marketsData.find(i => i.id === market);

                return [
                    <tr>
                        <td>
                            <div className="date-split">
                                <div className="date">{localeDate(created_at, 'date')}</div>
                                <div className="time">{localeDate(created_at, 'time')}</div>
                            </div>
                        </td>
                        <td>
                            <div>{marketName}</div>
                        </td>
                        <td>
                            <div style={{ color: setTradesType(side).color }} key={id}>{sideText}</div>
                        </td>
                        <td className="right">
                            <Decimal key={id} fixed={marketToDisplay.price_precision} thousSep=",">{price}</Decimal>
                        </td>
                        <td className="right">
                            <Decimal key={id} fixed={marketToDisplay.amount_precision} thousSep=",">{amount}</Decimal>
                        </td>
                        <td className="right">
                            <div key={id} className="feeamount">{fee_amount} <span>{fee_currency}</span></div>
                        </td>
                        <td>
                            <div key={id}>{this.makerTaker(item)}</div>
                        </td>
                        <td className="right">
                            <div className='coins-name'>
                                <Decimal key={id} fixed={marketToDisplay.price_precision} thousSep=",">{total}</Decimal>
                                <span>{curMarket?.quote_unit?.toUpperCase()}</span>
                            </div>
                        </td>
                    </tr>
                ];
            }
            /*case 'quick_exchange': {
                const { id, created_at, price, side, origin_volume, state, market } = item;
                const marketToDisplay = marketsData.find(m => m.id === market) || defaultMarket;

                let data;

                if (side === 'buy') {
                    data = {
                        amountGive: price * origin_volume,
                        amountReceive: origin_volume,
                        givePrecision: marketToDisplay.price_precision,
                        receivePrecision: marketToDisplay.amount_precision,
                        currencyGive: marketToDisplay.quote_unit.toUpperCase(),
                        currencyReceive: marketToDisplay.base_unit.toUpperCase(),
                    }
                } else {
                    data = {
                        amountGive: origin_volume,
                        amountReceive: price * origin_volume,
                        givePrecision: marketToDisplay.amount_precision,
                        receivePrecision: marketToDisplay.price_precision,
                        currencyGive: marketToDisplay.base_unit.toUpperCase(),
                        currencyReceive: marketToDisplay.quote_unit.toUpperCase(),
                    }
                }

                return [
                    <tr>
                        <td>
                            <div className="date-split">
                                <div className="date">{localeDate(created_at, 'date')}</div>
                                <div className="time">{localeDate(created_at, 'time')}</div>
                            </div>
                        </td>
                        <td>
                            <Decimal key={id} fixed={data.givePrecision} thousSep=",">{data.amountGive}</Decimal>
                        </td>
                        <td>
                            {data.currencyGive}
                        </td>
                        <td>
                            <Decimal key={id} fixed={data.receivePrecision} thousSep=",">{data.amountReceive}</Decimal>
                        </td>
                        <td>
                            {data.currencyReceive}
                        </td>
                        <td></td>
                    </tr>
                ];
            }*/
            default: {
                return [];
            }
        }
    };
 
    private makerTaker = (item) => {
        const { side, taker_type } = item;

        if (setTradesType(side).text.toLowerCase() === 'sell' && setTradesType(taker_type).text.toLowerCase() === 'sell') {
            return this.props.intl.formatMessage({id: 'page.body.history.trade.content.takertype.sell'});
        }
        if (setTradesType(side).text.toLowerCase() === 'buy' && setTradesType(taker_type).text.toLowerCase() === 'buy') {
            return this.props.intl.formatMessage({id: 'page.body.history.trade.content.takertype.sell'});
        }

        if (setTradesType(side).text.toLowerCase() === 'sell' && setTradesType(taker_type).text.toLowerCase() === 'buy') {
            return this.props.intl.formatMessage({id: 'page.body.history.trade.content.takertype.buy'});
        }
        if (setTradesType(side).text.toLowerCase() === 'buy' && setTradesType(taker_type).text.toLowerCase() === 'sell') {
            return this.props.intl.formatMessage({id: 'page.body.history.trade.content.takertype.buy'});
        }
    };

    public copyTx = (txid?: string) => {
        copyToClipboard(txid);
        this.props.fetchSuccess({message: ['page.body.wallets.tabs.deposit.ccy.message.success.txid'], type: 'success'});
    };

    public copyAddress = (txid?: string, rid?: string) => {
        copyToClipboard(txid || rid);
        this.props.fetchSuccess({message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'});
    };

    private getBlockchainLink = (currency: string, txid?: string, blockchainKey?: string, rid?: string, blockchain_txid?: string) => {
        const { wallets } = this.props;
        const currencyInfo = wallets.find(obj => obj.currency === currency);
        const blockchainCurrency = currencyInfo?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === blockchainKey);

        if (currencyInfo) {
            if (txid && blockchainCurrency?.explorerTransaction) {
                return blockchainCurrency.explorerTransaction.replace('#{txid}', txid);
            }
            if (rid && blockchainCurrency?.explorerAddress) {
                return blockchainCurrency.explorerAddress.replace('#{address}', rid);
            }
            if (blockchain_txid && blockchainCurrency?.explorerTransaction) {
                return blockchainCurrency.explorerTransaction.replace('#{txid}', blockchain_txid);
            }
        }

        return '';
    };

    private getBlockchainRid = (currency: string, blockchainKey: string, rid: string) => {
        const { currencies } = this.props;
        const currencyInfo = currencies.find(c => c.id === currency);
        const blockchainCurrency = currencyInfo?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === blockchainKey);

        if (currencyInfo) {
            if (rid && blockchainCurrency?.explorer_address) {
                return blockchainCurrency.explorer_address.replace('#{address}', rid);
            }
        }

        return '';
    };

    private formatTxState = (tx: string) => {
        const accepted = (
            <div className="order-success state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.accepted' })}</span><SucceedIcon />
            </div>
        );

        const succeed = (
            <div className="order-success state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.succeed' })}</span><SucceedIcon />
            </div>
        );

        const submitted = (
            <div className="order-success state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.submitted' })}</span><SucceedIcon />
            </div>
        );

        const rejected = (
            <div className="order-danger state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.rejected' })}</span><FailIcon />
            </div>
        );

        const canceled = (
            <div className="order-danger state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.canceled' })}</span><FailIcon />
            </div>
        );

        const errored = (
            <div className="order-danger state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.history.deposit.content.status.errored' })}</span><FailIcon />
            </div>
        );
        
        const pending = (
            <div className="order-pending state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.pending' })}</span><PendingIcon />
            </div>
        );

        const confirming = (
            <div className="order-pending state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.confirming' })}</span><PendingIcon />
            </div>
        );

        const skipped = (
            <div className="order-danger state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.skipped' })}</span><FailIcon />
            </div>
        );

        const underReview = (
            <div className="order-pending state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.under_review' })}</span><PendingIcon />
            </div>
        );

        const prepared = (
            <div className="order-pending state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.prepared' })}</span><PendingIcon />
            </div>
        );

        const processing = (
            <div className="order-pending state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.processing' })}</span><PendingIcon />
            </div>
        );

        const feeProcessing = (
            <div className="order-pending state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.history.deposit.content.status.fee_processing' })}</span><PendingIcon />
            </div>
        );

        const feeCollected = (
            <div className="order-pending state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.history.deposit.content.status.fee_collected' })}</span><PendingIcon />
            </div>
        );

        const failed = (
            <div className="order-danger state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.failed' })}</span><FailIcon />
            </div>
        );

        const statusMapping = {
            prepared: prepared,
            canceled: canceled,
            rejected: rejected,
            accepted: accepted,
            collected: succeed,
            skipped: skipped,
            processing: processing,
            fee_processing: feeProcessing,
            succeed: succeed,
            failed: failed,
            errored: errored,
            confirming: confirming,
            under_review: underReview,

            collecting: processing,
            fee_collecting: feeProcessing,
            fee_collected: feeCollected,
            pending: pending,
            submitted: submitted,
        };

        return statusMapping[tx];
    };
 
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currencies: selectCurrencies(state),
    marketsData: selectMarkets(state),
    wallets: selectWallets(state),
    list: selectHistory(state),
    fetching: selectHistoryLoading(state),
    page: selectCurrentPage(state),
    firstElemIndex: selectFirstElemIndex(state, paginationLimit),
    lastElemIndex: selectLastElemIndex(state, paginationLimit),
    nextPageExists: selectNextPageExists(state, paginationLimit),
});


export const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchHistory: params => dispatch(fetchHistory(params)),
        fetchSuccess: payload => dispatch(alertPush(payload)),
    });

export const HistoryElement = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(HistoryComponent) as any; // tslint:disable-line