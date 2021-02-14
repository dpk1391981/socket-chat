const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  //get token from header
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization failed!!!" });
  }

  try {
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "token not valid" });
  }
};
