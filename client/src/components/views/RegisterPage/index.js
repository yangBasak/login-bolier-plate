import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";
import Auth from "../../../hoc/auth";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onNameHandler = (e) => {
    setName(e.currentTarget.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };
  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.currentTarget.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault(); //리프레쉬 방지

    if (password !== confirmPassword) {
      return alert("비밀번호 동일 x");
    }

    let param = {
      email: email,
      password: password,
      name: name,
    };

    dispatch(registerUser(param)).then((res) => {
      if (res.payload.success) {
        navigate("/");
      } else {
        alert("회원가입 실패");
      }
    });
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
      <form style={{ display: "flex", flexDirection: "column" }} onSubmit={onSubmitHandler}>
        <label>이메일</label>
        <input type="email" value={email} onChange={onEmailHandler} />
        <label>이름</label>
        <input type="text" value={name} onChange={onNameHandler} />
        <label>비밀번호</label>
        <input type="password" value={password} onChange={onPasswordHandler} />
        <label>비밀번호 확인</label>
        <input type="password" value={confirmPassword} onChange={onConfirmPasswordHandler} />
        <br />
        <button>회원가입</button>
      </form>
    </div>
  );
}

// export default RegisterPage;
export default RegisterPage;
