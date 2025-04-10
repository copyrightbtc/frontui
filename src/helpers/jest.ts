import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Action, Middleware } from 'redux';
import configureMockStore from 'redux-mock-store';
import { Sfortrade } from '../api';

// tslint:disable-next-line
import * as WebSocket from 'ws';

const mockConfig: Config = {
    api: {
        authUrl: '/api/v2/authsfor',
        tradeUrl: '/api/v2/tradesfor',
        applogicUrl: '/api/v2/applogic',
        rangerUrl: '/api/v2/ranger',
        p2pUrl: '/api/v2/p2p',
    },
    withCredentials: false,
    incrementalOrderBook: true,
    isResizable: false,
    isDraggable: false,
    sentryEnabled: true,
    captchaLogin: true,
    usernameEnabled: false,
    gaTrackerKey: '',
    minutesUntilAutoLogout: '240',
    msAlertDisplayTime: '5000',
    msPricesUpdates: '1000',
    sessionCheckInterval: '15000',
    balancesFetchInterval: '3000',
    passwordEntropyStep: '14',
    password_min_entropy: '',
    storage: {
        defaultStorageLimit: '50',
        orderBookSideLimit: '50'
    },
    languages: ['en', 'ru'],
    kycSteps: [
        //'email',
        'phone',
        'profile',
        'document',
        //'address'
    ],
};

// tslint:disable no-any no-console
export const loggerMiddleware: Middleware = (store: {}) => (next: any) => (action: Action) => {
    console.log(`dispatching: ${JSON.stringify(action)}`);

    return next(action);
};

export const setupMockStore = (appMiddleware: Middleware, log = false) => {
    const middlewares = log ? [loggerMiddleware, appMiddleware] : [appMiddleware];

    return configureMockStore(middlewares);
};

export const setupMockAxios = () => {
    Sfortrade.config = mockConfig;

    return new MockAdapter(Axios);
};

export const mockNetworkError = (mockAxios: any) => {
    mockAxios.onAny().networkError();
};

export const createEchoServer = (port: number, debug: boolean) => {
    const server = new WebSocket.Server({ port: port });
    server.on('connection', (ws, request) => {
        if (debug) {
            ws.addEventListener('open', () => {
                console.log(`Ping Server: listening on port ${port}`);
            });
        }
        ws.on('message', (message: string) => {
            if (debug) {
                console.log(`Ping Server: sending back ${message}`);
            }
            ws.send(message);
        });
    });

    return server;
};
