import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

export default function (SpecificComponent, option, adminRoute = null) {
  /* Option 값
        null = 아무나 출입 가능
        true = 로그인 한 사람만
        false = 로그인 안한 사람만
    */
  /* adminRoute = 관리자인지 아닌지. 기본값은 null이다.
   
   */
  function AuthenticationCheck() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      dispatch(auth()).then((res) => {
        if (!res.payload.isAuth) {
          //비로그인
          if (option) {
            navigate("/login");
          }
        } else {
          //로그인
          if (adminRoute && !res.payload.isAdmin) {
            navigate("/");
          } else {
            if (!option) {
              navigate("/");
            }
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
