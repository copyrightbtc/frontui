import { CommonError } from '../../types';
import { UsernameAction } from './actions';
import { USERNAME_DATA, USERNAME_ERROR, USERNAME_FETCH } from './constants';

export interface UsernameState {
  fetch: {
      success?: boolean;
      error?: CommonError;
  };
}

export const initialStateUsername: UsernameState = {
    fetch: {
        success: false,
    },
};

const usernameFetchReducer = (state: UsernameState['fetch'], action: UsernameAction) => {
    switch (action.type) {
        case USERNAME_FETCH:
            return {
                ...state,
                success: false,
                error: undefined,
            };
        case USERNAME_DATA:
            return {
                ...state,
                success: true,
                error: undefined,
            };
        case USERNAME_ERROR:
            return  {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};

export const usernameReducer = (state = initialStateUsername, action: UsernameAction) => {
    switch (action.type) {
        case USERNAME_FETCH:
        case USERNAME_DATA:
        case USERNAME_ERROR:
            const usernameState = { ...state.fetch };

            return {
                ...state,
                fetch: usernameFetchReducer(usernameState, action),
            };
        default:
            return state;
    }
};
