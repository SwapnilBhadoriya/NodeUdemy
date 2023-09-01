const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].replace("Bearer", "").trim();

    const decoded = jwt.verify(token, "secretkey");

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    return res.status(401).send({ error: "Please authenticate ." });
  }
};

module.exports = auth;
