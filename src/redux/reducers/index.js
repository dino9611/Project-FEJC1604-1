import { combineReducers } from "redux";
import AuthReducers from "./authReducers";

export default combineReducers({
  Auth: AuthReducers,
});
