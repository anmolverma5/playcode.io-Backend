var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
};
