import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { compose } from 'redux';
import { Button } from '@mui/material';
import { ReadMoreIcon } from 'src/assets/images/ReadMoreIcon';
import { IntlProps } from '../../';
import { Decimal } from '../../components/Decimal';
import { IconButton } from '@mui/material';
import { LinkIconNew } from 'src/assets/images/LinkIconNew';
import { LoupeIcon } from 'src/assets/images/LoupeIcon';
import { CopyIcon } from 'src/assets/images/CopyIcon';
import { OverlayTrigger } from 'react-bootstrap';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { NoResultData } from 'src/components';
import { 
    localeDate,
    truncateMiddle,
    copyToClipboard,
 } from '../../helpers';
import {
    Currency,
    fetchHistory,
    resetHistory,
    RootState,
    selectCurrencies,
    selectCurrentPage,
    selectFirstElemIndex,
    selectHistory,
    selectHistoryLoading,
    selectLastElemIndex,
    selectNextPageExists,
    selectWallets,
    selectWithdrawSuccess,
    Wallet,
    WalletHistoryList,
    alertPush
} from '../../modules';
import { FailIcon } from './FailIcon';
import { SucceedIcon } from './SucceedIcon';
import { PendingIcon } from './PendingIcon';

export interface HistoryProps {
    label: string;
    type: string;
    currency: string;
}

export interface ReduxProps {
    currencies: Currency[];
    list: WalletHistoryList;
    wallets: Wallet[];
    fetching: boolean;
    page: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
    withdrawSuccess?: boolean;
}

interface DispatchProps {
    fetchHistory: typeof fetchHistory;
    resetHistory: typeof resetHistory;
    fetchSuccess: typeof alertPush;
}

const rowsPerPage = 10;

export type Props = HistoryProps & ReduxProps & DispatchProps & IntlProps;

const reFetchInterval = 5000; // In MS' (5000 = 5 seconds)

export class WalletTable extends React.Component<Props> {
    // Properties
    fetchIntervalId = null;

    public componentDidMount() {
        const { currency, type } = this.props;
        this.retrieveData();

        this.props.fetchHistory({ page: 0, currency, type, limit: 10 });

        // Set up the fetch interval
        this.setupInterval();
    }

    public componentWillReceiveProps(nextProps: Props) {
        const { currency, type } = this.props;

        if (nextProps.currency !== currency || nextProps.type !== type) {
            this.props.resetHistory();
            this.props.fetchHistory({ page: 0, currency: nextProps.currency, type, limit: rowsPerPage });
        }
    }

    public componentWillUnmount() {
        this.props.resetHistory();

        if (this.fetchIntervalId) {
            clearInterval(this.fetchIntervalId);
        }
    }

    private setupInterval = () => {
        const { currency, type } = this.props;

        this.fetchIntervalId = setInterval(() => {
            this.props.fetchHistory({ page: 0, currency, type, limit: 10 });
        }, reFetchInterval);
    };

    public render() {
        const { label, list, type } = this.props;
 
        return (
            <React.Fragment>
                <div className="wallets-coinpage__wrapper__footer__header">
                    <h3>{this.props.intl.formatMessage({ id: `page.body.history.recent.${label}` })}</h3>
                    {list.length > 0 &&
                    <Button
                        href={`${type === 'deposits' ? '/history/deposits-history' : '/history/withdraws-history'}`}
                        className="little-button blue"
                    >
                        {this.props.intl.formatMessage({id: `page.body.history.recent.more.${label}`})}
                        <ReadMoreIcon className='read-more'/>
                    </Button>}
                </div>
                <div className="table-main with-hover">
                    {this.getHeaders(label)}
                    {list.length > 0 ? <tbody>{this.retrieveData()}</tbody> : 
                        <div className="table-noresult">
                            <NoResultData title={this.props.intl.formatMessage({ id: `page.body.history.recent.no.${label}` })} />
                        </div>}
                </div>
            </React.Fragment>
        );
    }

