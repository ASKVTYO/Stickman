const express = require("express");
const admin = require("./admin");

module.exports = app => {
  app.use("/admin", admin);

  app.use("/", (req, res) => {
    res.send("Welcome to backend!!");
  });
};
