const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const config = require("./config/key");
const { User } = require("./models/user");
const mongoose = require("mongoose");

//bodyParser 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
app.post("/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});
app.post("/login", (res, req) => {
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
      /*
        user는 현재 find 된 유저 정보. 여기서 .을 찍는게 무슨의미이지? 
        그리고 comparePassword가 user.js쪽에 있는데 거기 있는 메소드를 어떻게 실행시킨거야? 
      */
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호 틀림",
        });
      }
      //3. 토큰 생성
      user.getToken((err, user) => {});
    });
  });
});

//서버 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
