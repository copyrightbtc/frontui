import * as actions from './actions';
import {
    DOC_TRADE_USER_API_DATA,
    DOC_TRADE_USER_API_ERROR,
    DOC_TRADE_USER_API_FETCH,
} from './constants';
import { DocTradeUserApiDataInterface } from './types';

describe('Documentation actions', () => {
    const fakeResponse: DocTradeUserApiDataInterface = {
        info: {
            title: 'Tradesfor User API v2',
            description: 'API for Tradesfor application.',
            contact: {
                name: 'sfor.trade',
                email: 'hello@sfor.trade',
                url: 'https://www.sfor.trade',
            },
            license: {
                url: 'https://github.com/sfortrade/tradesfor/blob/master/LICENSE.md',
            },
            version: '2.6.0-89e3acd',
        },
        swagger: '2.0',
        produces: [
            'application/json',
        ],
        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                name: 'JWT',
                in: 'header',
            },
        },
        host: 'localhost:3000',
        basePath: '/api/v2/tradesfor',
        tags: [
            {
                name: 'api',
                description: 'Operations about apis',
            },
        ],
        paths: {},
        definitions: {},
    };

    it('should check DocTradeUserApiFetch action creator', () => {
        const expectedAction = { type: DOC_TRADE_USER_API_FETCH };
        expect(actions.docTradeUserApiFetch()).toEqual(expectedAction);
    });

    it('should check DocTradeUserApiData action creator with market pair', () => {
        const payload = fakeResponse;
        const expectedAction = { type: DOC_TRADE_USER_API_DATA, payload };
        expect(actions.docTradeUserApiData(payload)).toEqual(expectedAction);
    });

    it('should check DocTradeUserApiError action creator', () => {
        const fakeError = { code: 500, message: ['Server error'] };
        const expectedAction = { type: DOC_TRADE_USER_API_ERROR, payload: fakeError };
        expect(actions.docTradeUserApiError(fakeError)).toEqual(expectedAction);
    });
});
