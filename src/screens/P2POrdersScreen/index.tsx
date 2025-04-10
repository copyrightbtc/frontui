import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { useP2POrdersFetch } from '../../hooks';
import { setDocumentTitle } from '../../helpers';
import { useIntl } from "react-intl";
import { Pagination, DropdownFilter } from "../../components";
import { AdvertisementMenu, HeaderTrading } from "../../containers";
import { FillSpinner } from "react-spinners-kit";
import { copyToClipboard, localeDate } from "../../helpers";
import { CopyIcon } from 'src/assets/images/CopyIcon';
import { Button, IconButton } from '@mui/material';
import { ReadMoreIcon } from 'src/assets/images/ReadMoreIcon';
import { PlayIcon } from 'src/assets/images/PlayIcon';
import { useHistory } from "react-router";
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip, NoResultData, Decimal } from '../../components';
import { CryptoIcon } from '../../components/CryptoIcon';
import { 
  alertPush, 
  p2pOrdersFetch, 
  RootState, 
  selectP2POrders, 
  selectP2POrdersFetchLoading, 
  selectP2POrdersFirstElemIndex, 
  selectP2POrdersLastElemIndex, 
  selectP2POrdersNextPageExists,
} from "../../modules";

export const P2POrdersScreen = () => {
  const { formatMessage } = useIntl();
  useEffect(() => {
    setDocumentTitle(formatMessage({id: 'page.body.p2p.orders.title'}))
  }, []);
  const history = useHistory();

  const [side, setSide] = useState('all');
  const [state, setState] = useState('all');
  const paginationLimit = 25;

  const p2pOrders = useSelector(selectP2POrders);
  const p2pOrdersFetching = useSelector(selectP2POrdersFetchLoading);
  const [currentP2POrdersPageIndex, setCurrentP2POrdersPageIndex] = React.useState(0);
  const p2pOrdersFirstElemIndex = useSelector((state: RootState) => selectP2POrdersFirstElemIndex(state, paginationLimit));
  const p2pOrdersLastElemIndex = useSelector((state: RootState) => selectP2POrdersLastElemIndex(state, paginationLimit));
  const p2pOrdersNextPageExists = useSelector(selectP2POrdersNextPageExists); 
 
  useP2POrdersFetch(1, paginationLimit, 'all', 'all');

  const onClickP2POrdersPrevPage = () => {
    const page = currentP2POrdersPageIndex - 1
    setCurrentP2POrdersPageIndex(page);
    dispatch(p2pOrdersFetch({
      page: page + 1,
      limit: paginationLimit,
      side: side === 'all' ? '' : side,
      state: state === 'all' ? '' : state,
    }));
  };

  const onClickP2POrdersNextPage = () => {
    const page = currentP2POrdersPageIndex + 1
    setCurrentP2POrdersPageIndex(page);
    dispatch(p2pOrdersFetch({
      page: page + 1,
      limit: paginationLimit,
      side: side === 'all' ? '' : side,
      state: state === 'all' ? '' : state,
    }));
  };

  const [p2pOrdersData, setP2POrdersData] = useState(p2pOrders);

  const dispatch = useDispatch();

  useEffect(() => {
		setP2POrdersData(p2pOrders); 
	}, [p2pOrders]); 

  const renderP2PTradesPagination = () => {
		return (
      <React.Fragment> 
          <Pagination
            firstElemIndex={p2pOrdersFirstElemIndex}
            lastElemIndex={p2pOrdersLastElemIndex}
            page={currentP2POrdersPageIndex}
            nextPageExists={p2pOrdersNextPageExists}
            onClickPrevPage={onClickP2POrdersPrevPage}
            onClickNextPage={onClickP2POrdersNextPage}
          />
      </React.Fragment>
		);
	};

  function RoundNumber(n: string | number, precision: number): string {
    if (typeof n === 'string') return RoundNumber(Number(n), precision)
  
    return n.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })
  }

  const copyTID = (tid: string) => {
    copyToClipboard(tid)
    dispatch(alertPush({ message: ['success.p2p_orders.copied.tid'], type: 'success'}))
  }

  const optionsSideAll = formatMessage({id: 'page.body.p2p.orders.all'});
  const optionsSideBuy = formatMessage({id: 'page.body.p2p.orders.buy'});
  const optionsSideSell = formatMessage({id: 'page.body.p2p.orders.sell'});

  const optionsSide = [
    { value: 'all', label: optionsSideAll },
    { value: 'buy', label: optionsSideBuy },
    { value: 'sell', label: optionsSideSell },
  ];

  const optionsStateAll = formatMessage({id: 'page.body.p2p.orders.all'});
  const optionsStatePending = formatMessage({id: 'page.body.p2p.orders.state.pending'});
  const optionsStateWait = formatMessage({id: 'page.body.p2p.orders.state.wait'});
  const optionsStateComplain = formatMessage({id: 'page.body.p2p.orders.state.complain'});
  const optionsStateCompleted = formatMessage({id: 'page.body.p2p.orders.state.completed'});
  const optionsStateCancel = formatMessage({id: 'page.body.p2p.orders.state.cancel'});
  const optionsStateReject = formatMessage({id: 'page.body.p2p.orders.state.reject'});

  const optionsState = [
    { value: 'all', label: optionsStateAll },
    { value: 'pending', label: optionsStatePending },
    { value: 'wait', label: optionsStateWait },
    { value: 'complain', label: optionsStateComplain },
    { value: 'completed', label: optionsStateCompleted },
    { value: 'cancel', label: optionsStateCancel },
    { value: 'reject', label: optionsStateReject },
  ];

  const [selectedSide, setSelectedSide] = useState({ value: 'all', label: optionsSideAll });
  const [selectedState, setSelectedState] = useState({ value: 'all', label: optionsStateAll }); 

  const renderSideSelect = () => {
    return (
      <div className="filter-cell themes">
          <DropdownFilter
            isSearchable
            placeholder=''
            fixedWidth={200}
            options={optionsSide}
            value={selectedSide}
            onSelect={e => {
              if (e && e.value) {
                const selectedSide = optionsSide.filter(option => option.value === e.value)[0];
                setSelectedSide(selectedSide);
                setSide(e.value);
              } else {
                setSelectedSide({ value: 'all', label: optionsSideAll });
              }
            }}
            maxMenuHeight={200}
            suffix={formatMessage({id: 'page.body.p2p.orders.side'})}
            emptyTitle={formatMessage({id: 'search.options.empty'})}
          />
      </div>
    );
  }

  const renderStateSelect = () => {
    return (
        <div className="filter-cell themes">
          <DropdownFilter
            isSearchable
            placeholder=''
            fixedWidth={215}
            options={optionsState}
            value={selectedState}
            onSelect={e => {
              if (e && e.value) {
                const selectedState = optionsState.filter(option => option.value === e.value)[0];
                setSelectedState(selectedState);
                setState(e.value);
              } else {
                setSelectedState({ value: 'all', label: optionsStateAll });
              }
            }}
            maxMenuHeight={200}
            suffix={formatMessage({id: 'page.body.p2p.orders.state'})}
            emptyTitle={formatMessage({id: 'search.options.empty'})}
          />
      </div>
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
    setSide('all');
    setState('all');
    setSelectedSide({ value: 'all', label: optionsSideAll });
    setSelectedState({ value: 'all', label: optionsStateAll });
    dispatch(p2pOrdersFetch({
      page: 1,
      limit: 25,
    }));
  }

  const renderFilterMenu = () => {
    return (
      <div className="filter-elements">

        <div className="filter-elements__left">
            {renderSideSelect()}
            {renderStateSelect()}
        </div>
    
        <div className="filter-elements__right">
          <Button
              onClick={e => {
                e.preventDefault();
                onSearch();
              }}
              className="search-button themes"
          >
              {formatMessage({id: 'page.body.trade.header.markets.content.search' })}
          </Button>
          <Button
              onClick={onRestForm} 
              className="reset-button themes"
          >
              {formatMessage({id: 'page.body.customization.actionButtons.reset' })}
          </Button>
        </div>
      </div>
    )
  };

  const p2pOrderState = (state: string) => { 
    switch (state) {
      case 'pending':
        return (
            <span className="order-pending-themes">{formatMessage({id: `page.body.p2p.orders.state.${state}`})}</span>
        );
      case 'wait':
        return (
            <span className="order-pending-themes">{formatMessage({id: `page.body.p2p.orders.state.${state}`})}</span>
        );
      case 'complain':
        return (
            <span className="order-danger-themes">{formatMessage({id: `page.body.p2p.orders.state.${state}`})}</span>
        );
      case 'completed':
        return (
            <span className="order-success-themes">{formatMessage({id: `page.body.p2p.orders.state.${state}`})}</span>
        );
      case 'cancel':
        return (
            <span className="order-danger-themes">{formatMessage({id: `page.body.p2p.orders.state.${state}`})}</span>
        );
      case 'reject':
        return (
            <span className="order-danger-themes">{formatMessage({id: `page.body.p2p.orders.state.${state}`})}</span>
        );     
      default:
          return state;
    };
  };
 
  const renderTable = () => {
    return p2pOrdersData.length <= 0 ? (
      <NoResultData class="themes"/>
    ) : (
          <React.Fragment>
            <div className="table-main themes">
              <thead>
                <tr>
                  <th>{formatMessage({id: 'page.body.p2p.orders.side.date'})}</th>
                  <th>{formatMessage({id: 'page.body.p2p.orders.price'})}</th>
                  <th>{formatMessage({id: 'page.body.p2p.orders.side.fiat.crypto'})}</th>
                  <th>{formatMessage({id: 'page.body.p2p.orders.state'})}</th>
                  <th>{formatMessage({id: 'page.body.p2p.orders.counterparty'})}</th>
                  <th>{formatMessage({id: 'page.body.p2p.orders.tid'})}</th>
                  <th className="right">{formatMessage({id: 'page.body.p2p.orders.action'})}</th>
                </tr>
              </thead>
              <tbody>
                {p2pOrdersData.map((p2pTrade, i) => (
                  <tr key={i}> 
                      <td>
                        <div className="side-info">
                          <div className="coins-block">
                            <div className={`${p2pTrade.side === 'buy' ? 'text-buy' : 'text-sell'}`}>
                              {p2pTrade.side === 'buy' ? formatMessage({id: 'page.body.p2p.orders.buy'}) : 
                              formatMessage({id: 'page.body.p2p.orders.sell'})}
                            </div>
                            <CryptoIcon className="currency-icon" code={p2pTrade.coin_currency.toUpperCase()} />
                            <span>{p2pTrade.coin_currency.toUpperCase()}</span>
                          </div>
                          <div className="date-split">
                              <div className="date">{localeDate(p2pTrade.created_at, 'date')}</div>
                              <div className="time">{localeDate(p2pTrade.created_at, 'time')}</div>
                          </div>
                        </div>
                      </td>
                      <td>{`${RoundNumber(Number(p2pTrade.price), 2)} ${p2pTrade.fiat_currency.toUpperCase()}`}</td>
                      <td>
                        <div className="fiat-crypto">
                          <span>{`${p2pTrade.amount} ${p2pTrade.coin_currency.toUpperCase()}`}</span>
                          <span>{`${RoundNumber(Number(p2pTrade.price) * Number(p2pTrade.amount), 2)} ${p2pTrade.fiat_currency.toUpperCase()}`}</span>
                        </div>
                      </td>
                      <td>{p2pOrderState(p2pTrade.state)}</td>
                      <td>
                        <div className="counterparty">
                            <OverlayTrigger 
                                placement="auto"
                                delay={{ show: 250, hide: 300 }} 
                                overlay={<Tooltip className="themes" title={formatMessage({ id: "page.body.profile.username.viewdetails" })}/>}>
                                    <Link className="name" to={`/p2p/advertiser/${p2pTrade.maker?.uid}`}>{p2pTrade.maker?.username ?? formatMessage({ id: "page.body.profile.username.anonymous" })}</Link>
                            </OverlayTrigger> 
                        </div>
                      </td>
                      <td>
                        <div className="copy-field noborder">
                          <div className="copy-field__text">{p2pTrade.tid}</div> 
                          <IconButton
                              onClick={() => copyTID(String(p2pTrade.tid))}
                              className="copy_button"
                          >
                              <CopyIcon className="copy-iconprop"/>  
                          </IconButton>
                        </div>
                      </td>
                      <td className="right">
                        <Button 
                          className={`little-button ${(p2pTrade.state === 'wait' || p2pTrade.state === 'pending' || p2pTrade.state === 'complain') ? 'green' : 'blue'}`}
                          onClick={() => history.push(`/p2p/trade/${p2pTrade.tid}`)}
                        >
                          {(p2pTrade.state === 'wait' || p2pTrade.state === 'pending' || p2pTrade.state === 'complain') ? 
                            formatMessage({id: 'page.body.p2p.orders.trade'}) : 
                            formatMessage({id: 'page.body.p2p.orders.view'}
                          )}
                          {(p2pTrade.state === 'wait' || p2pTrade.state === 'pending' || p2pTrade.state === 'complain') ? 
                            <PlayIcon className='read-more'/> : 
                            <ReadMoreIcon className='read-more'/>
                          }
                        </Button>
                      </td> 
                  </tr>
                ))}
              </tbody>
            </div>
          {renderP2PTradesPagination()}
        </React.Fragment>  
    )
  }

  const renderP2POrders = () => {
    if (p2pOrdersFetching) return null

    return p2pOrdersFetching ? (
			<div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div>
		) : renderTable()
  }

  return (
    <div className="p2pscreen">
      <HeaderTrading />
      <AdvertisementMenu />

      <div className="p2pscreen__wrapper">
        <div className="p2porders-screen">
          <h2>{formatMessage({id: 'page.body.p2p.orders.title'})}</h2>
          {renderFilterMenu()}
          {renderP2POrders()}
        </div>
      </div>
    </div>
  )
}
