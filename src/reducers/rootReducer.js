import authReducer from './authReducer';

import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';
import { combineReducers } from 'redux';

export default combineReducers({
    authReducer: authReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
});