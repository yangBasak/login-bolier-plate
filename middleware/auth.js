const { User } = require("../models/user");

let auth = (req, res, next) => {
  //인증처리하는곳
  // 1. 클라이언트 쿠키에서 토큰 가져옴
  let token = req.cookies.x_auth;
  // 2. 토큰 복호화 한 후 유저 찾기
  User.findByToken(token, (err, user) => {
    // 3. 유저 있으면 인증 완, 없으면 노
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    req.token = token;
    req.user = user;
    next();
  });
};
module.exports = { auth };
