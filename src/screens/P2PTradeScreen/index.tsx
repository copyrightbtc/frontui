import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useIntl } from "react-intl";
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { CSSTransition } from "react-transition-group";
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip } from '../../components';
import { Button, IconButton } from '@mui/material';
import useAutosizeTextArea from "./useAutosizeTextArea";
import { useP2PConversationsFetch, useP2PTradeFetch } from "../../hooks";
import { copyToClipboard, localeDate } from "../../helpers";
import { CopyIcon } from 'src/assets/images/CopyIcon';
import { TimerOut } from '../../assets/images/p2p/TimerOut';
import { DoneIcon } from '../../assets/images/p2p/DoneIcon';
import { RejectIcon } from '../../assets/images/p2p/RejectIcon';
import { CencelIcon } from '../../assets/images/p2p/CencelIcon';
import { CancelP2PTrade } from "../../components/CancelP2PTrade";
import { HeaderTrading, AdvertisementMenu } from "../../containers";
import { DeleteIcon } from '../../assets/images/DeleteIcon';
import { AddImageIcon } from '../../assets/images/AddImageIcon';
import { SendIcon } from '../../assets/images/SendIcon';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { 
  alertPush, 
  p2pConversationsSendFetch, 
  p2pTradeApproveFetch, 
  p2pTradeCancelFetch, 
  p2pTradeComplainFetch, 
  p2pTradeFeedbackFetch, 
  selectP2PConversations, 
  selectP2PConversationsFetchLoading, 
  selectP2PConversationsSendFetchLoading, 
  selectP2PTrade, 
  selectP2PTradeComplainFetchSuccess, 
  selectP2PTradeFeedbackFetchSuccess, 
  selectP2PTradeFetchLoading, 
  selectP2PTradeFetchSuccess, 
  selectP2PTradeUpdateSuccess, 
  selectUserInfo 
} from "../../modules"; 
import { 
  ApproveP2PTrade, 
  CreateComplain, 
  CreateFeedBack, 
  P2PTradeSuccess, 
  PreviewImage,
  NoResultData
} from "../../components";

