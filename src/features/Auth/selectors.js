import { createSelector } from 'reselect';
import _ from 'lodash';
import { moduleName } from './index';

/**
 * Selectors
 * */
export const stateSelector = (state) => state[moduleName];
export const isAuthSelector = createSelector(
    stateSelector,
    (state) => state.isAuth
);
export const loadingSelector = createSelector(
    stateSelector,
    (state) => state.loading
);
export const isAuthErrorSelector = createSelector(
    stateSelector,
    (state) => state.error
);
export const currentUserSelector = createSelector(
    stateSelector,
    (state) => state.currentUser || {}
);
export const unreadMessagesSelector = createSelector(
    stateSelector,
    (state) => _.get(state.currentUser, ['unreadMessages'], {})
);

