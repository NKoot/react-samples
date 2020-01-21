import { Record } from 'immutable';
import {
    all, put, call, takeLatest, take
} from 'redux-saga/effects';
import { eventChannel, buffers } from 'redux-saga';
import { ref, firebaseAuth } from '../../helpers/Firebase';

export const moduleName = 'Auth';
const prefix = `${moduleName}`;

/**
 * Constants
 * */
export const USER_IS_LOGIN = `${prefix}/USER_IS_LOGIN`;
export const USER_IS_LOGOUT = `${prefix}/USER_IS_LOGOUT`;
export const USER_LOGIN_ERROR = `${prefix}/USER_LOGIN_ERROR`;
export const DISPATCH_AUTH = `${prefix}/DISPATCH_AUTH`;
export const LOAD_USER_DATA = `${prefix}/LOAD_USER_DATA`;
export const DATA_LOADED = `${prefix}/DATA_LOADED`;
export const CREATE_NEW_USER = `${prefix}/CREATE_NEW_USER`;


/**
 * Actions
 **/
export const preFetchAuthState = () => ({ type: DISPATCH_AUTH });

export const dataLoaded = (payload) => ({
    type: DATA_LOADED,
    payload
});

const userIsLogin = () => ({ type: USER_IS_LOGIN });

export const setError = (error) => ({
    type: USER_LOGIN_ERROR,
    payload: error
});

export const resetAuthError = () => ({
    type: USER_LOGIN_ERROR,
    payload: false
});

export const logout = () => ({ type: USER_IS_LOGOUT });

export const createNewUser = (uid) => ({ type: CREATE_NEW_USER, uid });

export const loadUserInfo = (uid) => {
    if (uid) {
        return { type: LOAD_USER_DATA, payload: uid };
    }
    console.log('...ELSE');
    // some action, maybe logout
};

const initialState = Record({
    isAuth: false,
    currentUser: {},
    error: false,
    loading: true
});

/**
 * Reducer
 * */

export default function reducer(state = initialState(), action) {
    const { type, payload } = action;
    switch (type) {
    case USER_IS_LOGIN:
        return state.set('isAuth', true).set('loading', false);
    case USER_IS_LOGOUT:
        return state.set('isAuth', false).set('currentUser', {});
    case USER_LOGIN_ERROR:
        return state.set(payload).set('loading', false);
    case DATA_LOADED:
        return state.mergeDeep(payload).set('error', false).set('loading', false);
    default:
        return state;
    }
}

/**
 * Sagas
 * **/
export const createEventChannel = (uid) => () => eventChannel((emit) => {
    const userRef = ref.child(`users/${uid}`);
    userRef.on('value', (snap) => {
        emit(snap);
    });
    return () => userRef.off();
}, buffers.expanding());

export function* listenCurrentUserSaga(data) {
    const uid = data.payload;
    const createdEventChannel = createEventChannel(uid);
    const channel = yield call(createdEventChannel);
    while (true) {
        const snap = yield take(channel);
        if (snap.exists()) {
            yield put(dataLoaded({
                currentUser: { ...snap.val(), id: uid }
            }));
            yield put(userIsLogin());
        } else {
            yield put(createNewUser(uid));
        }
    }
}

export function* createNewUserSaga(data) {
    const { uid } = data;
    const user = {
        info: {
            type: 'user'
        }
    };
    try {
        const userRef = ref.child(`users/${uid}`);
        yield call([userRef, userRef.set], user);
    } catch (e) {
        console.log('Cant create new user', e);
    }
}

function getAuthChannel() {
    return eventChannel((emit) => firebaseAuth.onAuthStateChanged((user) => emit({ user })));
}

export function* dispatchAuthSaga() {
    const channel = yield call(getAuthChannel);
    while (true) {
        const { error, user } = yield take(channel);
        if (user) {
            yield put(loadUserInfo(user.uid));
        } else {
            yield put(setError(error));
        }
    }
}

export function* signOutSaga() {
    const { currentUser } = firebaseAuth;
    ref.child(`users/${currentUser.uid}`).off();
    try {
        yield call([firebaseAuth, firebaseAuth.signOut]);
        yield put(dataLoaded({ isAuth: false, currentUser: {} }));
    } catch (error) {
        console.error();
        yield put(setError(error));
    }
}

export function* saga() {
    yield all([
        takeLatest(DISPATCH_AUTH, dispatchAuthSaga),
        takeLatest(LOAD_USER_DATA, listenCurrentUserSaga),
        takeLatest(CREATE_NEW_USER, createNewUserSaga),
        takeLatest(USER_IS_LOGOUT, signOutSaga)
    ]);
}