export const P2PTradeScreen = () => {
  const { formatMessage } = useIntl();
  const [message, setMessage] = useState('')
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, message);

  const handleChangeArea = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setMessage(val);
  };

  const [imageMessages, setImageMessages] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const user = useSelector(selectUserInfo);
  
  const [p2pTradeSuccessModal, setP2PTradeSuccessModal] = React.useState(false)
  const [feedbackModal, setFeedbackModal] = React.useState(false)
  const [complainModal, setComplainModal] = React.useState(false)
  const [cancelModal, setCancelModal] = React.useState(false)
  const [approveModal, setApproveModal] = React.useState(false)
  const [previewImage, setPreviewImage] = React.useState(false)
  const [urlImage, setUrlImage] = React.useState('')
  const { tid = '' } = useParams<{ tid?: string }>();
  const [remainingTime, setRemainingTime] = React.useState(0);
  let timeInterval : NodeJS.Timeout

  const p2pTradeFeedbackFetchSuccess = useSelector(selectP2PTradeFeedbackFetchSuccess);
  const p2pTradeComplainFetchSuccess = useSelector(selectP2PTradeComplainFetchSuccess);

  const p2pConversations = useSelector(selectP2PConversations);
  const p2pConversationsFetching = useSelector(selectP2PConversationsFetchLoading);
  const p2pConversationsSendFetching = useSelector(selectP2PConversationsSendFetchLoading);
  useP2PConversationsFetch(tid)

  const p2pTrade = useSelector(selectP2PTrade);
  const p2pTradeFetching = useSelector(selectP2PTradeFetchLoading);
  const p2pTradeFetchSuccess = useSelector(selectP2PTradeFetchSuccess);
  const p2pTradeUpdateSuccess = useSelector(selectP2PTradeUpdateSuccess);
  useP2PTradeFetch(tid)

  const side = useMemo(() => {
    if (!Object.keys(p2pTrade).length) return 'buy';
    return p2pTrade.taker.uid === user.uid ? p2pTrade.side : p2pTrade.side === 'buy' ? 'sell' : 'buy'
  }, [p2pTrade])

  const isOvertime = useMemo(() => {
    const expiredAt = moment(p2pTrade.created_at).toDate()
    expiredAt.setMinutes(expiredAt.getMinutes() + p2pTrade.paytime)

    if (expiredAt > new Date()) return false
    return true
  }, [remainingTime, p2pTrade])

  const disabledApproveButton = useMemo(() => {
    if (!Object.keys(p2pTrade).length) return true;
    if (side === "sell" && p2pTrade.maker.uid === user.uid && !p2pTrade.taker_accepted) return true
    if (side === "sell" && p2pTrade.taker.uid === user.uid && !p2pTrade.maker_accepted) return true
    if (p2pTrade.maker.uid === user.uid && p2pTrade.maker_accepted) return true
    if (p2pTrade.taker.uid === user.uid && p2pTrade.taker_accepted) return true
    return false
  }, [p2pTrade])

  const showCreateComplainButton = useMemo(() => {
    if (!Object.keys(p2pTrade).length) return false;
    if (!!p2pTrade.complain) return false;
    if (!isOvertime) return false;
    if (!p2pTrade.maker_accepted && !p2pTrade.taker_accepted) return false
    if (p2pTradeComplainFetchSuccess) return false

    return true
  }, [p2pTrade, isOvertime, p2pTradeComplainFetchSuccess])

  const disabledSendButton = useMemo(() => {
    if (p2pConversationsSendFetching) return true;
    if (!message.length && !files.length) return true;
    return false
}, [p2pTrade, message, files])

  const dispatch = useDispatch();
  const [focusedArea, setFocusedArea] = useState(false);

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

  async function onImageMessageChange(e: any) {
    const target = e.target as HTMLInputElement
    const inputFiles = Array.from(target.files!)
  
    if (inputFiles) {
      let imageMessagesTemp: string[] = [];
      let filesTemp: File[] = [];
      for (let i = 0; i < inputFiles.length; i++) {
        // const uuid = uuidv4()
        imageMessagesTemp.push(URL.createObjectURL(inputFiles[i]))
        filesTemp.push(inputFiles[i])
      }

      setImageMessages([...imageMessages, ...imageMessagesTemp])
      setFiles([...files, ...filesTemp])
    }
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
    let hour = (Math.floor(mili / 1000 / 60 / 60)).toFixed(0)
    let minute = (Math.floor(mili / 1000 / 60 - Number(hour) * 60)).toFixed(0)

    let seccount = (Math.floor(mili / 1000 / 60)).toFixed(0)
    let second = (mili / 1000 - Number(seccount) * 60).toFixed(0)
  
    if (Number(hour) < 10) hour = `0${hour}`
    if (Number(minute) < 10) minute = `0${minute}`
    if (Number(second) < 10) second = `0${second}`
  
    return `${hour}:${minute}:${second}`
  }

  const handleApproveP2PTrade = () => {
    dispatch(p2pTradeApproveFetch({
      tid,
    }));
    toggleApproveModal()
  }

  const handleP2PTradeSuccess = () => {
    toggleP2PTradeSuccessModal()
    toggleFeedbackModal()
  }

  const handleCancelP2PTrade = () => {
    dispatch(p2pTradeCancelFetch({
      tid,
    }));
    toggleCancelModal()
  }

  const handleCreateFeedback = ({ message, rate }: { message: string; rate: string }) => {
    dispatch(p2pTradeFeedbackFetch({
      tid,
      message,
      rate,
    }));
    toggleFeedbackModal()
  }

  const handleCreateComplain = ({ message }: { message: string }) => {
    dispatch(p2pTradeComplainFetch({
      tid,
      message,
    }));

    toggleComplainModal()
  }

  const toggleP2PTradeSuccessModal = () => {
    setP2PTradeSuccessModal(!p2pTradeSuccessModal)
  }

  const toggleFeedbackModal = () => {
    setFeedbackModal(!feedbackModal)
  }

  const toggleComplainModal = () => {
    setComplainModal(!complainModal)
  }

  const toggleCancelModal = () => {
    if (side === 'sell') return
    setCancelModal(!cancelModal)
  }

  const toggleApproveModal = () => {
    setApproveModal(!approveModal)
  }

  const togglePreviewImage = () => {
    setPreviewImage(!previewImage)
  }

  const onClickImage = (url?: string) => {
    if (!url) return
    setUrlImage(url)
    togglePreviewImage()
  }

  const onPressApprove = () => {
    if (disabledApproveButton) return
    toggleApproveModal()
  }

  function clearImage(index: number) {
    setImageMessages([...imageMessages.slice(0, index), ...imageMessages.slice(index + 1)])
    if (files.length) {
      setFiles([...files.slice(0, index), ...files.slice(index + 1)])
    }
  }

  function clearAllImages() {
    setImageMessages([...imageMessages.slice(10000)])
    if (files.length) {
      setFiles([...files.slice(10000)])
    }
  }

  function clearAllImage() {
    setImageMessages([])
    setFiles([])
  }

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        SendMessageP2PTrade();
      }
  };

  function SendMessageP2PTrade() {
    if (disabledSendButton) return
  
    if (p2pConversations) {
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const data = new FormData()
          data.append('image', files[i])
          data.append('tid', String(p2pTrade.tid))
  
          dispatch(p2pConversationsSendFetch({ 
            tid: String(p2pTrade.tid),
            data,
          }))
        }
        clearAllImage()
      }
  
      if (message.length) {
        const data = new FormData()
        data.append('body', message)
        data.append('tid', String(p2pTrade.tid))

        dispatch(p2pConversationsSendFetch({ 
          tid: String(p2pTrade.tid),
          data,
        }))
      }
    }
  
    setMessage('')
  }

  if (p2pConversationsFetching || p2pTradeFetching) return null
  if (!Object.keys(p2pTrade).length || !p2pTradeFetchSuccess) return (
    <div className="p2pscreen">
      <HeaderTrading />
      <AdvertisementMenu />
      <div className="p2pscreen__wrapper">
        <div className="error-tid">
          <NoResultData 
            class="themes" 
            title={formatMessage({ id: 'page.body.p2p.trade.invalid' })}
            suffix={<strong>{formatMessage({id: 'page.body.p2p.trade.invalid.desc'})}</strong>}
            />
        </div>
      </div>
    </div>
  )

  if (p2pTrade.state !== 'pending' && p2pTrade.state !== 'wait' && p2pTrade.state !== 'complain') return (
    <div className="p2pscreen">
      <HeaderTrading />
      <AdvertisementMenu />
      <div className="p2pscreen__wrapper">
        <div className="p2ptrade-screen finished">

          <div className="p2ptrade-screen__left">
            <div className="p2ptrade-screen__left__head">
              <div className="p2ptrade-screen__left__head__title">
                <h3>{formatMessage({id: `page.body.p2p.trade.trade.${p2pTrade.state}`})}</h3>
                <div className="details">
                  <div className="tid">
                    <span>{formatMessage({id: 'page.body.p2p.order.transfer.order.number'})}</span>
                    <div className="copy-field noborder">
                      <div className="copy-field__text">{p2pTrade.tid}</div> 
                      <IconButton
                          onClick={copyTID}
                          className="copy_button"
                      >
                          <CopyIcon className="copy-iconprop"/>  
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
              {p2pTrade.state === 'completed' && <div className="doneorder">
                <DoneIcon />
              </div>}
              {p2pTrade.state === 'reject' && <div className="timerout">
                <RejectIcon />
              </div>}
              {p2pTrade.state === 'cancel' && <div className="timerout">
                <CencelIcon />
              </div>}
            </div>
 
            <div className="p2ptrade-screen__left__body">
              <div className="p2ptrade-screen__left__content">
                <div className="p2ptrade-screen__left__content__info">
                  <div className={`first-rows ${side === 'buy' ? 'first-rows--buy' : 'first-rows--sell'}`}>
                    {side === 'buy' ? formatMessage({id: 'page.body.p2p.orders.buy'}) : formatMessage({id: 'page.body.p2p.orders.sell'})}
                    <span>{p2pTrade.fiat_currency.toUpperCase()}</span>
                  </div>
                  <div className="rows">
                    <span className="info-p">
                      {formatMessage({id: 'page.body.p2p.trade.fiatamount'})}
                      <OverlayTrigger
                        placement="auto"
                        delay={{ show: 250, hide: 300 }} 
                        overlay={<Tooltip className="themes" title="page.body.p2p.orders.fiat.tooltip" />}>
                          <div className="tip_icon_container">
                              <InfoIcon />
                          </div>
                      </OverlayTrigger>
                    </span>
                    <div className="number number--color">
                      {`${RoundNumber(Number(p2pTrade.price) * Number(p2pTrade.amount), 2)} ${p2pTrade.fiat_currency.toUpperCase()}`}
                    </div>
                  </div>
                  <div className="rows">
                    <span>{formatMessage({id: 'page.body.p2p.trade.price'})}</span>
                    <div className="number">
                      {`${RoundNumber(p2pTrade.price, 2)} ${p2pTrade.fiat_currency.toUpperCase()}`}
                    </div>
                  </div>
                  <div className="rows">
                    <span>
                      {side === 'buy' ? formatMessage({id: 'page.body.p2p.trade.receivequantity'}) : formatMessage({id: 'page.body.p2p.trade.sentquantity'})}
                    </span>
                    <div className="number">
                      {`${p2pTrade.amount} ${p2pTrade.coin_currency.toUpperCase()}`}
                    </div>
                  </div>
                  <div className="separate-line"></div>
                  <div className="rows">
                    <span>{formatMessage({id: 'page.body.p2p.trade.created_at'})}</span>
                    <div className="number">
                      {localeDate(p2pTrade.created_at, 'fullDate')}
                    </div>
                  </div>
                  <div className="rows">
                    <span>{formatMessage({id: 'page.body.p2p.trade.paytime'})}</span>
                    <div className="number">
                      {p2pTrade.paytime} m
                    </div>
                  </div>
                  <div className="rows">
                    <span>{formatMessage({id: 'page.body.p2p.trade.paymethod'})}</span>
                    <div className="number">
                      {p2pTrade.payment.account_name}
                    </div>
                  </div>
                </div> 
              </div>
              <div className="p2ptrade-screen__left__footer">
                <div className="p2ptrade-screen__left__footer__buttons">
                  {p2pTrade.state === 'completed' && !p2pTradeFeedbackFetchSuccess && ((user.uid === p2pTrade.maker.uid && !p2pTrade.maker_sent_feedback) || (user.uid === p2pTrade.taker.uid && !p2pTrade.taker_sent_feedback)) && (
                    <Button
                      onClick={toggleFeedbackModal}
                      className="medium-button themes"
                    >
                      {formatMessage({id: 'page.body.p2p.trade.feedback.button'})}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p2ptrade-screen__right">

            <div className="p2ptrade-screen__right__chat">
              <div className="p2ptrade-screen__right__chat__head">
                <div className="avatar">
                  {p2pTrade.maker.uid === user.uid ? p2pTrade.taker.username[0].toUpperCase() : p2pTrade.maker.username[0].toUpperCase()}
                </div>
                <Link className="name" to={`/p2p/advertiser/${p2pTrade.maker.uid === user.uid ? p2pTrade.taker.uid : p2pTrade.maker.uid}`}>
                  {p2pTrade.maker.uid === user.uid ? p2pTrade.taker.username : p2pTrade.maker.username}
                </Link>
              </div>

              <div className="p2ptrade-screen__right__chat__body">
                {p2pConversations.map((conversation, i) => (
                  <div key={i} className={`flex ${user.uid === conversation.uid ? 'justify-end' : 'justify-start'}`}>
                    <div>
                      <div className={`mb-2 user ${user.uid === conversation.uid ? 'text-right' : 'text-left'}`}>
                        {conversation.username} {conversation.supporter && '(Supporter)'}
                      </div>
                      {conversation.image && conversation.image.url && conversation.image.url.length ? (
                        <div className="p2ptrade-screen__right__chat__image">
                          <img
                            alt="img"
                            src={conversation.image.url}
                            draggable="false"
                            onClick={() => onClickImage(conversation.image ? conversation.image.url : '')}
                          />
                        </div>
                      ) : (
                        <div className={`p2ptrade-screen__right__chat__item ${user.uid === conversation.uid ? 'filled' : 'bordered'}`}>
                          {conversation.body}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CSSTransition
          in={previewImage}
          timeout={{
          enter: 100,
          exit: 400
          }}
          unmountOnExit
      >
        <div className="modal-window"> 
          <form className="modal-window__container preview fadet"> 
            <PreviewImage
              title={formatMessage({id: 'page.body.p2p.trade.preview_image.title'})}
              closeModal={togglePreviewImage}
              url={urlImage}
            /> 
          </form>
        </div>
      </CSSTransition>
      <CSSTransition
          in={feedbackModal}
          timeout={{
          enter: 100,
          exit: 400
          }}
          unmountOnExit
      >
        <div className="modal-window"> 
          <form className="modal-window__container feedback fadet"> 
            <CreateFeedBack
              title={formatMessage({id: 'page.body.p2p.trade.create_feedback.title'})}
              closeModal={toggleFeedbackModal}
              handleCreateFeedback={handleCreateFeedback}
            /> 
          </form>
        </div>
      </CSSTransition>

      <CSSTransition
          in={p2pTradeSuccessModal}
          timeout={{
          enter: 100,
          exit: 400
          }}
          unmountOnExit
      >
        <div className="modal-window"> 
          <form className="modal-window__container fadet"> 
            <P2PTradeSuccess
              handleP2PTradeSuccess={handleP2PTradeSuccess}
              title={`${formatMessage({id: 'page.body.p2p.trade.success.successful'})} ${formatMessage({id: `page.body.p2p.trade.success.${side}`})}`}
              closeModal={toggleP2PTradeSuccessModal}
              side={side}
              p2pTrade={p2pTrade}
            /> 
          </form>
        </div>
      </CSSTransition>
    </div>
  )

  return (
    <div className="p2pscreen">
      <HeaderTrading />
      <AdvertisementMenu />
      <div className="p2pscreen__wrapper">
        <div className="p2ptrade-screen">

          <div className="p2ptrade-screen__left">
            <div className="p2ptrade-screen__left__head">
              <div className="p2ptrade-screen__left__head__title">
                <h3>
                  {p2pTrade.state === 'complain' ? formatMessage({id: `page.body.p2p.trade.trade.${p2pTrade.state}`}) : 
                    isOvertime ? formatMessage({id: 'page.body.p2p.trade.title.overtime'}) : 
                    side === 'buy' ? formatMessage({id: 'page.body.p2p.trade.title.buy'}) : formatMessage({id: 'page.body.p2p.trade.title.sell'})
                  }
                  {remainingTime > 0 && !isOvertime && (<div className="count">
                    { convertMilisecondToTimeString(remainingTime) }
                  </div>)}
                </h3>
                <div className="details">
                  <div className="tid">
                    <span>{formatMessage({id: 'page.body.p2p.order.transfer.order.number'})}</span>
                    <div className="copy-field noborder">
                      <div className="copy-field__text">{p2pTrade.tid}</div> 
                      <IconButton
                          onClick={copyTID}
                          className="copy_button"
                      >
                          <CopyIcon className="copy-iconprop"/>  
                      </IconButton>
                    </div>
                  </div>
                  <div className="times">
                    <span>{formatMessage({id: 'page.body.p2p.trade.created_at'})}</span>
                    <div className="date-split">
                      <div className="date">{localeDate(p2pTrade.created_at, 'date')}</div>
                      <div className="time">{localeDate(p2pTrade.created_at, 'time')}</div>
                    </div>
                  </div>
                </div>
              </div>
              {isOvertime && p2pTrade.state !== 'complain' && <div className="timerout">
                <TimerOut />
              </div>}
              {p2pTrade.state === 'complain' && <div className="timerout">
                <RejectIcon />
              </div>}
            </div>

            <div className="p2ptrade-screen__left__body">
              <div className="p2ptrade-screen__left__content">
                
                <div className="p2ptrade-screen__left__content__block">
                  <div className="p2ptrade-screen__left__content__title">
                    <div className="check-dot"><span>1</span></div>
                    <h3>{formatMessage({id: 'page.body.p2p.trade.confirm_information_order'})}</h3>
                  </div>
                  <div className="p2ptrade-screen__left__content__info">
                    <div className={`first-rows ${side === 'buy' ? 'first-rows--buy' : 'first-rows--sell'}`}>
                      {side === 'buy' ? formatMessage({id: 'page.body.p2p.orders.buy'}) : formatMessage({id: 'page.body.p2p.orders.sell'})}
                      <span>{p2pTrade.fiat_currency.toUpperCase()}</span>
                    </div>
                    <div className="rows">
                      <span className="info-p">
                        {formatMessage({id: 'page.body.p2p.trade.fiatamount'})}
                        <OverlayTrigger
                          placement="auto"
                          delay={{ show: 250, hide: 300 }} 
                          overlay={<Tooltip className="themes" title="page.body.p2p.orders.fiat.tooltip" />}>
                            <div className="tip_icon_container">
                                <InfoIcon />
                            </div>
                        </OverlayTrigger>
                      </span>
                      <div className="number number--color">
                        {`${RoundNumber(Number(p2pTrade.price) * Number(p2pTrade.amount), 2)} ${p2pTrade.fiat_currency.toUpperCase()}`}
                      </div>
                    </div>
                    <div className="rows">
                      <span>{formatMessage({id: 'page.body.p2p.trade.price'})}</span>
                      <div className="number">
                        {`${RoundNumber(p2pTrade.price, 2)} ${p2pTrade.fiat_currency.toUpperCase()}`}
                      </div>
                    </div>
                    <div className="rows">
                      <span>
                        {side === 'buy' ? formatMessage({id: 'page.body.p2p.trade.receivequantity'}) : formatMessage({id: 'page.body.p2p.trade.sentquantity'})}
                      </span>
                      <div className="number">
                        {`${p2pTrade.amount} ${p2pTrade.coin_currency.toUpperCase()}`}
                      </div>
                    </div>

                  </div>
                </div>

                <div className="p2ptrade-screen__left__content__block">
                  <div className="p2ptrade-screen__left__content__title">
                    <div className="check-dot"><span>2</span></div>
                    <h3>
                      {p2pTrade.payment && p2pTrade.payment.payment_type === 'bank' && (
                        `${formatMessage({ id: 'page.body.p2p.trade.confirm_payment' }, {accountName: p2pTrade.payment.account_name})} ${RoundNumber(Number(p2pTrade.price) * Number(p2pTrade.amount), 2)} ${p2pTrade.fiat_currency.toUpperCase()}`
                      )}
                    </h3>
                  </div>
                  <div className="p2ptrade-screen__left__content__description">
                    {side === 'buy' ? formatMessage({id: 'page.body.p2p.trade.description.for.buyer'}) : formatMessage({id: 'page.body.p2p.trade.description.for.seller'})}
                  </div>
                    
                  <div className="p2ptrade-screen__left__content__info">

                    <div className="rows">
                      <span>{formatMessage({id: 'page.body.p2p.payments.account_name'})}</span>
                      <div className="number">
                        {p2pTrade.payment.account_name}
                      </div>
                    </div>
                    {p2pTrade.payment && p2pTrade.payment.payment_type === 'bank' && (
                      <React.Fragment>
                        <div className="rows">
                          <span>{formatMessage({id: 'page.body.p2p.trade.bank_account'})}</span>
                          <div className="number">
                            <div className="copy-field noborder">
                              <div className="copy-field__text">{p2pTrade.payment.data.bank_account}</div> 
                              <IconButton
                                  onClick={() => copy(p2pTrade.payment.data.bank_account)}
                                  className="copy_button"
                              >
                                  <CopyIcon className="copy-iconprop"/>  
                              </IconButton>
                            </div>
                          </div>
                        </div>
                        <div className="rows">
                          <span>{formatMessage({id: 'page.body.p2p.trade.bank_name'})}</span>
                          <div className="number">
                            {p2pTrade.payment.data.bank_name}
                          </div>
                        </div>
                        <div className="rows">
                          <span>{formatMessage({id: 'page.body.p2p.trade.transfer_content'})}</span>
                          <div className="number">
                            <div className="copy-field noborder">
                              <div className="copy-field__text">{p2pTrade.tid}</div> 
                              <IconButton
                                  onClick={() => copy(p2pTrade.tid)}
                                  className="copy_button"
                              >
                                  <CopyIcon className="copy-iconprop"/>  
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    )}
                  </div> 
                </div>

                <div className="p2ptrade-screen__left__content__block">
                  <div className="p2ptrade-screen__left__content__title">
                    <div className="check-dot"><span>3</span></div>
                    <h3>{ side === 'buy' ? formatMessage({id: 'page.body.p2p.trade.payment_confirmation.notify.seller'}) : formatMessage({id: 'page.body.p2p.trade.payment_confirmation.notify.buyer'})}</h3>
                  </div>
                </div>
              
              </div>
            </div>
            <div className="p2ptrade-screen__left__footer">
              <div className="p2ptrade-screen__left__footer__description">
                {side === 'buy' ? formatMessage({id: 'page.body.p2p.trade.description.footer.for.buyer'}) : formatMessage({id: 'page.body.p2p.trade.description.footer.for.seller'})}
              </div>
              <div className="p2ptrade-screen__left__footer__buttons">
                <Button
                    onClick={onPressApprove}
                    disabled={disabledApproveButton}
                    className="medium-button themes"
                >
                  {disabledApproveButton && formatMessage({id: 'page.body.p2p.trade.wait'})}
                  {side === 'buy' && !disabledApproveButton && formatMessage({id: 'page.body.p2p.trade.sended_money'})}
                  {side === 'sell' && !disabledApproveButton && formatMessage({id: 'page.body.p2p.trade.received_money'})}
                </Button>
                {side === 'buy' && (
                  <Button
                    onClick={toggleCancelModal}
                    className="medium-button themes black"
                  >
                    {formatMessage({id: 'page.body.p2p.order.transfer.cancel.order'})}
                  </Button>
                )}
                {showCreateComplainButton && (
                  <Button
                    onClick={toggleComplainModal}
                    className="medium-button themes red"
                  >
                    {formatMessage({id: 'page.body.p2p.trade.create_complain.title'})}
                  </Button>
                )}
              </div>
            </div> 
          </div>


          <div className="p2ptrade-screen__right">
            <div className="p2ptrade-screen__right__chat" onKeyPress={handleEnterPress}>

              <div className="p2ptrade-screen__right__chat__head">
                <div className="avatar">
                  {p2pTrade.maker.uid === user.uid ? p2pTrade.taker.username[0].toUpperCase() : p2pTrade.maker.username[0].toUpperCase()}
                </div>
                <Link className="name" to={`/p2p/advertiser/${p2pTrade.maker.uid === user.uid ? p2pTrade.taker.uid : p2pTrade.maker.uid}`}>
                  {p2pTrade.maker.uid === user.uid ? p2pTrade.taker.username : p2pTrade.maker.username}
                </Link>
              </div>

              <div className="p2ptrade-screen__right__chat__body">
                {p2pConversations.map((conversation, i) => (
                  <div key={i} className={`flex ${user.uid === conversation.uid ? 'justify-end' : 'justify-start'}`}>
                    <div>
                      <div className={`mb-2 user ${user.uid === conversation.uid ? 'text-right' : 'text-left'}`}>
                        {conversation.username} {conversation.supporter && '(Supporter)'}
                      </div>
                      {conversation.image && conversation.image.url && conversation.image.url.length ? (
                        <div className="p2ptrade-screen__right__chat__image">
                          <img
                            alt="img"
                            src={conversation.image.url}
                            draggable="false"
                            onClick={() => onClickImage(conversation.image ? conversation.image.url : '')}
                          />
                          <div className="time">{localeDate(conversation.created_at, 'time')}</div>
                        </div>
                      ) : (
                        <div className={`p2ptrade-screen__right__chat__item ${user.uid === conversation.uid ? 'filled' : 'bordered'}`}>
                          {conversation.body}
                          <div className="time">{localeDate(conversation.created_at, 'time')}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                { imageMessages.length > 0 && (
                  <div className="p2ptrade-screen__right__chat__bottom">
                    <div className="p2ptrade-screen__right__chat__bottom__wrapper">
                      <div className="image-wrapper">
                      {
                        imageMessages.slice(0, 4).map((image, index) => (
                          <div key={index} className={imageMessages.length === 1 ? 'image' : 'image images'}>
                            <img 
                              alt="img" 
                              src={image} 
                              draggable="false"
                            />
                            <div className="trash">
                              <DeleteIcon onClick={() => clearImage(index)}/>
                            </div>
                          </div>
                        ))
                      }
                      </div>
                      {imageMessages.length > 0 &&
                        <div className="image-buttons">
                          <button className="submit"
                            onClick={() => clearAllImages()}
                          >
                            {formatMessage({id: 'page.body.p2p.dispute.cancel'})}
                          </button>
                          <button className="submit"
                            onClick={SendMessageP2PTrade}
                          >
                            {formatMessage({id: 'page.body.kyc.submit'})}
                          </button>
                        </div>}
                    </div>
                  </div>
                )}
              </div>
              <div className="p2ptrade-screen__right__chat__footer">
                <div className="top-image">
                  <input id="image_message" type="file" className="hidden" accept="image/*" multiple onChange={e => onImageMessageChange(e)} />
                  {imageMessages.length >= 4 ? 
                  <label htmlFor="image_message" className="disabled"><AddImageIcon /></label> : 
                  <label htmlFor="image_message">
                    <OverlayTrigger
                      placement="auto"
                      delay={{ show: 250, hide: 300 }} 
                      overlay={<Tooltip className="themes" title="page.body.p2p.trade.upload.images" />}>
                        <AddImageIcon />
                    </OverlayTrigger>
                  </label>}
                </div>
                <div className="bottom-text">
                  <div className={`text-area${focusedArea ? " focused" : ""}`}>
                    <textarea
                      ref={textAreaRef}
                      placeholder={formatMessage({id: 'page.body.p2p.trade.write_a_message'})} 
                      value={message}
                      onChange={e => {handleChangeArea; setMessage(e.target.value)}}
                      maxLength={500}
                      onFocus={() => setFocusedArea(true)}
                      onBlur={() => setFocusedArea(false)}
                      spellCheck={true}
                      rows={1}
                    />
                  </div>
                  <button className={`bottom-text__button ${disabledSendButton && 'disabled'}`}
                      onClick={SendMessageP2PTrade}
                    >
                      <SendIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CSSTransition
          in={approveModal}
          timeout={{
          enter: 100,
          exit: 400
          }}
          unmountOnExit
      >
        <div className="modal-window"> 
          <form className="modal-window__container fadet"> 
            <ApproveP2PTrade
              handleApproveP2PTrade={handleApproveP2PTrade}
              title={formatMessage({id: 'page.body.p2p.trade.approve.title'})}
              closeModal={toggleApproveModal}
              side={side}
              p2pTrade={p2pTrade}
            /> 
          </form>
        </div>
      </CSSTransition>
      <CSSTransition
          in={previewImage}
          timeout={{
          enter: 100,
          exit: 400
          }}
          unmountOnExit
      >
        <div className="modal-window"> 
          <form className="modal-window__container preview fadet"> 
            <PreviewImage
              title={formatMessage({id: 'page.body.p2p.trade.preview_image.title'})}
              closeModal={togglePreviewImage}
              url={urlImage}
            /> 
          </form>
        </div>
      </CSSTransition>
      <CSSTransition
          in={cancelModal}
          timeout={{
          enter: 100,
          exit: 400
          }}
          unmountOnExit
      >
        <div className="modal-window"> 
          <form className="modal-window__container fadet"> 
            <CancelP2PTrade
              handleCancelP2PTrade={handleCancelP2PTrade}
              title={formatMessage({id: 'page.body.p2p.trade.cancel.title'})}
              contents={formatMessage({id: 'page.body.p2p.trade.cancel.sure'}, {number: p2pTrade.tid})}
              closeModal={toggleCancelModal}
              tid={String(p2pTrade.tid)}
            />
          </form>
        </div>
      </CSSTransition>
      <CSSTransition
          in={complainModal}
          timeout={{
          enter: 100,
          exit: 400
          }}
          unmountOnExit
      >
        <div className="modal-window"> 
          <form className="modal-window__container fadet"> 
            <CreateComplain
              title={formatMessage({id: 'page.body.p2p.trade.create_complain.title'})}
              closeModal={toggleComplainModal}
              handleCreateComplain={handleCreateComplain}
            /> 
          </form>
        </div>
      </CSSTransition>
    </div>
  )
}
