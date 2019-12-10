const express = require("express");

const db = require("./data/dbConfig.js");

const server = express();

const AccountRouter = require("./data/accounts/accounts-router");

server.use(express.json());

server.use("/api/accounts", AccountRouter);

module.exports = server;
