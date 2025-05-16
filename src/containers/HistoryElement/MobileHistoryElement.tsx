import * as React from 'react';
import classnames from 'classnames';
import { FillSpinner } from "react-spinners-kit";
import { injectIntl } from 'react-intl';
import {connect, MapDispatchToPropsFunction} from 'react-redux';
import { compose } from 'redux';
import { IntlProps } from '../../';
import Accordion from 'react-bootstrap/Accordion';
import { MoreHoriz } from 'src/assets/images/MoreHoriz';
import { ArrowDownward } from 'src/assets/images/ArrowDownward';
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
import { DEFAULT_CCY_PRECISION } from '../../constants';
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

interface MobileHistoryProps {
    type: string;
    types: 'fiat' | 'coin';
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
 
type Props = MobileHistoryProps & ReduxProps & DispatchProps & IntlProps;

const paginationLimit = 15;

class MobileHistoryComponent extends React.Component<Props, HistoryState> {
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
            <div className={`mobile-history-page${list.length ? '' : ' mobile-history-page--empty'}`}>
                {list.length && !fetching ? this.renderFilterRow() : null}
                {fetching && <div className="spinner-loader-center fixed"><FillSpinner size={19} color="var(--color-accent)"/></div>}
                {list.length ? this.renderContent() : null}
                {!list.length && !fetching ? <NoResultData class="themes" /> : null}
            </div>
        );
    }

    private renderFilterRow = () => {
        const { type } = this.props;
        const today = new Date().toISOString().split('T')[0];

        return (
            <Accordion className='moreinfo-filters'>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        {this.props.intl.formatMessage({ id: 'page.body.profile.content.action.more.filters'})}
                        <ArrowDownward className="arrow" />
                    </Accordion.Header>
                    <Accordion.Body>
                    <div className="filter-elements">
                        <div className="filter-elements__top">
                            <div className="filter-cell__dates themes">
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
                                <em>|</em>
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
                        <div className="filter-elements__bottom">
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
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
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
        const { list, type, firstElemIndex, lastElemIndex, page, nextPageExists } = this.props;
        
        return (
            <React.Fragment>
                <div className="trade-orders-mobile__wrapper">
                    {this.retrieveData()}
                </div>
                {list.length > paginationLimit ?
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    page={page}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                /> : null}
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
                    <div className="filter-cell themes">
                         <DropdownFilter
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
                     <div className="filter-cell themes">
                         <DropdownFilter
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
                     <div className="filter-cell themes">
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
                        <div className="filter-cell themes">
                            <DropdownFilter
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
                        <div className="filter-cell themes">
                            <DropdownFilter
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
                        <div className="filter-cell themes">
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
                        <div className="filter-cell themes">
                            <DropdownFilter
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
                        <div className="filter-cell themes">
                            <DropdownFilter
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
            types
        } = this.props;
        switch (type) {
            case 'deposits': {
                const { amount, created_at, confirmations, currency, txid, protocol, tid } = item;

                const { fixed } = wallets.find(w => w.currency === currency) || { fixed: DEFAULT_CCY_PRECISION };

                const blockchainLink = this.getBlockchainLink(currency, txid);
                const wallet = wallets.find(obj => obj.currency === currency);
                const itemCurrency = currencies && currencies.find(cur => cur.id === currency);

                const blockchainCurrency = itemCurrency?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === item.blockchain_key);
                const minConfirmations = blockchainCurrency?.min_confirmations;
                
                const state = 'state' in item ? this.formatTxState(item.state) : '';

                const confirms = `${confirmations === 'N/A' ? '--' : confirmations} ${intl.formatMessage({id: `page.body.history.deposit.content.status.of`})} ${minConfirmations} ${intl.formatMessage({id: `page.body.history.deposit.content.status.min`})}`;

                return (
                    <div key={txid} className='mobile-history-funds__row'>
                        <div className='mobile-history-funds__row__top'>
                            <div className='cell'>
                                <div className='amount'>
                                    <CryptoIcon className="crypto-icon" code={currency && currency.toUpperCase()} />
                                    {wallet && parseFloat(Number(amount).toFixed(fixed))} {currency && currency?.toUpperCase()}
                                </div>
                                <div className='date'>
                                    {localeDate(created_at, 'date')}
                                    <span>{localeDate(created_at, 'time')}</span>
                                </div>
                            </div>
                            <div className='cell'>
                                {types === 'fiat' ? 
                                    <div className='confirmations'>{tid}</div> : 
                                    <div className='confirmations'>{confirmations > minConfirmations ? intl.formatMessage({id: 'page.body.history.deposit.content.status.reached' }) : confirms}</div>}
                                {state}
                            </div>
                        </div>
                        {types !== 'fiat' && 
                        <Accordion className='moreinfo-trades'>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    <MoreHoriz className="dotes" />
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className='mobile-history-funds__row__bottom'> 
                                        <div className='cell'>
                                            <div className='name'>TID</div>
                                            <div className='data'>{tid}</div>
                                        </div>
                                        <div className='cell'>
                                            <div className='name'>{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.blockchain' })}</div>
                                            <div className='data'>{protocol?.toUpperCase()}</div>
                                        </div>
                                        <div className='cell'>
                                            <div className='name'>txID</div>
                                            <div className='data'>
                                                <div className="blockchainLink" key={txid}>
                                                    {truncateMiddle(txid, 31)}
                                                    <IconButton
                                                        onClick={() => this.copyTx(txid)}
                                                        className="copy_button"
                                                    >
                                                        <CopyIcon className="copy-iconprop"/> 
                                                    </IconButton>
                                                    <a href={blockchainLink} className="link" target="_blank" rel="noopener noreferrer">
                                                        <LinkIconNew className='loupe-icon'/>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>}
                    </div>
                );
            }
            case 'withdraws': {
                const { created_at, currency, amount, fee, rid, protocol, blockchain_txid, tid, blockchain_key } = item;

                const { fixed } = wallets.find(w => w.currency === currency) || { fixed: DEFAULT_CCY_PRECISION };
                const totals = Number(fee) + Number(amount);
                const state = 'state' in item ? this.formatTxState(item.state) : '';
                const blockchainRid = this.getBlockchainRid(currency, blockchain_key, rid);
                const blockchainLinkTx = this.getBlockchainLink(currency, blockchain_txid);
                const wallet = wallets.find(obj => obj.currency === currency);

                return (
                    <div className='mobile-history-funds__row'>
                        <div className='mobile-history-funds__row__top'>
                            <div className='cell'>
                                <div className='amount'>
                                    <CryptoIcon className="crypto-icon" code={currency && currency.toUpperCase()} />
                                    {wallet && Number(amount)} {currency && currency?.toUpperCase()}
                                </div>
                                <div className='date'>
                                    {localeDate(created_at, 'date')}
                                    <span>{localeDate(created_at, 'time')}</span>
                                </div>
                            </div>
                            <div key={rid} className='cell'>
                                {state}
                            </div>
                        </div>
                        {types !== 'fiat' && 
                        <Accordion className='moreinfo-trades'>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    <MoreHoriz className="dotes" />
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className='mobile-history-funds__row__bottom'> 
                                        <div className='cell'>
                                            <div className='name'>{intl.formatMessage({ id: 'page.body.history.deposit.header.blockchain' })}</div>
                                            <div className='data'>{protocol?.toUpperCase()}</div>
                                        </div>
                                        <div className='cell'>
                                            <div className='name'>{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' })}</div>
                                            <div className='data'>{wallet && Number(fee)}</div>
                                        </div>
                                        <div className='cell'>
                                            <div className='name'>{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.totalamount' })}</div>
                                            <div className='data'>{wallet && totals}</div>
                                        </div>
                                        <div className='cell'>
                                            <div className='name'>{intl.formatMessage({ id: 'page.body.history.withdraw.header.address' })}</div>
                                            <div className='data'>
                                                <div className="blockchainLink" key={rid}>
                                                    {truncateMiddle(rid, 28)}
                                                    <IconButton
                                                        onClick={() => this.copyAddress(rid)}
                                                        className="copy_button"
                                                    >
                                                        <CopyIcon className="copy-iconprop"/> 
                                                    </IconButton>
                                                    <a href={blockchainRid} className="link" target="_blank" rel="noopener noreferrer">
                                                        <LinkIconNew className='loupe-icon'/>
                                                    </a>
                                                    {item.state !== 'failed' ? 
                                                        <a href={blockchainLinkTx} className="link" target="_blank" rel="noopener noreferrer">
                                                            <LoupeIcon className='loupe-icon'/>
                                                        </a> : 
                                                    <a className="link dark" target="_blank" rel="noopener noreferrer">
                                                        <LoupeIcon className='loupe-icon'/>
                                                    </a>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>}
                    </div>
                );
            }
            case 'trades': {
                const { id, created_at, side, market, price, amount, total, fee_amount, fee_currency } = item;
                const marketToDisplay = marketsData.find(m => m.id === market) ||
                    { name: '', price_precision: 0, amount_precision: 0 };
                const marketName = marketToDisplay ? marketToDisplay.name : market;
                const sideText = setTradesType(side).text.toLowerCase() ? intl.formatMessage({id: `page.body.history.trade.content.side.${setTradesType(side).text.toLowerCase()}`}) : '';
                const curMarket = this.props.marketsData.find(i => i.id === market);

                return (
                    <div key={id} className="trade-orders-mobile__order">
                        <div className="trade-orders-mobile__order__top trading">
                            <div key={id} className="order-block types">
                                <div className="cells" style={{ color: setTradesType(side).color }}>{sideText}</div>
                                <div className="cells">{this.makerTaker(item)}</div>
                            </div>
                            <div className="order-block">
                                <div className="cells name">
                                    {marketName.toUpperCase()}
                                </div>
                                <div className="cells trad">
                                    <span>{this.props.intl.formatMessage({ id: 'page.body.history.trade.header.amount'})}</span>
                                    <div className='numbers'>{parseFloat(Number(amount).toFixed(marketToDisplay.amount_precision))}</div>
                                </div>
                                <div className="cells trad">
                                    <span>{this.props.intl.formatMessage({ id: 'page.body.history.trade.header.price'})}</span>
                                    <div className='numbers'>{parseFloat(Number(price).toFixed(marketToDisplay.price_precision))}</div>
                                </div>
                            </div>
                            <div className="order-block">
                                <div className="cells dates">
                                    <div className="date">{localeDate(created_at, 'date')}</div>
                                    <div className="time">{localeDate(created_at, 'time')}</div>
                                </div>
                            </div>
                        </div>
                        <Accordion className='moreinfo-trades'>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    <MoreHoriz className="dotes" />
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="order-block__full">
                                        <span>{this.props.intl.formatMessage({ id: 'page.body.history.trade.header.total'})}</span>
                                        {parseFloat(Number(total).toFixed(marketToDisplay.price_precision))}&nbsp;{curMarket?.quote_unit?.toUpperCase()}
                                    </div>
                                    <div className="order-block__full">
                                        <span>{this.props.intl.formatMessage({ id: 'page.body.history.trade.header.fee'})}</span>
                                        {fee_amount}&nbsp;{fee_currency?.toUpperCase()}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                );
            }
           
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
            <div className="order-success-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.accepted' })}</span>
            </div>
        );

        const succeed = (
            <div className="order-success-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.succeed' })}</span>
            </div>
        );

        const submitted = (
            <div className="order-success-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.submitted' })}</span>
            </div>
        );

        const rejected = (
            <div className="order-danger-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.rejected' })}</span>
            </div>
        );

        const canceled = (
            <div className="order-danger-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.canceled' })}</span>
            </div>
        );

        const errored = (
            <div className="order-danger-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.history.deposit.content.status.errored' })}</span>
            </div>
        );
        
        const pending = (
            <div className="order-pending-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.pending' })}</span>
            </div>
        );

        const confirming = (
            <div className="order-pending-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.confirming' })}</span>
            </div>
        );

        const skipped = (
            <div className="order-danger-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.skipped' })}</span>
            </div>
        );

        const underReview = (
            <div className="order-pending-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.under_review' })}</span>
            </div>
        );

        const prepared = (
            <div className="order-pending-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.prepared' })}</span>
            </div>
        );

        const processing = (
            <div className="order-pending-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.processing' })}</span>
            </div>
        );

        const feeProcessing = (
            <div className="order-pending-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.history.deposit.content.status.fee_processing' })}</span>
            </div>
        );

        const feeCollected = (
            <div className="order-pending-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.history.deposit.content.status.fee_collected' })}</span>
            </div>
        );

        const failed = (
            <div className="order-danger-themes state-style">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.failed' })}</span>
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

export const MobileHistoryElement = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(MobileHistoryComponent) as any; // tslint:disable-line