    private getHeaders = (label: string) => {
        const {
            currency,
            wallets,
        } = this.props;
        const walletType = wallets.find(w => w.currency === currency) as Wallet;
        return (
            <React.Fragment>
                {walletType.type === 'fiat' ? 
                    <thead>
                        <tr> 
                            <th>{this.props.intl.formatMessage({ id: `page.body.history.${label}.header.date` })}</th>
                            <th>TID</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.currency' })}</th>
                            <th>{this.props.intl.formatMessage({ id: `page.body.history.${label}.header.amount` })}</th>
                            {this.props.type === 'withdraws' && <th>{this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.fee' })}</th>}
                            {this.props.type === 'withdraws' && <th>{this.props.intl.formatMessage({id: 'page.body.wallets.tabs.withdraw.content.totalamount' })}</th>}
                            <th className="right">{this.props.intl.formatMessage({ id: `page.body.history.${label}.header.status` })}</th>
                        </tr>
                    </thead> : 
                    <thead>
                        <tr> 
                            <th>{this.props.intl.formatMessage({ id: `page.body.history.${label}.header.date` })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.blockchain' })}</th>
                            <th>{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.currency' })}</th>
                            <th className="right">{this.props.intl.formatMessage({ id: `page.body.history.${label}.header.txid` })}</th>
                            <th>{this.props.intl.formatMessage({ id: `page.body.history.${label}.header.amount` })}</th>
                            {this.props.type === 'withdraws' && <th>{this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.fee' })}</th>}
                            {this.props.type === 'withdraws' && <th>{this.props.intl.formatMessage({id: 'page.body.wallets.tabs.withdraw.content.totalamount' })}</th>}
                            {this.props.type === 'deposits' && <th>{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.confirmations' })}</th>}
                            <th className="right">{this.props.intl.formatMessage({ id: `page.body.history.${label}.header.status` })}</th>
                        </tr>
                    </thead>
                }
            </React.Fragment>
        )
    };

    public copyTx = (txid?: string) => {
        copyToClipboard(txid);
        this.props.fetchSuccess({message: ['page.body.wallets.tabs.deposit.ccy.message.success.txid'], type: 'success'});
    };

    public copyAddress = (txid?: string, rid?: string) => {
        copyToClipboard(txid || rid);
        this.props.fetchSuccess({message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'});
    };

    private retrieveData = () => {
        const { type, list } = this.props;

        return [...list]
            .map(item => this.renderTableRow(type, item));
    };

    private renderTableRow = (list, item) => {
        const {
            currency,
            currencies,
            type,
            wallets,
        } = this.props;
        const { fixed } = wallets.find(w => w.currency === currency) || { fixed: 8 };

        if (!list.length) {
            return [[]];
        }
        const walletType = wallets.find(w => w.currency === currency) as Wallet;

        const blockchainRid = this.getBlockchainRid(currency, item.blockchain_key, item.rid);
        const blockchainTxid = this.getBlockchainLink(currency, item.blockchain_key, item.txid);
        const blockchainWidthTx = this.getBlockchainLink(currency, item.blockchain_key, item.blockchain_txid);
        const amount = 'amount' in item ? Number(item.amount) : Number(item.price) * Number(item.volume);
        const confirmations = type === 'deposits' && item.confirmations;
        const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
        
        const blockchainCurrency = itemCurrency?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === item.blockchain_key);
        const minConfirmations = blockchainCurrency?.min_confirmations;

        const state = 'state' in item && this.formatTxState(item.state);
        
        const confirms = `${confirmations == 'N/A' ? '--' : confirmations} ${this.props.intl.formatMessage({id: `page.body.history.deposit.content.status.of`})} ${minConfirmations} ${this.props.intl.formatMessage({id: `page.body.history.deposit.content.status.min`})}`;

        const popover = (  
            <div className="blocktip--popover"> 
                <div className="blocktip--popover__wrap"> 
                    <span>txID: {item.blockchain_txid}</span>
                    <span>{this.props.intl.formatMessage({id: 'page.body.history.deposit.header.txid.modal' })}</span>
                </div> 
            </div> 
        );

        return ( 
            <React.Fragment>
                {walletType.type === 'fiat' ? 
                    <tr>
                        <td>
                            <div className="date-split">
                                <div className="date">{localeDate(item.created_at, 'date')}</div>
                                <div className="time">{localeDate(item.created_at, 'time')}</div>
                            </div>
                        </td>
                        <td>
                            <div>{item.tid}</div>
                        </td>
                        <td>
                            <div className="coins-block">
                                <CryptoIcon className="crypto-icon" code={currency?.toUpperCase()} />
                                <span>{currency?.toUpperCase()}</span>
                            </div>
                        </td>
                        <td>
                            <Decimal key={item.blockchain_txid || item.rid} fixed={fixed} thousSep=",">{amount}</Decimal>
                        </td>
                        {type === 'withdraws' && <td>
                            <div><Decimal key={item.rid} fixed={fixed} thousSep=",">{item.fee}</Decimal></div>
                        </td>}
                        {type === 'withdraws' && <td>
                            <div><Decimal key={item.rid} fixed={fixed} thousSep=",">{Number(item.fee) + Number(amount)}</Decimal></div>
                        </td>}
                        <td className="right">
                            {state}
                        </td>
                    </tr> :
                    <tr>
                        <td>
                            <div className="date-split">
                                <div className="date">{localeDate(item.created_at, 'date')}</div>
                                <div className="time">{localeDate(item.created_at, 'time')}</div>
                            </div>
                        </td>
                        <td>
                            <div>{item.protocol?.toUpperCase()}</div>
                        </td>
                        <td>
                            <div className="coins-block">
                                <CryptoIcon className="crypto-icon" code={currency?.toUpperCase()} />
                                <span>{currency?.toUpperCase()}</span>
                            </div>
                        </td>
                        <td>
                            {type === 'withdraws' ? 
                            <div className="blockchainLink" key={item.rid || item.blockchain_txid}>
                                {truncateMiddle(item.rid, 24)}
                                <IconButton
                                    onClick={() => this.copyAddress(item.rid)}
                                    className="copy_button"
                                >
                                    <CopyIcon className="copy-iconprop"/> 
                                </IconButton>
                                <a href={blockchainRid} className="link" target="_blank" rel="noopener noreferrer">
                                    <LinkIconNew className='loupe-icon'/>
                                </a>
                                {item.state !== 'failed' ? <OverlayTrigger 
                                    placement="auto"
                                    delay={{ show: 200, hide: 200 }} 
                                    overlay={popover}>
                                    <a href={blockchainWidthTx} className="link" target="_blank" rel="noopener noreferrer">
                                        <LoupeIcon className='loupe-icon'/>
                                    </a>
                                </OverlayTrigger> : 
                                <a className="link dark" target="_blank" rel="noopener noreferrer">
                                    <LoupeIcon className='loupe-icon'/>
                                </a>}
                            </div> : 
                            <div className="blockchainLink" key={item.txid}>
                                {truncateMiddle(item.txid, 24)}
                                <IconButton
                                    onClick={() => this.copyTx(item.txid)}
                                    className="copy_button"
                                >
                                    <CopyIcon className="copy-iconprop"/> 
                                </IconButton>
                                <a href={blockchainTxid} className="link" target="_blank" rel="noopener noreferrer">
                                    <LinkIconNew className='loupe-icon'/>
                                </a>
                            </div>}
                        </td>
                        <td>
                            <Decimal key={item.blockchain_txid || item.rid} fixed={fixed} thousSep=",">{amount}</Decimal>
                        </td>
                        {type === 'withdraws' && <td>
                            <div><Decimal key={item.rid} fixed={fixed} thousSep=",">{item.fee}</Decimal></div>
                        </td>}
                        {type === 'withdraws' && <td>
                            <div><Decimal key={item.rid} fixed={fixed} thousSep=",">{Number(item.fee) + Number(amount)}</Decimal></div>
                        </td>}
                        {type === 'deposits' && <td>
                            <div>{confirmations > minConfirmations ? this.props.intl.formatMessage({id: 'page.body.history.deposit.content.status.reached' }) : confirms}</div>
                        </td>}
                        <td className="right">
                            {state}
                        </td>
                    </tr>
                }
            </React.Fragment>
        );
    };

    private getBlockchainLink = (currency: string, blockchainKey: string, txid?: string, rid?: string, blockchain_txid?: string) => {
        const { currencies } = this.props;
        const currencyInfo = currencies.find(c => c.id === currency);
        const blockchainCurrency = currencyInfo?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === blockchainKey);

        if (currencyInfo) {
            if (txid && blockchainCurrency?.explorer_transaction) {
                return blockchainCurrency.explorer_transaction.replace('#{txid}', txid);
            }
            if (blockchain_txid && blockchainCurrency?.explorer_transaction) {
                return blockchainCurrency.explorer_transaction.replace('#{txid}', blockchain_txid);
            }
            if (rid && blockchainCurrency?.explorer_address) {
                return blockchainCurrency.explorer_address.replace('#{address}', rid);
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


export const mapStateToProps = (state: RootState): ReduxProps => ({
    currencies: selectCurrencies(state),
    list: selectHistory(state),
    wallets: selectWallets(state),
    fetching: selectHistoryLoading(state),
    page: selectCurrentPage(state),
    firstElemIndex: selectFirstElemIndex(state, 10),
    lastElemIndex: selectLastElemIndex(state, 10),
    nextPageExists: selectNextPageExists(state, 10),
    withdrawSuccess: selectWithdrawSuccess(state),
});

export const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchHistory: params => dispatch(fetchHistory(params)),
        resetHistory: () => dispatch(resetHistory()),
        fetchSuccess: payload => dispatch(alertPush(payload)),
    });

export const WalletHistory = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
)(WalletTable) as any;
