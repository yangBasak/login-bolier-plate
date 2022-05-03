import React, { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
      <form style={{ display: "flex", flexDirection: "column" }}>
        <label>이메일</label>
        <input type="email" value={email} onChange={onEmailHandler} />
        <label>비밀번호</label>
        <input type="password" value={password} onChange={onPasswordHandler} />
        <br />
        <button>로그인</button>
      </form>
    </div>
  );
}

export default LoginPage;
