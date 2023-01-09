import { ProcessReducer } from "./process";
import { combineReducers } from "redux";
import {KeyReducer} from "./key";
// define the object and call the action
const rootReducers = combineReducers({
  ProcessReducer: ProcessReducer,
  KeyReducer: KeyReducer,
});
// else return default root reducer
export default rootReducers;