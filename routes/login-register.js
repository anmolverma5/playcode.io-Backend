const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res, next) => {
  if (!req.body.email)
    return res.json({ success: false, message: "email is required" });
  const email = req.body.email;
  const login_code = Math.floor(100000 + Math.random() * 900000);

  knex("users")
    .insert({ email, login_code })
    .then((id) => {
      //get user by id
      knex("users")
        .select({
          id: "id",
          email: "email",
          login_code: "login_code"
        })
        .whereRaw(`id = ${id}`)
        .then((users) => {
          return res.json(users[0]);
        });
    })
    .catch((err) => {
      console.error(err);
      return res.json({
        success: false,
        message: "An error occurred, please try again later.",
      });
    });
});

module.exports = router;
