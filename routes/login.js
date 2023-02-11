const express = require("express");
const router = express.Router();
const constantObj = require("../config/constants");
const generateAccessToken = require("../config/generateToken");
router.post("/", async (req, res, next) => {
  if (!req.body.email)
    return res.status(404).json({
      success: false,
      message: constantObj.constants.user.EMAIL_REQUIRED,
    });
  if (!req.body.loginCode)
    return res.status(404).json({
      success: false,
      message: constantObj.constants.user.LOGIN_CODE_REQUIRED,
    });
  const email = req.body.email;
  const login_code = req.body.loginCode;
  knex
    .raw(
      `SELECT * FROM users WHERE login_code = '${login_code}' AND  email = '${email}'`
    )
    .then((resp) => {
      let users = resp[0][0];
      if (resp[0].length) {
        console.log("response found it", JSON.stringify(users));
        const token = generateAccessToken({ username: users.email });
        // res.json();
        users.access_token = token;
        return res.status(200).json({
          success: true,
          code: 200,
          message: constantObj.constants.user.SUCCESSFULLY_LOGGEDIN,
          data: users,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Please enter login code right",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "An error occurred, please try again later.",
      });
    });
});

module.exports = router;
