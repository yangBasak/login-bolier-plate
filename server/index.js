const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/user");
const mongoose = require("mongoose");

//bodyParser 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//cookieParser
app.use(cookieParser());

//mongoDB 연결
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("몽고DB 연결");
  })
  .catch((err) => {
    console.log(err);
  });

// 라우터 설정
app.get("/", (req, res) => {
  res.send("Hello World!!");
});
app.post("/api/user/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});
app.post("/api/user/login", (req, res) => {
  // 1. 요청된 이메일 DB에 있는지
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일 없음",
      });
    }
    // 2. DB에 있으면 비밀번호 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호 틀림",
        });
      }
      //3. 토큰 생성
      user.getToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/user/auth", auth, (req, res) => {
  // auth는 인증해주는 미들웨어
  res.status(200),
    json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true, //0이면 일반, 아니면 관리자st
      isAuth: true,
      email: req.user.email,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image,
    });
});

app.get("/api/user/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    res.status(200).send({ success: true });
  });
});
//서버 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
