import { combineReducers } from 'redux';
import chatReducer from './chatReducer';
import loadMessageReducer from './loadMessageReducer';
import appReducer from './appReducer.js';
import patientListReducer from './patientListReducer';
import currentUserReducer from './currentUserReducer';
import pubnubReducer from './pubnubReducer';
import currentModeReducer from './currentModeReducer';
import errorReducer from './errorReducer';

export default combineReducers({
    chat : chatReducer,
    msgs : loadMessageReducer,
    app  : appReducer,
    chats : patientListReducer,
    user : currentUserReducer,
    pubnub : pubnubReducer,
    mode : currentModeReducer,
    err : errorReducer
  }
);
