const express = require("express");
const admin = require("./admin");
const song = require("./song");

module.exports = app => {
  app.use("/admin", admin);
  app.use("/song", song);

  app.use("/", (req, res) => {
    res.send("Welcome to backend!!");
  });
};
