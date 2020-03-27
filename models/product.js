const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let admin = new Schema({
  username: { type: String, unique: true },
  password: String,
  email: String,
  img: { data: Buffer, type: String }
});

const admin_schema = mongoose.model("admin", admin);

module.exports = { admin: admin_schema };
