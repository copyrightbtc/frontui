import * as actions from './actions';
import {
    documentationReducer,
    DocumentationState,
    initialDocumentationState,
} from './reducer';
import { DocTradeUserApiDataInterface } from './types';

describe('Documentation reducer', () => {
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

    it('should handle DOC_TRADE_USER_API_FETCH', () => {
        const expectedState: DocumentationState = {
            ...initialDocumentationState,
            loading: true,
            timestamp: Math.floor(Date.now() / 1000),
        };
        expect(documentationReducer(initialDocumentationState, actions.docTradeUserApiFetch())).toEqual(expectedState);
    });

    it('should handle DOC_TRADE_USER_API_DATA', () => {
        const expectedState: DocumentationState = {
            ...initialDocumentationState,
            data: fakeResponse,
            success: true,
        };
        expect(documentationReducer(initialDocumentationState, actions.docTradeUserApiData(fakeResponse))).toEqual(expectedState);
    });

    it('should handle DOC_TRADE_USER_API_ERROR', () => {
        const fakeError = { code: 500, message: ['Server error'] };
        const expectedState: DocumentationState = {
            ...initialDocumentationState,
            error: fakeError,
        };
        expect(documentationReducer(initialDocumentationState, actions.docTradeUserApiError(fakeError))).toEqual(expectedState);
    });
});
