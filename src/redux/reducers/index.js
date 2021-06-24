import { combineReducers } from "redux";
import AuthReducers from "./authReducers";
import UserReducers from './userReducers';

export default combineReducers({
  Auth: AuthReducers,
  User: UserReducers
});