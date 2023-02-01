"use strict";

var cfg = require("./database-connection");
var knex = require("knex")(cfg.client);
module.exports = cfg;
