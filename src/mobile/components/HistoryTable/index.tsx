import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';
import { IconButton } from '@mui/material';
import { LinkIconNew } from 'src/assets/images/LinkIconNew';
import { LoupeIcon } from 'src/assets/images/LoupeIcon';
import { CopyIcon } from 'src/assets/images/CopyIcon';
import { MoreHoriz } from 'src/assets/images/MoreHoriz';
import { useHistoryFetch, useWalletsFetch } from '../../../hooks';
import { Pagination, NoResultData } from '../../../components';
import { DEFAULT_CCY_PRECISION } from '../../../constants';
import { 
    localeDate,
    truncateMiddle,
    copyToClipboard,
 } from '../../../helpers';
import { 
    RootState, 
    selectCurrentPage, 
    selectLastElemIndex, 
    selectNextPageExists,
    alertPush,
    Wallet,
} from '../../../modules';
import { selectCurrencies } from '../../../modules/public/currencies';
import { selectFirstElemIndex, selectHistory } from '../../../modules/user/history';
import { selectWallets } from '../../../modules/user/wallets';


const DEFAULT_LIMIT = 10;

const HistoryTable = (props: any) => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = React.useState(0);
    const intl = useIntl();
    const page = useSelector(selectCurrentPage);
    const list = useSelector(selectHistory);
    const wallets = useSelector(selectWallets) || [];
    const currencies = useSelector(selectCurrencies);
    const firstElemIndex = useSelector((state: RootState) => selectFirstElemIndex(state, DEFAULT_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectLastElemIndex(state, DEFAULT_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectNextPageExists(state, DEFAULT_LIMIT));

    useWalletsFetch();
    useHistoryFetch({ type: props.type, currency: props.currency, limit: DEFAULT_LIMIT, page: currentPage }); 

    const onClickPrevPage = () => {
        setCurrentPage(Number(page) - 1);
    };
    const onClickNextPage = () => {
        setCurrentPage(Number(page) + 1);
    };

    const formatTxState = (tx: string) => {
        const accepted = (
            <div className="order-success-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.wallets.table.accepted' })}</span>
            </div>
        );

        const succeed = (
            <div className="order-success-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.wallets.table.succeed' })}</span>
            </div>
        );

        const submitted = (
            <div className="order-success-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.wallets.table.submitted' })}</span>
            </div>
        );

        const rejected = (
            <div className="order-danger-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.wallets.table.rejected' })}</span>
            </div>
        );

        const canceled = (
            <div className="order-danger-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.wallets.table.canceled' })}</span>
            </div>
        );

        const errored = (
            <div className="order-danger-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.errored' })}</span>
            </div>
        );
        
        const pending = (
            <div className="order-pending-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.wallets.table.pending' })}</span>
            </div>
        );

        const confirming = (
            <div className="order-pending-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.wallets.table.confirming' })}</span>
            </div>
        );

        const skipped = (
            <div className="order-danger-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.wallets.table.skipped' })}</span>
            </div>
        );

        const underReview = (
            <div className="order-pending-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.wallets.table.under_review' })}</span>
            </div>
        );

        const prepared = (
            <div className="order-pending-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.wallets.table.prepared' })}</span>
            </div>
        );

        const processing = (
            <div className="order-pending-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.wallets.table.processing' })}</span>
            </div>
        );

        const feeProcessing = (
            <div className="order-pending-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.fee_processing' })}</span>
            </div>
        );

        const feeCollected = (
            <div className="order-pending-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.fee_collected' })}</span>
            </div>
        );

        const failed = (
            <div className="order-danger-themes state-style">
                <span className="label">{intl.formatMessage({ id: 'page.body.wallets.table.failed' })}</span>
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

    const copyTx = (txid?: string) => {
        copyToClipboard(txid);
        dispatch(alertPush({message: ['page.body.wallets.tabs.deposit.ccy.message.success.txid'], type: 'success'}));
    };

    const copyAddress = (txid?: string, rid?: string) => {
        copyToClipboard(txid || rid);
        dispatch(alertPush({message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'}));
    };

    const getBlockchainLink = (currency: string, blockchainKey: string, txid?: string, rid?: string, blockchain_txid?: string) => {
        const currencyInfo = currencies && currencies.find(c => c.id === currency);
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
    };

    const getBlockchainRid = (currency: string, blockchainKey: string, rid: string) => {
        const currencyInfo = currencies && currencies.find(c => c.id === currency);
        const blockchainCurrency = currencyInfo?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === blockchainKey);

        if (currencyInfo) {
            if (rid && blockchainCurrency?.explorer_address) {
                return blockchainCurrency.explorer_address.replace('#{address}', rid);
            }
        }

        return '';
    };
 
    const renderTableRow = (item: any) => {
        const {
            currency,
            type,
        } = props;
        const { fixed } = wallets.find(w => w.currency === currency) || { fixed: DEFAULT_CCY_PRECISION };

        if (list.length === 0) {
            return [[]];
        }

        const walletType = wallets.find(w => w.currency === currency) as Wallet;

        const amount = 'amount' in item ? Number(item.amount) : Number(item.price) * Number(item.volume);
        
        const blockchainRid = getBlockchainRid(currency, item.blockchain_key, item.rid);
        const blockchainTxid = getBlockchainLink(currency, item.blockchain_key, item.txid);
        const blockchainWidthTx = getBlockchainLink(currency, item.blockchain_key, item.blockchain_txid);
        const confirmations = type === 'deposits' && item.confirmations;
        const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
        const blockchainCurrency = itemCurrency?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === item.blockchain_key);
        const minConfirmations = blockchainCurrency?.min_confirmations;

        const state = 'state' in item ? formatTxState(item.state) : '';
        const confirms = `${confirmations == 'N/A' ? '--' : confirmations} ${intl.formatMessage({id: `page.body.history.deposit.content.status.of`})} ${minConfirmations} ${intl.formatMessage({id: `page.body.history.deposit.content.status.min`})}`;

        return (
            <div className='mobile-history-funds__row'>
                <div className='mobile-history-funds__row__top'>
                    <div className='cell'>
                        <div className='amount' key={item.blockchain_txid || item.rid}>
                            {parseFloat(Number(amount).toFixed(fixed))} {currency.toUpperCase()}
                        </div>
                        <div className='date'>
                            {localeDate(item.created_at, 'date')}
                            <span>{localeDate(item.created_at, 'time')}</span>
                        </div>
                    </div>
                    <div className='cell'>
                        {walletType.type === 'fiat' ? 
                        <div className='confirmations'>{item.tid}</div> : 
                        type === 'deposits' && 
                            <div className='confirmations'>{confirmations > minConfirmations ? intl.formatMessage({id: 'page.body.history.deposit.content.status.reached' }) : confirms}</div>}
                        {state}
                    </div>
                </div>
                {walletType.type !== 'fiat' && 
                <Accordion className='moreinfo-trades'>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>
                            <MoreHoriz className="dotes" />
                        </Accordion.Header>
                        {type === 'deposits' ? 
                            <Accordion.Body>
                                <div className='mobile-history-funds__row__bottom'> 
                                    <div className='cell'>
                                        <div className='name'>TID</div>
                                        <div className='data'>{item.tid}</div>
                                    </div>
                                    <div className='cell'>
                                        <div className='name'>{intl.formatMessage({ id: 'page.body.history.deposit.header.blockchain' })}</div>
                                        <div className='data'>{item.protocol?.toUpperCase()}</div>
                                    </div>
                                    <div className='cell'>
                                        <div className='name'>txID</div>
                                        <div className='data'>
                                            <div className="blockchainLink" key={item.txid}>
                                                {truncateMiddle(item.txid, 31)}
                                                <IconButton
                                                    onClick={() => copyTx(item.txid)}
                                                    className="copy_button"
                                                >
                                                    <CopyIcon className="copy-iconprop"/> 
                                                </IconButton>
                                                <a href={blockchainTxid} className="link" target="_blank" rel="noopener noreferrer">
                                                    <LinkIconNew className='loupe-icon'/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Body> : 
                            <Accordion.Body>
                            <div className='mobile-history-funds__row__bottom'> 
                                <div className='cell'>
                                    <div className='name'>{intl.formatMessage({ id: 'page.body.history.deposit.header.blockchain' })}</div>
                                    <div className='data'>{item.protocol?.toUpperCase()}</div>
                                </div>
                                <div className='cell'>
                                    <div className='name'>{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' })}</div>
                                    <div className='data' key={item.rid}>{parseFloat(Number(item.fee).toFixed(fixed))} {currency.toUpperCase()}</div>
                                </div>
                                <div className='cell'>
                                    <div className='name'>{intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.totalamount' })}</div>
                                    <div className='data' key={item.rid}>{parseFloat(Number(Number(item.fee) + Number(amount)).toFixed(fixed))} {currency.toUpperCase()}</div>
                                </div>
                                <div className='cell'>
                                    <div className='name'>{intl.formatMessage({ id: 'page.body.history.withdraw.header.address' })}</div>
                                    <div className='data'>
                                        <div className="blockchainLink" key={item.rid || item.blockchain_txid}>
                                            {truncateMiddle(item.rid, 28)}
                                            <IconButton
                                                onClick={() => copyAddress(item.rid)}
                                                className="copy_button"
                                            >
                                                <CopyIcon className="copy-iconprop"/> 
                                            </IconButton>
                                            <a href={blockchainRid} className="link" target="_blank" rel="noopener noreferrer">
                                                <LinkIconNew className='loupe-icon'/>
                                            </a>
                                            {item.state !== 'failed' ? 
                                                <a href={blockchainWidthTx} className="link" target="_blank" rel="noopener noreferrer">
                                                    <LoupeIcon className='loupe-icon'/>
                                                </a> : 
                                            <a className="link dark" target="_blank" rel="noopener noreferrer">
                                                <LoupeIcon className='loupe-icon'/>
                                            </a>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Accordion.Body>}
                    </Accordion.Item>
                </Accordion>}
            </div>
        );
    };

    const tableData = (list) => {

        return [...list]
            .map(item => renderTableRow(item));
    };

    return (
        <div className="mobile-history-funds">
            {list.length > 0 ? tableData(list) 
             : <NoResultData title={props.type === 'deposits' ? 
                intl.formatMessage({ id: `page.body.history.recent.no.deposit.short` }) : 
                intl.formatMessage({ id: `page.body.history.recent.no.withdraw.short` }) } />}
            {list.length > DEFAULT_LIMIT && 
            <Pagination
                firstElemIndex={firstElemIndex}
                lastElemIndex={lastElemIndex}
                page={page}
                nextPageExists={nextPageExists}
                onClickPrevPage={onClickPrevPage}
                onClickNextPage={onClickNextPage}
            />}
        </div>
    );
};

export {
    HistoryTable,
};
