import * as React from 'react';

import {
    Subheader,
} from '../../components';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { alertPush, p2pTradeApproveFetch, p2pTradeCancelFetch, p2pTradeComplainFetch, p2pTradeFeedbackFetch, selectP2PTrade, selectP2PTradeComplainFetchSuccess, selectP2PTradeFeedbackFetchSuccess, selectP2PTradeFetchLoading, selectP2PTradeFetchSuccess, selectP2PTradeUpdateSuccess, selectUserInfo } from '../../../modules';
import { useP2PTradeFetch } from '../../../hooks';
import { useEffect, useMemo } from 'react';
import moment from 'moment';
import { copyToClipboard, localeDate } from '../../../helpers';
import { ApproveP2PTrade, CancelP2PTrade, CreateComplain, CreateFeedBack, P2PTradeSuccess } from '../../../components';
import { CopyIcon } from '../../../assets/images/invites/CopyIcon';

const ProfileP2PTradeScreenComponent: React.FC = () => {
  const { formatMessage } = useIntl();
  const history = useHistory();

  const user = useSelector(selectUserInfo);

  const [p2pTradeSuccessModal, setP2PTradeSuccessModal] = React.useState(false)
  const [feedbackModal, setFeedbackModal] = React.useState(false)
  const [cancelModal, setCancelModal] = React.useState(false)
  const [approveModal, setApproveModal] = React.useState(false)
  const [complainModal, setComplainModal] = React.useState(false)
  const { tid = '' } = useParams<{ tid?: string }>();
  const [remainingTime, setRemainingTime] = React.useState(0);
  let timeInterval : NodeJS.Timeout

  const p2pTradeFeedbackFetchSuccess = useSelector(selectP2PTradeFeedbackFetchSuccess);
  const p2pTradeComplainFetchSuccess = useSelector(selectP2PTradeComplainFetchSuccess);

  const p2pTrade = useSelector(selectP2PTrade);
  const p2pTradeFetching = useSelector(selectP2PTradeFetchLoading);
  const p2pTradeFetchSuccess = useSelector(selectP2PTradeFetchSuccess);
  const p2pTradeUpdateSuccess = useSelector(selectP2PTradeUpdateSuccess);
  useP2PTradeFetch(tid)

  const side = useMemo(() => {
    if (!Object.keys(p2pTrade).length) return 'buy';
    return p2pTrade.taker.uid === user.uid ? p2pTrade.side : p2pTrade.side === 'buy' ? 'sell': 'buy'
  }, [p2pTrade])

  const isOvertime = useMemo(() => {
    const expiredAt = moment(p2pTrade.created_at).toDate()
    expiredAt.setMinutes(expiredAt.getMinutes() + p2pTrade.paytime)
    if (expiredAt > new Date()) return false
    return true
  }, [remainingTime, p2pTrade])
  const showCreateComplainButton = useMemo(() => {
    if (!Object.keys(p2pTrade).length) return false;
    if (p2pTrade.complain) return false;
    if (!isOvertime) return false;
    if (!p2pTrade.maker_accepted && !p2pTrade.taker_accepted) return false
    if (p2pTradeComplainFetchSuccess) return false
    return true
  }, [p2pTrade, isOvertime, p2pTradeComplainFetchSuccess])

  const disabledApproveButton = useMemo(() => {
    if (!Object.keys(p2pTrade).length) return true;
    if (side === "sell" && p2pTrade.maker.uid === user.uid && !p2pTrade.taker_accepted) return true
    if (side === "sell" && p2pTrade.taker.uid === user.uid && !p2pTrade.maker_accepted) return true
    if (p2pTrade.maker.uid === user.uid && p2pTrade.maker_accepted) return true
    if (p2pTrade.taker.uid === user.uid && p2pTrade.taker_accepted) return true
    return false
  }, [p2pTrade])

  const dispatch = useDispatch();
 
  useEffect(() => {
    if (p2pTrade.state && (p2pTrade.state === 'completed' || p2pTrade.state === 'cancel')) {
      clearInterval(timeInterval)
      return
    }

    const expiredAt = moment(p2pTrade.created_at).toDate()
    expiredAt.setMinutes(expiredAt.getMinutes() + p2pTrade.paytime)

    if (p2pTrade.created_at !== undefined && (remainingTime === 0 || expiredAt.getTime() - new Date().getTime() !== remainingTime)) {
      clearInterval(timeInterval)
  
      timeInterval = setInterval(() => {
        const time = remainingTime > 0 ? remainingTime : expiredAt.getTime() - new Date().getTime()
        if (time-1000 <= 1000) {
          clearDelay()
        }
        setRemainingTime(time - 1000)
      }, 1000)
    }
  }, [dispatch, p2pTrade])

  useEffect(() => {
    if (p2pTrade.state === 'completed' && p2pTradeUpdateSuccess) {
      toggleP2PTradeSuccessModal()
    }
  }, [p2pTrade])

  const copyTID = () => {
    copyToClipboard(String(p2pTrade.tid))
    dispatch(alertPush({ message: ['success.p2p_orders.copied.tid'], type: 'success' }))
  }

  const copy = (value: string) => {
    copyToClipboard(value)
    dispatch(alertPush({ message: ['success.p2p_orders.copied'], type: 'success' }))
  }

  function RoundNumber(n: string | number, precision: number): string {
    if (typeof n === 'string') return RoundNumber(Number(n), precision)
  
    return n.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })
  }

  function clearDelay() {
    clearInterval(timeInterval)
    setRemainingTime(0)
  }

  function convertMilisecondToTimeString(mili: number) {
    let minute = (Math.floor(mili / 1000 / 60)).toFixed(0)
    let second = (mili / 1000 - Number(minute) * 60).toFixed(0)
  
    if (Number(minute) < 10) minute = `0${minute}`
    if (Number(second) < 10) second = `0${second}`
  
    return `00:${minute}:${second}`
  }

  const handleApproveP2PTrade = () => {
    dispatch(p2pTradeApproveFetch({
      tid,
    }));
    toggleApproveModal()
  }

  const handleCancelP2PTrade = () => {
    dispatch(p2pTradeCancelFetch({
      tid,
    }));
    toggleCancelModal()
  }

  const handleCreateComplain = ({ message }: { message: string }) => {
    dispatch(p2pTradeComplainFetch({
      tid,
      message,
    }));
    toggleComplainModal()
  }

  const handleCreateFeedback = ({ message, rate }: { message: string; rate: string }) => {
    dispatch(p2pTradeFeedbackFetch({
      tid,
      message,
      rate,
    }));
    toggleFeedbackModal()
  }

  const handleP2PTradeSuccess = () => {
    toggleP2PTradeSuccessModal()
    toggleFeedbackModal()
  }

  const toggleFeedbackModal = () => {
    setFeedbackModal(!feedbackModal)
  }

  const toggleComplainModal = () => {
    setComplainModal(!complainModal)
  }

  const toggleP2PTradeSuccessModal = () => {
    setP2PTradeSuccessModal(!p2pTradeSuccessModal)
  }

  const toggleCancelModal = () => {
    if (side === 'sell') return
    setCancelModal(!cancelModal)
  }

  const toggleApproveModal = () => {
    setApproveModal(!approveModal)
  }

  const onPressApprove = () => {
    if (disabledApproveButton) return
    toggleApproveModal()
  }

  const modalCancel = cancelModal ? (
    <div className="cr-modal">
      <CancelP2PTrade
        handleCancelP2PTrade={handleCancelP2PTrade}
        title={formatMessage({id: 'page.body.p2p.trade.cancel.title'})}
        closeModal={toggleCancelModal}
        tid={String(p2pTrade.tid)}
      /> 
    </div>
  ) : null;

  const modalP2PTradeSuccess = p2pTradeSuccessModal ? (
    <div className="cr-modal">
      <P2PTradeSuccess
        handleP2PTradeSuccess={handleP2PTradeSuccess}
        title={`${formatMessage({id: `page.body.p2p.trade.success.${side}`})} ${formatMessage({id: 'page.body.p2p.trade.success.successful'})}`}
        closeModal={toggleP2PTradeSuccessModal}
        side={side}
        p2pTrade={p2pTrade}
      /> 
    </div>
  ) : null;

  const modalCreateFeedback = feedbackModal ? (
    <div className="cr-modal">
      <CreateFeedBack
        title={formatMessage({id: 'page.body.p2p.trade.create_feedback.title'})}
        closeModal={toggleFeedbackModal}
        handleCreateFeedback={handleCreateFeedback}
      /> 
    </div>
  ) : null;

  const modalCreateComplain = complainModal ? (
    <div className="cr-modal">
      <CreateComplain
        title={formatMessage({id: 'page.body.p2p.trade.create_complain.title'})}
        closeModal={toggleComplainModal}
        handleCreateComplain={handleCreateComplain}
      /> 
    </div>
  ) : null;

  const modalApproveModal = approveModal ? (
    <div className="cr-modal">
      <ApproveP2PTrade
        handleApproveP2PTrade={handleApproveP2PTrade}
        title={formatMessage({id: 'page.body.p2p.trade.approve.title'})}
        closeModal={toggleApproveModal}
        side={side}
        p2pTrade={p2pTrade}
      /> 
    </div>
  ) : null;

  const render = () => {
    if (p2pTradeFetching) return null

    if (!Object.keys(p2pTrade).length || !p2pTradeFetchSuccess) return (
      <div className='p2p-trade-screen-mobile'>
          <div className="text-center pt-12">
            <div className="text-xl font-bold">{formatMessage({id: 'page.body.p2p.trade.invalid'})}</div>
            <div className="text-white">{formatMessage({id: 'page.body.p2p.trade.invalid.desc'})}</div>
          </div>
      </div>
    )

    if (p2pTrade.state !== 'pending' && p2pTrade.state !== 'wait' && p2pTrade.state !== 'complain') return (
      <div className="p2p-trade-screen-mobile">
        <div className="p2p-trade-screen-container pl-4">
          <div className="pt-4">
            <div className="text-2xl text-white font-bold capitalize mb-2">
              {formatMessage({id: 'page.body.p2p.trade.trade'})} {p2pTrade.state}
            </div>
            <div className="copy flex items-center mb-1">
              <span className="p2p-trade-screen-text-gray text-sm mr-1">TID:</span>
              <span className='text-sm'>{p2pTrade.tid}</span>
              <CopyIcon className='p2p-trade-screen-copy text-sm cursor-pointer' onClick={copyTID} />
            </div>
            <div className="mb-1">
              <span className="p2p-trade-screen-text-gray text-sm mr-1">{formatMessage({id: 'page.body.p2p.trade.created_at'})}:</span>
              <span className='text-sm'>{localeDate(p2pTrade.created_at, 'fullDate')}</span>
            </div>
          </div>

          <div>
            <div className="p2p-trade-screen-info pt-6">
              <div className="mb-2 text-xl text-white">
                {formatMessage({id: 'page.body.p2p.trade.trade_info'})}
              </div>
              <div className="mb-2">
                <div className="font-bold p2p-trade-screen-text-gray text-sm">
                  {formatMessage({id: 'page.body.p2p.trade.total'})}
                </div>
                <div className={`font-bold text-xl text-white ${side === 'buy' ? 'p2p-trade-screen-info-amount-buy': 'p2p-trade-screen-info-amount-sell'}`}>
                  {`${RoundNumber(Number(p2pTrade.price) * Number(p2pTrade.amount), 2)} ${p2pTrade.fiat_currency.toUpperCase()}`}
                </div>
              </div>
              <div className="h-12 mb-2">
                <div className="font-bold p2p-trade-screen-text-gray text-sm">
                  {formatMessage({id: 'page.body.p2p.trade.price'})}
                </div>
                <div className="font-bold text-xl text-white">
                  {`${RoundNumber(p2pTrade.price, 2)} ${p2pTrade.fiat_currency.toUpperCase()}`}
                </div>
              </div>
              <div className="h-12 mb-2">
                <div className="font-bold p2p-trade-screen-text-gray text-sm">
                  {formatMessage({id: 'page.body.p2p.trade.amount'})}
                </div>
                <div className="font-bold text-xl text-white">
                  {`${p2pTrade.amount} ${p2pTrade.coin_currency.toUpperCase()}`}
                </div>
              </div>
            </div>
            <div className="mb-2 text-xl mt-6 text-white">
              {formatMessage({id: 'page.body.p2p.trade.payment_info'})}
            </div>
            <div>
              <div className="text-lg font-bold capitalize p2p-trade-screen-bank-method mb-2">
                {formatMessage({id: `page.body.p2p.payments.type.${p2pTrade.payment.payment_type}`})}
              </div>
              <div className="mb-2">
                <div className="p2p-trade-screen-text-gray text-sm">
                  {formatMessage({id: 'page.body.p2p.payments.account_name'})}
                </div>
                <div className="text-base text-white">
                  {p2pTrade.payment.account_name}
                </div>
              </div>
              { p2pTrade.payment.payment_type === 'bank' && (
                <>
                  <div className="mb-2">
                    <div className="p2p-trade-screen-text-gray text-sm">
                      {formatMessage({id: 'page.body.p2p.trade.bank_account'})}
                    </div>
                    <div className="text-base text-white flex items-center">
                      {p2pTrade.payment.data.bank_account}
                      <CopyIcon className='p2p-trade-screen-copy text-sm cursor-pointer' onClick={() => copy(p2pTrade.payment.data.bank_account)} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="p2p-trade-screen-text-gray text-sm">
                      {formatMessage({id: 'page.body.p2p.trade.bank_name'})}
                    </div>
                    <div className="text-base text-white">
                      {p2pTrade.payment.data.bank_name}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="p2p-trade-screen-text-gray text-sm">
                      {formatMessage({id: 'page.body.p2p.trade.transfer_content'})}
                    </div>
                    <div className="text-base text-white flex items-center">
                      {p2pTrade.tid}
                      <CopyIcon className='p2p-trade-screen-copy text-sm cursor-pointer' onClick={() => copy(p2pTrade.tid)} />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex py-2 mb-4">
              {p2pTrade.state === 'completed' && !p2pTradeFeedbackFetchSuccess && ((user.uid === p2pTrade.maker.uid && !p2pTrade.maker_sent_feedback) || (user.uid === p2pTrade.taker.uid && !p2pTrade.taker_sent_feedback)) && (
                <div className="p2p-trade-screen-confirm text-white" onClick={toggleFeedbackModal}>
                  {formatMessage({id: 'page.body.p2p.trade.feedback.button'})}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div className="p2p-trade-screen-mobile">
        <div className="p2p-trade-screen-container p2p-trade-screen-head p-4">
          <div>
            {isOvertime && <div className="text-xl font-bold capitalize">
                {formatMessage({id: 'page.body.p2p.trade.title.overtime'})}
              </div>}
            {!isOvertime && <div className="text-xl font-bold capitalize">
              {side === 'buy' ? formatMessage({id: 'page.body.p2p.trade.title.buy'}) : formatMessage({id: 'page.body.p2p.trade.title.sell'})}
            </div>}
            {remainingTime > 0 && !isOvertime && <div className="text-base mb-1">
              <span className="p2p-trade-screen-text-gray text-sm mr-1">{formatMessage({id: 'page.body.p2p.trade.time'})}:</span>
              <span className='text-sm'>{ convertMilisecondToTimeString(remainingTime) }</span>
            </div>}
          </div>
          <div className="copy flex items-center mb-1">
            <span className="p2p-trade-screen-text-gray text-sm mr-1">TID:</span>
            <span className='text-sm'>{p2pTrade.tid}</span>
            <CopyIcon className='p2p-trade-screen-copy text-sm cursor-pointer' onClick={copyTID} />
          </div>
          <div className="mb-1">
            <span className="p2p-trade-screen-text-gray text-sm mr-1">{formatMessage({id: 'page.body.p2p.trade.created_at'})}:</span>
            <span className='text-sm'>{localeDate(p2pTrade.created_at, 'fullDate')}</span>
          </div>
        </div>
        <div className="pr-4">
          <div className="flex">
            <div className="p-4 1">
              <div className="p2p-trade-screen-line">
                <div className="p2p-trade-screen-line-item p2p-trade-screen-line-item-mobile-1">1</div>
                <div className="p2p-trade-screen-line-item p2p-trade-screen-line-item-mobile-2">2</div>
                <div className="p2p-trade-screen-line-item p2p-trade-screen-line-item-mobile-3">3</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="p2p-trade-screen-info pt-6">
                <div className="mb-2 text-xl text-white">
                  {formatMessage({id: 'page.body.p2p.trade.confirm_information_order'})}
                </div>
                <div className="mb-2">
                  <div className="font-bold p2p-trade-screen-text-gray text-sm">
                    {formatMessage({id: 'page.body.p2p.trade.total'})}
                  </div>
                  <div className={`font-bold text-xl text-white ${side === 'buy' ? 'p2p-trade-screen-info-amount-buy': 'p2p-trade-screen-info-amount-sell'}`}>
                    {`${RoundNumber(Number(p2pTrade.price) * Number(p2pTrade.amount), 2)} ${p2pTrade.fiat_currency.toUpperCase()}`}
                  </div>
                </div>
                <div className="h-12 mb-2">
                  <div className="font-bold p2p-trade-screen-text-gray text-sm">
                    {formatMessage({id: 'page.body.p2p.trade.price'})}
                  </div>
                  <div className="font-bold text-xl text-white">
                    {`${RoundNumber(p2pTrade.price, 2)} ${p2pTrade.fiat_currency.toUpperCase()}`}
                  </div>
                </div>
                <div className="h-12 mb-2">
                  <div className="font-bold p2p-trade-screen-text-gray text-sm">
                    {formatMessage({id: 'page.body.p2p.trade.amount'})}
                  </div>
                  <div className="font-bold text-xl text-white">
                    {`${p2pTrade.amount} ${p2pTrade.coin_currency.toUpperCase()}`}
                  </div>
                </div>
              </div>
              <div className="mb-2 text-xl mt-6 text-white">
                {formatMessage({id: 'page.body.p2p.trade.confirm_payment'})}
              </div>
              <div>
                <div className="text-lg font-bold capitalize p2p-trade-screen-bank-method mb-2">
                  {formatMessage({id: `page.body.p2p.payments.type.${p2pTrade.payment.payment_type}`})}
                </div>
                <div className="mb-2">
                  <div className="p2p-trade-screen-text-gray text-sm">
                    {formatMessage({id: 'page.body.p2p.payments.account_name'})}
                  </div>
                  <div className="text-base text-white">
                    {p2pTrade.payment.account_name}
                  </div>
                </div>
                { p2pTrade.payment.payment_type === 'bank' && (
                  <>
                    <div className="mb-2">
                      <div className="p2p-trade-screen-text-gray text-sm">
                        {formatMessage({id: 'page.body.p2p.trade.bank_account'})}
                      </div>
                      <div className="text-base text-white flex items-center">
                        {p2pTrade.payment.data.bank_account}
                        <CopyIcon className='p2p-trade-screen-copy text-sm cursor-pointer' onClick={() => copy(p2pTrade.payment.data.bank_account)} />
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="p2p-trade-screen-text-gray text-sm">
                        {formatMessage({id: 'page.body.p2p.trade.bank_name'})}
                      </div>
                      <div className="text-base text-white">
                        {p2pTrade.payment.data.bank_name}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="p2p-trade-screen-text-gray text-sm">
                        {formatMessage({id: 'page.body.p2p.trade.transfer_content'})}
                      </div>
                      <div className="text-base text-white flex items-center">
                        {p2pTrade.tid}
                        <CopyIcon className='p2p-trade-screen-copy text-sm cursor-pointer' onClick={() => copy(p2pTrade.tid)} />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="mb-2 text-xl mt-6 text-white">
                {formatMessage({id: 'page.body.p2p.trade.payment_confirmation'})}
              </div>
              <div className="flex py-2 mb-4">
                <div className={`p2p-trade-screen-confirm text-white ${disabledApproveButton && "p2p-trade-screen-confirm-disabled"}`} onClick={onPressApprove}>
                  { disabledApproveButton && formatMessage({id: 'page.body.p2p.trade.wait'})}
                  {side === 'buy' && !disabledApproveButton && formatMessage({id: 'page.body.p2p.trade.sended_money'})}
                  {side === 'sell' && !disabledApproveButton && formatMessage({id: 'page.body.p2p.trade.received_money'})}
                </div>
                {side === 'buy' && (
                  <div className="p2p-trade-screen-confirm ml-2 text-white" onClick={toggleCancelModal}>
                    {formatMessage({id: 'page.body.p2p.trade.cancel.button'})}
                  </div>
                )}
                {showCreateComplainButton && (
                  <div className="p2p-trade-screen-confirm ml-2 text-white" onClick={toggleComplainModal}>
                    {formatMessage({id: 'page.body.p2p.trade.create_complain.title'})}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
      <React.Fragment>
        <Subheader
          title='P2P Trade'
          onGoBack={() => history.push('/p2p')}
          rightElement={<div className='payments-screen-mobile-add' onClick={() => history.push(`/p2p/trade/messages/${p2pTrade.tid}`)}>Messages</div>}
          close={false}
        />
        {render()}
        {modalApproveModal}
        {modalCancel}
        {modalCreateFeedback}
        {modalP2PTradeSuccess}
        {modalCreateComplain}
      </React.Fragment>
  );
};

export const ProfileP2PTradeScreen = React.memo(ProfileP2PTradeScreenComponent);
