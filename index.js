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

//서버 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
