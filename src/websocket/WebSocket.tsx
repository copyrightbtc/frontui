import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementalOrderBook } from 'src/api';
import {
    depthData,
    depthDataIncrement,
    depthDataSnapshot,
    depthIncrementSubscribe,
    klinePush,
    marketsTickersData, 
    pushHistoryEmit,
    recentTradesPush,
    selectCurrentMarket,
    selectKline,
    selectOrderBookSequence,
    selectOrdersHideOtherPairsState,
    selectUserFetching,
    selectUserLoggedIn, 
    updateWalletsDataByRanger,
    userOpenOrdersUpdate,
    userOrdersHistoryRangerData,
    walletsAddressDataWS,
    pushP2PConversationsEmit,
    updateP2PTradeEmit,
    updateP2PAdvertisementEmit,
} from "../modules";
import {
    formatTicker,
    generateSocketURI,
    isTradingPage,
    marketKlineStreams,
    streamsBuilder,
} from './helpers';
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useLocation } from 'react-router-dom'; 

const WebSocketContext = React.createContext(null);

export default ({ children }) => {
    const [ subscriptions, setSubscriptions ] = useState<string[]>(undefined);
    const [ socketUrl, setSocketUrl ] = useState<string>(null);
    const [ messages, setMessages ] = useState<object[]>([]);

    const dispatch = useDispatch();
    const location = useLocation();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const userLoading = useSelector(selectUserFetching); 
    const currentMarket = useSelector(selectCurrentMarket);
    const previousSequence = useSelector(selectOrderBookSequence);
    const kline = useSelector(selectKline);
    const openOrderHideOtherPairs = useSelector(selectOrdersHideOtherPairsState);

    useEffect(() => {
        if (incrementalOrderBook()) {
            dispatch(depthIncrementSubscribe(currentMarket?.id));
        }
    }, [currentMarket]);

    // generate streams list for first WS connection
    useEffect(() => {
        if (!userLoading && !socketUrl) {
            const streams = streamsBuilder(userLoggedIn,  currentMarket, location.pathname);

            if (streams.length) {
                setSocketUrl(generateSocketURI(userLoggedIn, streams));
            }
        }
    }, [userLoggedIn, currentMarket, userLoading, location, socketUrl]);

    // handle change subscriptions
    useEffect(() => {
        if (!userLoading && typeof(subscriptions) !== 'undefined') {
            const streams = streamsBuilder(userLoggedIn, currentMarket, location.pathname);

            const subscribeStreams = streams.filter(i => !subscriptions?.includes(i));
            if (subscribeStreams.length) {
                subscribe(subscribeStreams);
            }

            const unsubscribeStreams = subscriptions?.filter(i => !streams.includes(i) && !(isTradingPage(location.pathname) && i.includes('kline')));
            if (unsubscribeStreams.length) {
                unsubscribe(unsubscribeStreams);
            }
        }
    }, [userLoggedIn, currentMarket, userLoading, location, subscriptions]);

    // handle k-line subscriptions
    useEffect(() => {
        if (kline.marketId && kline.period && !kline.loading) {
            switch (kline.message) {
                case 'subscribe':
                    subscribe(marketKlineStreams(kline.marketId, kline.period).channels);
                    break;
                case 'unsubscribe':
                    unsubscribe(marketKlineStreams(kline.marketId, kline.period).channels);
                    break;
                default:
                    break;
            }
        }
    }, [kline.period, kline.marketId, kline.message, kline.loading]);

    // handle main websocket events
    const {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
    } = useWebSocket(socketUrl, {
        onOpen: () => {
            window.console.log('WebSocket connection opened');

            for (const m of messages) {
                sendJsonMessage(m);
            }

            setMessages([]);
        },
        onClose: () => {
            window.console.log("WebSocket connection closed");
        },
        onError: error => {
            window.console.log(`WebSocket error ${error}`);
            window.console.dir(error);
        },
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => true,
        retryOnError: true,
    });

    // empty buffer messages
    useEffect(() => {
        if (messages.length) {
            for (const m of messages) {
                sendJsonMessage(m);
            }
    
            setMessages([]);
        }
    }, [messages]);

    const postMessage = useCallback(data => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage(data);
        } else {
            setMessages(messages => [ ...messages, data]);
        }
    }, [readyState, messages]);

    const subscribe = useCallback((streams: string[]) => {
        postMessage({ event: 'subscribe', streams });
    }, []);

    const unsubscribe = useCallback((streams: string[]) => {
        postMessage({ event: 'unsubscribe', streams });
    }, []);

    const updateOpenOrdersState = useCallback(event => {
        if (currentMarket && (event?.market === currentMarket.id || !openOrderHideOtherPairs)) {
            dispatch(userOpenOrdersUpdate(event));
        }
    }, [currentMarket, openOrderHideOtherPairs]);

    // handle websocket events
    useEffect(() => {
        let payload: { [pair: string]: any } = lastJsonMessage;

        for (const routingKey in payload) {
            if (payload.hasOwnProperty(routingKey)) {
                const event = payload[routingKey];

                const orderBookMatch = routingKey.match(/([^.]*)\.update/);
                const orderBookMatchSnap = routingKey.match(/([^.]*)\.ob-snap/);
                const orderBookMatchInc = routingKey.match(/([^.]*)\.ob-inc/);

                // public
                if (orderBookMatch) {
                    if (orderBookMatch[1] === currentMarket?.id) {
                        dispatch(depthData(event));
                    }

                    return;
                }

                // public
                if (orderBookMatchSnap) {
                    if (orderBookMatchSnap[1] === currentMarket?.id) {
                        dispatch(depthDataSnapshot(event));
                    }

                    return;
                }

                // public
                if (orderBookMatchInc) {
                    if (orderBookMatchInc[1] === currentMarket?.id) {
                        if (previousSequence === null) {
                            window.console.log('OrderBook increment received before snapshot');

                            return;
                        }
                        if (previousSequence + 1 !== event.sequence) {
                            window.console.log(`Bad sequence detected in incremental orderbook previous: ${previousSequence}, event: ${event.sequence}`);

                            return;
                        }
                        dispatch(depthDataIncrement(event));
                    }

                    return;
                }

                // public
                const klineMatch = String(routingKey).match(/([^.]*)\.kline-(.+)/);
                if (klineMatch) {
                    dispatch(
                        klinePush({
                            marketId: klineMatch[1],
                            kline: event,
                            period: klineMatch[2],
                        }),
                    );

                    return;
                }

                // public
                const tradesMatch = String(routingKey).match(/([^.]*)\.trades/);
                if (tradesMatch) {
                    dispatch(
                        recentTradesPush({
                            trades: event.trades,
                            market: tradesMatch[1],
                        }),
                    );

                    return;
                }

                switch (routingKey) {
                    // public
                    case 'global.tickers':
                        dispatch(marketsTickersData(formatTicker(event)));

                        return;

                    // public
                    case 'success':
                        switch (event.message) {
                            case 'subscribed':
                            case 'unsubscribed':
                                setSubscriptions(event.streams);
                                return;
                            default:
                        }

                        return;

                    // private
                    case 'order':
                        updateOpenOrdersState(event);
                        dispatch(userOrdersHistoryRangerData(event));

                        return;

                    // private
                    case 'trade':
                        dispatch(pushHistoryEmit(event));

                        return;

                    // private
                    case 'balances': 
                        dispatch(updateWalletsDataByRanger({ ws: true, balances: event }));

                        return;

                    // private
                    case 'deposit_address':
                        dispatch(walletsAddressDataWS(event));

                        return;

                    // public
                    case 'p2p_conversation_message':
                        dispatch(pushP2PConversationsEmit(event));

                        return;

                    case 'p2p_trade':
                        dispatch(updateP2PTradeEmit(event));

                        return;
                    case 'p2p_advertisement':
                        dispatch(updateP2PAdvertisementEmit(event));
 
                    default:
                }
                window.console.log(`Unhandeled websocket channel: ${routingKey}`);
            }
        }
    }, [lastJsonMessage]);

    return (
        <WebSocketContext.Provider value={getWebSocket()}>
            {children}
        </WebSocketContext.Provider>
    )
}

export { WebSocketContext }
