import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/messaging';
import 'firebase/storage';
// import ReduxSagaFirebase from 'redux-saga-firebase';
import { config } from '../constants/firebase';

const shzInit = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
// const reduxSagaFirebase = new ReduxSagaFirebase(shzInit);
const db = firebase.database(shzInit);
export const ref = firebase.database().ref();
export const storageRef = firebase.storage().ref();
export const storage = firebase.storage();
export const firebaseAuth = firebase.auth();
export const created = firebase.database.ServerValue.TIMESTAMP;
// export const messaging = firebase.messaging();
const firestore = firebase.firestore();
// firestore.settings({ timestampsInSnapshots: true });
export {
    firestore, db, firebase, //reduxSagaFirebase
};
