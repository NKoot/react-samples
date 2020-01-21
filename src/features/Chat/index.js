import _ from 'lodash';
import { Record } from 'immutable';
import {
    ref, storageRef, firebaseAuth, created
} from '../../helpers/Firebase';
import { USER_IS_LOGOUT } from '../Auth';

export const moduleName = 'Chat';
const prefix = `${moduleName}`;

/**
 * Constants
 * */
export const SAVE_ERROR = `${prefix}/SAVE_ERROR`;
export const DATA_LOADED = `${prefix}/DATA_LOADED`;
export const OPEN_CHAT_DIALOG = `${prefix}/OPEN_CHAT_DIALOG`;
export const CHAT_DEACTIVATE = `${prefix}/CHAT_DEACTIVATE`;
export const ADMINS_FETCHED = `${prefix}/ADMINS_FETCHED`;
export const CHAT_FETCHED = `${prefix}/CHAT_FETCHED`;
export const START_TYPING = `${prefix}/START_TYPING`;
export const STOP_TYPING = `${prefix}/STOP_TYPING`;

const initialState = Record({
    loading: true,
    activeChat: {},
    admins: null,
    isChatDialogOpened: false
});

/**
 * Reducer
 * */
export default function reducer(state = initialState(), action) {
    const { type, payload } = action;
    switch (type) {
    case USER_IS_LOGOUT:
        return initialState();
    case CHAT_FETCHED:
        return state.set('loading', false).set('activeChat', payload);
    case ADMINS_FETCHED:
        return state.set('admins', payload);
    case OPEN_CHAT_DIALOG:
        return state.set('isChatDialogOpened', payload);
    default:
        return state;
    }
}

/**
 * Action Creators
 * */
function chatPropsOn(chatId, currentUserId) {
    const activeRef = ref.child(`chats/${chatId}/active`).child(currentUserId);
    const typingRef = ref.child(`chats/${chatId}/typing`).child(currentUserId);
    const unreadRef = ref.child(`users/${currentUserId}/unreadMessages`).child(chatId);
    activeRef.onDisconnect().set(null).then(() => {
        activeRef.off();
    });
    typingRef.onDisconnect().set(null).then(() => {
        typingRef.off();
    });
    activeRef.set(true).then(() => unreadRef.set(null)).then(() => unreadRef.off()).catch(console.error);
}

function openChatDialog(dispatch, bool) {
    dispatch({
        type: OPEN_CHAT_DIALOG,
        payload: bool
    });
}

function chatPropsOff(chatId, currentUserId) {
    const activeRef = ref.child(`chats/${chatId}/active`).child(currentUserId);
    const typingRef = ref.child(`chats/${chatId}/typing`).child(currentUserId);
    activeRef.set(null).then(() => activeRef.off()).then(() => typingRef.off()).catch(console.error);
}

function createNewChat(chatId, admins) {
    const { currentUser } = firebaseAuth;
    const newData = {
        info: {
            type: 'admin',
            creator: currentUser.uid,
            created
        },
        users: _.reduce(Object.keys(admins), (result, uid) => {
            result[uid] = {
                kicked: false,
                type: 'admin'
            };
            return result;
        }, {})
    };

    newData.users[currentUser.uid] = {
        kicked: false,
        type: 'user'
    };
    ref.child(`chats/${chatId}`).set(newData);
}


export const fetchChat = () => (dispatch, getStore) => {
    const { currentUser } = firebaseAuth;
    const chatId = currentUser.uid;
    const chatRef = ref.child('chats').child(chatId);
    let { admins } = getStore().Chat;
    if (!admins) {
        ref.child('users').orderByChild('info/type').equalTo('admin').on('value', (snap) => {
            admins = snap.val();
            dispatch({
                type: ADMINS_FETCHED,
                payload: admins
            });
        });
    }
    chatRef.on('value', (snap) => {
        if (snap.exists()) {
            const activeChat = { ...snap.val(), id: snap.key };
            let allMessages = _.reduce(_.get(snap.val(), 'messages', []), (result, value, key) => {
                result.push({ ...value, id: key });
                return result;
            }, []);

            allMessages = _.orderBy(allMessages, ['created'], ['asc']);
            dispatch({
                type: CHAT_FETCHED,
                payload: { ...activeChat, $messages: allMessages }
            });
            // chatPropsOn(snap.key, currentUser.uid);
            // openChatDialog(dispatch, true);
        } else {
            createNewChat(chatId, admins);
        }
    });
};

export const setUserActiveAfterDisconnect = (chat, currentUser) => (dispatch) => {
    const activeRef = ref.child(`chats/${chat.id}/active`).child(currentUser.id);
    activeRef.onDisconnect().set(null).then(() => {
        activeRef.off();
    });
    activeRef.set(true).then(() => {
        activeRef.off();
    }).catch((error) => {
        console.log('setUserActiveAfterDisconnect error', error);
    });
};

export const chatActivate = (chatId, currentUserId) => (dispatch) => {
    chatPropsOn(chatId, currentUserId);
    openChatDialog(dispatch, true);
};

export const chatDeactivate = (chatId, currentUserId) => (dispatch) => {
    chatPropsOff(chatId, currentUserId);
    openChatDialog(dispatch, false);
};

export const setTypingState = (chat, currentUser, typingState = null) => (dispatch) => {
    const typingRef = ref.child(`chats/${chat.id}/typing`).child(currentUser.id);
    typingRef.onDisconnect().set(null).then(() => {
        typingRef.off();
    }).catch(console.error);
    typingRef.set(typingState).catch(console.error);
};

export const postTextMessage = (chat, message) => (dispatch) => {
    const newMessageRef = ref.child(`chats/${chat.id}/messages`).push();
    newMessageRef.set(message).catch((error) => {
        console.log('postTextMessage error', error);
    });
};

export const postFileMessage = (chat, message) => (dispatch) => {
    const newMessageRef = ref.child(`chats/${chat.id}/messages`).push();
    const imageRef = storageRef.child(`images/chats/${chat.id}/${newMessageRef.key}/${message.image.name}`);
    imageRef.put(message.image)
        .then(() => imageRef.getDownloadURL())
        .then((url) => {
            newMessageRef.set({ ...message, image: url });
            return { ...message, image: url };
        })
        .catch((error) => {
            console.log('postFileMessage error', error);
        });
};
