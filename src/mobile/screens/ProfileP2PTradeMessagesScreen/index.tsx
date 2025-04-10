import * as React from 'react';

import {
    Subheader,
} from '../../components';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { p2pConversationsSendFetch, selectP2PConversations, selectP2PConversationsFetchLoading, selectP2PConversationsSendFetchLoading, selectP2PTrade, selectP2PTradeFetchLoading, selectUserInfo } from '../../../modules';
import { useP2PConversationsFetch, useP2PTradeFetch } from '../../../hooks';
import {PreviewImage } from '../../../components';
import { TimerOut } from '../../../assets/images/p2p/TimerOut';

const ProfileP2PTradeMessagesScreenComponent: React.FC = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [message, setMessage] = React.useState('')
  const [imageMessages, setImageMessages] = React.useState<string[]>([])
  const [files, setFiles] = React.useState<File[]>([])
  const history = useHistory();

  const user = useSelector(selectUserInfo);

  const [previewImage, setPreviewImage] = React.useState(false)
  const [urlImage, setUrlImage] = React.useState('')
  const { tid = '' } = useParams<{ tid?: string }>();

  const p2pConversations = useSelector(selectP2PConversations);
  const p2pConversationsFetching = useSelector(selectP2PConversationsFetchLoading);
  const p2pConversationsSendFetching = useSelector(selectP2PConversationsSendFetchLoading);
  useP2PConversationsFetch(tid)

  const p2pTrade = useSelector(selectP2PTrade);
  const p2pTradeFetching = useSelector(selectP2PTradeFetchLoading);
  useP2PTradeFetch(tid)

  const disabledSendButton = React.useMemo(() => {
    if (p2pConversationsSendFetching) return true;
    if (!message.length && !files.length) return true;
    return false
  }, [message, files])

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

  const togglePreviewImage = () => {
    setPreviewImage(!previewImage)
  }

  const onClickImage = (url?: string) => {
    if (!url) return
    setUrlImage(url)
    togglePreviewImage()
  }

  const modalPreivewImage = previewImage ? (
    <div className="cr-modal">
      <PreviewImage
        title={formatMessage({id: 'page.body.p2p.trade.preview_image.title'})}
        closeModal={togglePreviewImage}
        url={urlImage}
      /> 
    </div>
  ) : null;

  function clearImage(index: number) {
    setImageMessages([...imageMessages.slice(0, index), ...imageMessages.slice(index + 1)])
    if (files.length) {
      setFiles([...files.slice(0, index), ...files.slice(index + 1)])
    }
  }

  function clearAllImage() {
    setImageMessages([])
    setFiles([])
  }

  function SendMessageP2PTrade() {
    if (disabledSendButton) return
  
    if (p2pConversations) {
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const data = new FormData()
          data.append('image', files[i])
          data.append('tid', String(tid))
  
          dispatch(p2pConversationsSendFetch({ 
            tid,
            data,
          }))
        }
        clearAllImage()
      }
  
      if (message.length) {
        const data = new FormData()
        data.append('body', message)
        data.append('tid', String(tid))

        dispatch(p2pConversationsSendFetch({ 
          tid,
          data,
        }))
      }
    }
  
    setMessage('')
  }

  const render = () => {
    if (p2pConversationsFetching || p2pTradeFetching) return null

    if (!Object.keys(p2pTrade).length) return (
        <div className='p2p-trade-screen-mobile'>
            <div className="text-center pt-12">
              <div className="text-xl font-bold">{formatMessage({id: 'page.body.p2p.trade.invalid'})}</div>
              <div className="text-white">{formatMessage({id: 'page.body.p2p.trade.invalid.desc'})}</div>
            </div>
        </div>
    )

    if (p2pTrade.state !== 'pending' && p2pTrade.state !== 'wait') return (
      <div className="p2p-trade-screen-mobile">
        <div className="p2p-trade-screen-chat">
            <div className="p2p-trade-screen-chat-head">
              <div className="flex">
                <div className="mr-2 rounded-full px-1 bg-blue-600 h-[20px] w-[20px] flex justify-center items-center text-white">
                  {p2pTrade.maker.uid === user.uid ? p2pTrade.taker.username[0].toUpperCase() : p2pTrade.maker.username[0].toUpperCase()}
                </div>
                {p2pTrade.maker.uid === user.uid ? p2pTrade.taker.username : p2pTrade.maker.username}
              </div>
            </div>
            <div className="p2p-trade-screen-chat-content-view-mobile-only">
                {p2pConversations.map((conversation, i) => (
                    <div key={i} className={`flex ${user.uid === conversation.uid ? 'justify-end' : 'justify-start'}`}>
                      <div>
                        <div className={`p2p-trade-screen-text-gray mb-2 ${user.uid === conversation.uid ? 'text-right' : 'text-left'}`}>
                          {conversation.username} {conversation.supporter && '(Supporter)'}
                        </div>
                        {conversation.image && conversation.image.url && conversation.image.url.length ? (
                            <div className="p2p-trade-screen-chat-content-item-image">
                            <img
                                alt="img"
                                src={conversation.image.url}
                                onClick={() => onClickImage(conversation.image ? conversation.image.url : '')}
                            />
                            </div>
                        ) : (
                            <div className={`p2p-trade-screen-chat-content-item ${user.uid === conversation.uid ? 'p2p-trade-screen-chat-content-item-my' : ''}`}>
                            {conversation.body}
                            </div>
                        )}
                      </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    )

    return (
      <div className="p2p-trade-screen-mobile">
        <div className="p2p-trade-screen-chat">
            <div className="p2p-trade-screen-chat-head">
                <div className="flex">
                  <div className="mr-2 rounded-full px-1 bg-blue-600 h-[20px] w-[20px] flex justify-center items-center text-white">
                    {p2pTrade.maker.uid === user.uid ? p2pTrade.taker.username[0].toUpperCase() : p2pTrade.maker.username[0].toUpperCase()}
                  </div>
                  {p2pTrade.maker.uid === user.uid ? p2pTrade.taker.username : p2pTrade.maker.username}
                </div>
            </div>
            <div className="p2p-trade-screen-chat-content-view-mobile">
              {p2pConversations.map((conversation, i) => (
                  <div key={i} className={`flex ${user.uid === conversation.uid ? 'justify-end' : 'justify-start'}`}>
                    <div>
                      <div className={`p2p-trade-screen-text-gray mb-2 ${user.uid === conversation.uid ? 'text-right' : 'text-left'}`}>
                        {conversation.username} {conversation.supporter && '(Supporter)'}
                      </div>
                      {conversation.image && conversation.image.url && conversation.image.url.length ? (
                          <div className="p2p-trade-screen-chat-content-item-image">
                          <img
                              alt="img"
                              src={conversation.image.url}
                              onClick={() => onClickImage(conversation.image ? conversation.image.url : '')}
                          />
                          </div>
                      ) : (
                          <div className={`p2p-trade-screen-chat-content-item ${user.uid === conversation.uid ? 'p2p-trade-screen-chat-content-item-my' : ''}`}>
                          {conversation.body}
                          </div>
                      )}
                    </div>
                  </div>
              ))}
            </div>
            <div className="p2p-trade-screen-chat-bottom p2p-trade-screen-chat-bottom-mobile">
              { imageMessages.length > 0 && (
                <div className="p2p-trade-screen-chat-bottom-image">
                  {
                    imageMessages.map((image, index) => (
                      <div key={index} className="mb-3 p2p-trade-screen-chat-bottom-image-container">
                        <img alt="img" src={image} />
                        <div className="p2p-trade-screen-chat-bottom-image-container-close" onClick={() => clearImage(index)}>
                          <TimerOut />
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
              <div className="p2p-trade-screen-chat-bottom-message">
                <input id="image_message" type="file" className="hidden" accept="image/*" multiple onChange={e => onImageMessageChange(e)} />
                <input className="!flex-1" placeholder={formatMessage({id: 'page.body.p2p.trade.write_a_message'})} value={message} onChange={e => setMessage(e.target.value)} />
                <label className="p2p-trade-screen-chat-bottom-send flex items-center ml-3 h-full" htmlFor="image_message">
                  {formatMessage({id: 'page.body.p2p.trade.file'})}
                </label>
                <div
                  // v-if="tradeStore.p2p_trade.state !== 'pending'"
                  className={`p2p-trade-screen-chat-bottom-send flex items-center ml-3 ${disabledSendButton && 'p2p-trade-screen-chat-bottom-send-loading'}`}
                  onClick={SendMessageP2PTrade}
                >
                  {formatMessage({id: 'page.body.p2p.trade.send'})}
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
          title='Messages'
          onGoBack={() => history.push(`/p2p/trade/info/${tid}`)}
        />
        {render()}
        {modalPreivewImage}
      </React.Fragment>
  );
};

export const ProfileP2PTradeMessagesScreen = React.memo(ProfileP2PTradeMessagesScreenComponent);
