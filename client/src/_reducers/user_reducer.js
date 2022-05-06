import { LOGIN_USER } from "../_actions/types";

export default function (state = {}, action) {
  // action에서 보내오는 타입들로 구분하기 위해 switch문 사용
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };

      break;

    default:
      return state;
  }
}
