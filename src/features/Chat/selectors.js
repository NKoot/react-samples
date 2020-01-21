import { createSelector } from 'reselect';

export const moduleName = 'Chat';
/**
 * Selectors
 * */

export const stateSelector = (state) => state[moduleName];
export const activeChatSelector = createSelector(
    stateSelector,
    (state) => state.activeChat
);
export const usersSelector = createSelector(
    stateSelector,
    (state) => state.admins
);
export const isChatDialogOpenedSelector = createSelector(
    stateSelector,
    (state) => state.isChatDialogOpened
);
export const isChatLoadingSelector = createSelector(
    stateSelector,
    (state) => state.loading
);
