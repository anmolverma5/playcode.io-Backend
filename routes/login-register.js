const express = require("express");
const router = express.Router();
const db = require("../config/db");
const transporter = require("../config/mail-cfg");
const constantObj = require("../config/constants");

router.post("/", async (req, res, next) => {
  if (!req.body.email)
    return res.status(404).json({
      success: false,
      message: constantObj.constants.user.EMAIL_REQUIRED,
    });
  const email = req.body.email;
  const login_code = Math.floor(100000 + Math.random() * 900000);

  knex
    .raw(`SELECT * FROM users WHERE email = '${email}'`)
    .then(async function (resp) {
      if (resp[0].length) {
        knex
          .raw(
            `UPDATE users SET updated_at = CURRENT_TIMESTAMP, login_code = ${login_code} WHERE email = '${email}'`
          )
          .then(async function (resp) {
            try {
              await mailSendFunction(email, login_code);
              return res.status(200).json({
                success: true,
                code: 200,
                message: constantObj.constants.user.LOGIN_CODE,
              });
            } catch (error) {
              console.log("try catch error", error);
            }
          });
      } else {
        knex("users")
          .where(knex.raw(`email = ${email}`))
          .then(async function (response) {
            console.log("response", response);
          });
        knex("users")
          .insert({ email, login_code })
          .then((id) => {
            //get user by id
            knex("users")
              .select({
                id: "id",
                email: "email",
                login_code: "login_code",
              })
              .whereRaw(`id = ${id}`)
              .then(async function (users) {
                // return res.json(users[0]);
                return res.status(200).json({
                  success: true,
                  code: 200,
                  message: constantObj.constants.user.SUCCESSFULLY_LOGGEDIN,
                  data: users,
                });
              });
          })
          .catch((err) => {
            console.error(err);
            return res.status(400).json({
              success: false,
              message: "An error occurred, please try again later.",
            });
          });
      }
    });
  async function mailSendFunction(email, login_code) {
    var mailOptions = {
      from: "balbahdur8699@gmail.com",
      to: email,
      subject: "Login from playcode.io",
      text: "Login password:" + login_code,
    };
    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Login password: " + info.response);
      }
    });
  }
});

module.exports = router;
