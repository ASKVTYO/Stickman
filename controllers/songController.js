const multer = require("multer");
const path = require("path");
const ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");
var { song } = require("../models/product");
//Image storage using  multer

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "/home/bunny/Desktop/practice/uploads");
  },
  filename: function (req, file, callback) {
    // callback(null, file.fieldname + "-" + "id");
    callback(null, file.fieldname + "-" + Date.now());
    console.log(file.id);
  },
});

exports.getMusic = (req, res) => {
  var display = song.findOne(
    { _id: ObjectID(req.params.trackID) },
    (err, result) => {
      console.log("inside");
      console.log(result);
      console.log(
        path.join(__dirname, "../uploads", "/music" + "-" + result.id)
      );
      res.sendFile(
        path.join(
          __dirname,
          "../uploads",
          "/Dil Laya Dimaag Laya_320(PaglaSongs).mp3"
        )
      );
      if (err) return console.error(err);
    }
  );
};

exports.postMusic = (req, res) => {
  var upload = multer({ storage: storage }).single("music");
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.send("Error uploading file.");
    } else if (!req.body.name) {
      return res.status(400).send("name of the song is missing");
    }

    var newSong = new song(req.body);
    console.log(newSong);
    newSong.save();
    console.log(storage.getFilename.file);

    res.send("song id : " + newSong.id);
  });
};

exports.updateMusic = (req, res) => {
  song.findByIdAndUpdate(
    { _id: req.params.trackID },
    {
      name: req.body.name,
      genre: req.body.genre,
      music: req.body.music,
      groupTag: req.body.groupTag,
    },
    (result, err) => {
      console.log("inside");
      if (err) console.log(err);

      res.send("success");
    }
  );
  
};
