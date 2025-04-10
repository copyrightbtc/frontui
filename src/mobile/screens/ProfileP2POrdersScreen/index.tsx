import * as React from 'react';
import {
    Subheader,
} from '../../components';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Pagination } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import {alertPush, p2pOrdersFetch, RootState, selectP2POrders, selectP2POrdersFetchLoading, selectP2POrdersFirstElemIndex, selectP2POrdersLastElemIndex, selectP2POrdersNextPageExists } from '../../../modules';
import { useP2POrdersFetch } from '../../../hooks';
import { useEffect, useState } from 'react';
import { copyToClipboard, localeDate } from '../../../helpers';
import { CopyIcon } from '../../../assets/images/invites/CopyIcon';
import { FilterIcon } from '../../../assets/images/FilterIcon';
import { FillSpinner } from "react-spinners-kit";
import { NoResultData } from 'src/components';

const ProfileP2POrdersScreenComponent: React.FC = () => {
  const { formatMessage } = useIntl();
  const history = useHistory();

  const [isFilters, setIsFilters] = React.useState(false); 
  const [side, setSide] = React.useState('all')
  const [state, setState] = React.useState('all')

  const p2pOrders = useSelector(selectP2POrders);
  const p2pOrdersFetching = useSelector(selectP2POrdersFetchLoading);
  const [currentP2POrdersPageIndex, setCurrentP2POrdersPageIndex] = React.useState(0);
  const p2pOrdersFirstElemIndex = useSelector((state: RootState) => selectP2POrdersFirstElemIndex(state, 25));
  const p2pOrdersLastElemIndex = useSelector((state: RootState) => selectP2POrdersLastElemIndex(state, 25));
  const p2pOrdersNextPageExists = useSelector(selectP2POrdersNextPageExists); 
  useP2POrdersFetch(currentP2POrdersPageIndex + 1, 25, 'all', 'all')

  const onClickP2POrdersPrevPage = () => {
    setCurrentP2POrdersPageIndex(currentP2POrdersPageIndex - 1);
  };

  const onClickP2POrdersNextPage = () => {
    setCurrentP2POrdersPageIndex(currentP2POrdersPageIndex + 1);
  };

  const [p2pOrdersData, setP2POrdersData] = useState(p2pOrders);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(p2pOrdersFetch({ page: 1, limit: 25 }));
  }, [dispatch]);

  useEffect(() => {
		setP2POrdersData(p2pOrders); 
	}, [p2pOrders]); 

  const copyTID = (tid: string) => {
    copyToClipboard(tid)
    dispatch(alertPush({ message: ['success.p2p_orders.copied.tid'], type: 'success'}))
  }

  function RoundNumber(n: string | number, precision: number): string {
    if (typeof n === 'string') return RoundNumber(Number(n), precision)
  
    return n.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })
  }

  // const renderTabs = () => {
  //   const tabs = ['Processing'];

  //   return (
  //     <div className="p2p-trades-screen-tab">
  //       {tabs.map((item, i) => (
  //         <div
  //           key={i}
  //           className={`p2p-trades-screen-tab-item ${tab === item ? 'p2p-trades-screen-tab-item-active' : ''}`}
  //           onClick={() => setTab(item)}
  //         >
  //           {item}
  //         </div>
  //       ))}
  //     </div>
  //   )
  // }

  // const renderProcessingTab = () => (
  //   <div>
  //     {!p2pOrdersFetching && (
  //       <div>
  //         {invitesData.map((invite, index) => (
  //           <div key={index} className='p2p-trades-screen-box-mobile'>
  //             <div className='p2p-trades-screen-box-mobile-date'>
  //               {invite.created_at}
  //             </div>
  //             <div className='p2p-trades-screen-box-mobile-row'>
  //               <div className='p2p-trades-screen-box-mobile-row-label'>{intl.formatMessage({ id: 'page.body.invite.email'})}:</div>
  //               <div className='p2p-trades-screen-box-mobile-row-value'>{invite.email}</div>
  //             </div>
  //             <div className='p2p-trades-screen-box-mobile-row'>
  //               <div className='p2p-trades-screen-box-mobile-row-label'>UID:</div>
  //               <div className='p2p-trades-screen-box-mobile-row-value'>{invite.uid}</div>
  //             </div>
  //             <div className='p2p-trades-screen-box-mobile-row'>
  //               <div className='p2p-trades-screen-box-mobile-row-label'>{intl.formatMessage({ id: 'page.body.invite.total'})}:</div>
  //               <div className='p2p-trades-screen-box-mobile-row-value'>{invite.total}</div>
  //             </div>
  //           </div>
  //         ))}
  //         <Pagination
  //             firstElemIndex={invitesFirstElemIndex}
  //             lastElemIndex={invitesLastElemIndex}
  //             page={currentInvitesPageIndex}
  //             nextPageExists={invitesNextPageExists}
  //             onClickPrevPage={onClickInvitesPrevPage}
  //             onClickNextPage={onClickInvitesNextPage}
  //         />
  //       </div>
  //     )}
  //   </div>
  // );

  const handleChangeSide = (value: string) => {
    setSide(value)
  }

  const handleChangeState = (value: string) => {
    setState(value)
  }

  const renderSideSelect = () => {
    return (
      <React.Fragment> 
        <select
          className="select-control"
          name="side"
          defaultValue={side}
          onChange={e => {handleChangeSide(e.target.value)}}
        >
          <option value="all">{formatMessage({id: 'page.body.p2p.orders.all_side'})}</option>
          <option value="buy">{formatMessage({id: 'page.body.p2p.orders.buy'})}</option>
          <option value="sell">{formatMessage({id: 'page.body.p2p.orders.sell'})}</option>
        </select>
      </React.Fragment>
    );
  }

  const renderStateSelect = () => {
    return (
      <React.Fragment> 
        <select
          className="select-control"
          name="state"
          defaultValue={state}
          onChange={e => {handleChangeState(e.target.value)}}
        >
          <option value="all">{formatMessage({id: 'page.body.p2p.orders.all_state'})}</option>
          <option value="pending">{formatMessage({id: 'page.body.p2p.orders.state.pending'})}</option>
          <option value="wait">{formatMessage({id: 'page.body.p2p.orders.state.wait'})}</option>
          <option value="complain">{formatMessage({id: 'page.body.p2p.orders.state.complain'})}</option>
          <option value="completed">{formatMessage({id: 'page.body.p2p.orders.state.completed'})}</option>
          <option value="cancel">{formatMessage({id: 'page.body.p2p.orders.state.cancel'})}</option>
          <option value="reject">{formatMessage({id: 'page.body.p2p.orders.state.reject'})}</option>
        </select>
      </React.Fragment>
    );
  }

  const onSearch = () => {
    dispatch(p2pOrdersFetch({
      page: 1,
      limit: 25,
      side: side === 'all' ? '' : side,
      state: state === 'all' ? '' : state,
    }));
  }

  const onRestForm = () => {
    setSide('all')
    setState('all')
    dispatch(p2pOrdersFetch({ page: 1, limit: 25 }));
  }

  const renderHead = () => (
    <React.Fragment> 
      <div className="p2p-trades-screen-filters"> 
        <div className="p2p-trades-screen-filters-item" onClick={() => setIsFilters(!isFilters)}> 
          <FilterIcon />
          <span>{formatMessage({id: 'page.mobile.orders.filtering.orders'})}</span>
          <div className="arrow_menu" />
        </div>
      </div>
     </React.Fragment>
  );

  const renderFilterBar = () => {
    return (
      <div className="mb-3 px-2">
        <div className="flex items-center mb-3">
          <div className='p2p-trades-screen-select flex-1 mr-2'>
            {renderSideSelect()}
          </div>
          <div className='p2p-trades-screen-select flex-1 ml-2'>
            {renderStateSelect()}
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="button search flex-1 mr-2"
            onClick={e => {
              e.preventDefault();
              onSearch();
            }}
          >
            {formatMessage({id: 'page.body.trade.header.markets.content.search' })}
          </button>
          <button 
            className="button reset flex-1 ml-2" 
            type="reset" 
            value="Reset" 
            onClick={onRestForm} 
          >
            {formatMessage({id: 'page.body.customization.actionButtons.reset' })}
          </button>
        </div>
      </div>
    )
  };

  const renderTable = () => {
    return (
      <div>
        {p2pOrdersData.map((p2pTrade, index) => (
          <div key={index} className='p2p-trades-screen-box-mobile'>
            <div className='p2p-trades-screen-box-mobile-row'>
              <div className='text-white'>
                <span className={`capitalize mr-1 ${p2pTrade.side === 'buy' ? 'text-buy': 'text-sell'}`}>{p2pTrade.side === 'buy' ? formatMessage({id: 'page.body.p2p.orders.buy'}) : formatMessage({id: 'page.body.p2p.orders.sell'})}</span>
                <span>{p2pTrade.coin_currency.toUpperCase()}</span>
              </div>
              <div className='capitalize p2p-trades-screen-box-mobile-state'>{formatMessage({id: `page.body.p2p.orders.state.${p2pTrade.state}`})}</div>
            </div>
            <div className='p2p-trades-screen-box-mobile-row'>
              <div className='p2p-trades-screen-box-mobile-row-label'>{formatMessage({id: 'page.body.p2p.orders.total'})}:</div>
              <div className='p2p-trades-screen-box-mobile-row-value'>{`${RoundNumber(Number(p2pTrade.amount) * Number(p2pTrade.price), 2)} ${p2pTrade.fiat_currency.toUpperCase()}`}</div>
            </div>
            <div className='p2p-trades-screen-box-mobile-row'>
              <div className='p2p-trades-screen-box-mobile-row-label'>{formatMessage({id: 'page.body.p2p.orders.price'})}:</div>
              <div className='p2p-trades-screen-box-mobile-row-value'>{`${RoundNumber(p2pTrade.price, 2)} ${p2pTrade.fiat_currency.toUpperCase()}`}</div>
            </div>
            <div className='p2p-trades-screen-box-mobile-row'>
              <div className='p2p-trades-screen-box-mobile-row-label'>{formatMessage({id: 'page.body.p2p.orders.amount'})}:</div>
              <div className='p2p-trades-screen-box-mobile-row-value'>{`${p2pTrade.amount} ${p2pTrade.coin_currency.toUpperCase()}`}</div>
            </div>
            <div className='p2p-trades-screen-box-mobile-row'>
              <div className='p2p-trades-screen-box-mobile-row-label'>TID:</div>
              <div className='p2p-trades-screen-box-mobile-row-value flex'>
                {p2pTrade.tid}
                <CopyIcon className='p2p-trades-screen-copy' onClick={() => copyTID(String(p2pTrade.tid))} />
              </div>
            </div>
            <div className='p2p-trades-screen-box-mobile-row'>
              <div className='p2p-trades-screen-box-mobile-row-label'>{localeDate(p2pTrade.created_at, 'fullDate')}</div>
              <div className="text-primary" onClick={() => history.push(`/p2p/trade/info/${p2pTrade.tid}`)}>
                {(p2pTrade.state === 'wait' || p2pTrade.state === 'pending') ? formatMessage({id: 'page.body.p2p.orders.trade'}) : formatMessage({id: 'page.body.p2p.orders.view'})}
              </div>
            </div>
          </div>
        ))}
        <Pagination
            firstElemIndex={p2pOrdersFirstElemIndex}
            lastElemIndex={p2pOrdersLastElemIndex}
            page={currentP2POrdersPageIndex}
            nextPageExists={p2pOrdersNextPageExists}
            onClickPrevPage={onClickP2POrdersPrevPage}
            onClickNextPage={onClickP2POrdersNextPage}
        />
      </div>
    )
  }

  const renderDoneTab = () => (
    <div className='p2p-trades-screen p2p-trades-screen-mobile'>
      <div> 
        {isFilters && renderFilterBar()}
      </div>
      {p2pOrdersFetching ? <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div> : p2pOrdersData.length > 0 ? renderTable() : <NoResultData />}
    </div>
  );

  return (
      <React.Fragment>
        <Subheader
          title={formatMessage({id: 'page.body.p2p.orders.title'})}
          onGoBack={() => history.push('/p2p')}
        />
        {renderHead()}
        {/* {renderTabs()} */}
        {renderDoneTab()}
      </React.Fragment>
  );
};

export const ProfileP2POrdersScreen = React.memo(ProfileP2POrdersScreenComponent);
