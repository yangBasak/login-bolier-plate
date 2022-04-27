const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: { type: String, maxlength: 50 },
  email: { type: String, trim: true, unique: 1 },
  password: { type: String, minlength: 5 },
  lastname: { type: String, maxlength: 5 },
  role: { type: Number, default: 0 },
  image: String,
  token: { type: String },
  tokenExp: { type: Number },
});

userSchema.pre("save", function (next) {
  let user = this; //위의 스키마를 가리킴
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.getToken = function (cb) {
  let user = this;
  let token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  let user = this;
  //토큰 decode
  jwt.verify(token, "secretToken", function (err, decoded) {
    // 유저 아이디로 유저 찾기
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
  // 클라이언트에 가져온 토큰과 DB 토큰 일치하는지 확인
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
