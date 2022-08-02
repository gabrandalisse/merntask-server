const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "the token is missing" });

  try {
    const encode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = encode.user;

    next();
  } catch (error) {
    res.status(401).json({ msg: "invalid token" });
  }
};
