const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let client = new Schema({
  username: { type: String, unique: true },
  password: String,
  email: String,
  img: { data: Buffer, type: String }
});

let song = new Schema({
  name: { type: String, unique: true },
  genre: String,
  music: String,
  groupTag: String
});

const admin_schema = mongoose.model("client ", client);
const song_schema = mongoose.model("song", song);

module.exports = { client: admin_schema, song: song_schema };
