import { combineReducers } from "redux";
import user from "./user_reducer";

const rootReducer = combineReducers({
  // 각 리덕스를 합쳐주는 기능
  user,
});

export default rootReducer;
