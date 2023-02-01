"use strict";
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "balbahdur8699@gmail.com",
    pass: "zszgbswpzvhoggke",
  },
});

module.exports = transporter;
