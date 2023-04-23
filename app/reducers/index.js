import {combineReducers} from 'redux';
import applicationReducer from './application';
import configReducer from './config';
import user from './user';
import wish from './wish';

export default combineReducers({
  application: applicationReducer,
  config: configReducer,
  wish:wish,
  user:user
});
