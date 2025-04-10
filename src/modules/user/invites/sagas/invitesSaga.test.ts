import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { invitesData, invitesError, invitesFetch, rootSaga, sendError } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';

describe('Module: Invites', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware;
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, false)();
        sagaMiddleware.run(rootSaga);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const fakeInvites = [
      {"email": "test1@gmail.com", "uid": "ID12378329841", "total": "0.03", "created_at": "2024-05-24T15:30:12", "updated_at": "2024-05-24T15:30:12"},
      {"email": "test2@gmail.com", "uid": "ID12456329843", "total": "0.21", "created_at": "2024-05-24T15:30:12", "updated_at": "2024-05-24T15:30:12"},
      {"email": "test3@gmail.com", "uid": "ID12366329844", "total": "0.11", "created_at": "2024-05-24T15:30:12", "updated_at": "2024-05-24T15:30:12"},
      {"email": "test4@gmail.com", "uid": "ID12226329845", "total": "3.21", "created_at": "2024-05-24T15:30:12", "updated_at": "2024-05-24T15:30:12"},
      {"email": "test5@gmail.com", "uid": "ID12124329846", "total": "6.21", "created_at": "2024-05-24T15:30:12", "updated_at": "2024-05-24T15:30:12"}
    ]

    const mockInvites = () => {
        mockAxios.onGet('/account/invites').reply(200, fakeInvites);
    };

    const expectedActionsFetch = [
        invitesFetch(),
        invitesData(fakeInvites),
    ];

    const expectedActionsError = [
      invitesFetch(),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: invitesError,
            },
        }),
    ];

    it('should fetch invites in success flow', async () => {
      mockInvites();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve('');
                }
            });
        });

        store.dispatch(invitesFetch());

        return promise;
    });

    it('should trigger an error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsError.length) {
                    expect(actions).toEqual(expectedActionsError);
                    resolve('');
                }
            });
        });
        store.dispatch(invitesFetch());

        return promise;
    });
});
