const mongodb = require("mongodb");
var config = require("config");
const session = require("express-session");
const crypto = require("crypto");
const fs = require("fs");
const multer = require("multer");
const assert = require("assert");
var { client } = require("../models/product");
const ObjectID = require("mongodb").ObjectID;
const { Readable } = require("stream");

//Image storage using  multer

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "/home/bunny/Desktop/practice/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now());
  },
});

function hash(input, salt) {
  //creating hash
  var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, "sha512");
  return ["pbkdf2", "10000", salt, hashed.toString("hex")].join("$");
}

exports.getSomething = (req, res) => {
  res.send("Welcome !!");
};

exports.postCreateAdmin = (req, res) => {
  // console.log("inside");
  let newAdmin = new client(req.body);
  console.log(req.body);
  console.log(newAdmin);
  let password = newAdmin.password;
  console.log(password);
  let salt = crypto.randomBytes(128).toString("hex");
  let hashedPassword = hash(password, salt);
  newAdmin.password = hashedPassword;
  console.log(newAdmin.password);
  console.log("hi");
  var upload = multer({ storage: storage }).single("photo");
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.send("Error uploading file.");
    }
    console.log("File is uploaded");
    res.send("File successfully uploaded");
  });
  newAdmin
    .save()
    .then((newAdmin) => {
      console.log(newAdmin);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Adding new admin failed");
    });
};

exports.getAdminLogin = (req, res) => {
  res.send("Hi Admin");
};

exports.postAdminLogin = (req, res) => {
  var admin_details = req.body;
  var user = client.findOne(
    { username: admin_details.username },
    (err, user) => {
      if (err) throw err;
      if (user) {
        var realpass = user.password;
        salt = realpass.split("$")[2];
        admin_hash = hash(admin_details.password, salt);
        if (admin_hash === user.password) {
          req.session.admin = true;
          console.log(req.files);
          req.session.__v = user.__v;
          req.session._id = user._id;
          res.status(200).send("Admin Successfully loggedin");
        } else {
          res.status(204).send("Incorrect Password");
        }
      } else {
        (err) => console.log(err);
        res.status(400).send("Invalid Login Credentials");
      }
    }
  );
};

exports.getDisplayImage = (req, res) => {
  console.log(req.session._id);
  var user = admin.findOne({ _id: req.session._id }, (err, result) => {
    if (err) console.log(err);
    if (result) {
      console.log(req.session.__v);
      console.log(result);
      result.img.data = fs.readFileSync(req.files.userPhoto.path);
      result.img.contentType = "jpg/png";
      result.save();
      res.status(200).send("success");
    } else {
      (err) => res.send(err);
    }
  });
};

exports.getLogout = (req, res) => {
  req.session.username = "";
  req.session.cookie.expire = true;
  req.session.cookie.maxAge = 0;
  res.redirect("/");
};

exports.getTrack = (req, res) => {
  try {
    var trackID = new ObjectID(req.params.trackID);
  } catch (err) {
    return res.status(400).json({
      message:
        "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
    });
  }
  res.set("content-type", "audio/mp3");
  res.set("accept-ranges", "bytes");

  let bucket = new mongodb.GridFSBucket(db, {
    bucketName: "tracks",
  });

  let downloadStream = bucket.openDownloadStream(trackID);

  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });

  downloadStream.on("error", () => {
    res.sendStatus(404);
  });

  downloadStream.on("end", () => {
    res.end();
  });
};

exports.postTrack = (req, res) => {
  const songStorage = multer.memoryStorage();
  const uploadSong = multer({
    storage: songStorage,
    limits: { fields: 1, fileSize: 9000000, files: 1, parts: 2 },
  });
  uploadSong.single("track")(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Upload Request Validation Failed" });
    } else if (!req.body.name) {
      return res.status(400).json({ message: "No track name in request body" });
    }

    let trackName = req.body.name;

    // Covert buffer to Readable Stream
    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    const uri = config.get("mongoURI");
    const dbName = "test";
    console.log(uri);

    mongodb.MongoClient.connect(uri, (error, user) => {
      assert.ifError(error);
      const db = user.db(dbName);
      let bucket = new mongodb.GridFSBucket(db, {
        bucketName: "tracks",
      });
      let uploadStream = bucket.openUploadStream(trackName);
      let id = uploadStream.id;
      // console.log(id);
      readableTrackStream.pipe(uploadStream);
      uploadStream.on("error", () => {
        return res.status(500).json({ message: "Error uploading file" });
      });

      uploadStream.on("finish", () => {
        return res.status(201).json({
          message:
            "File uploaded successfully, stored under Mongo ObjectID: " + id,
        });
      });
    });

    // // res.send(uri);
    // let bucket = new mongodb.GridFSBucket(db, {
    //   bucketName: "tracks",
    // });

    // let uploadStream = bucket.openUploadStream(trackName);
    // let id = uploadStream.id;
    // console.log(id);
    // readableTrackStream.pipe(uploadStream);
  });
};

exports.postimage = (req, res) => {
  var upload = multer({ storage: storage }).single("photo");
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.send("Error uploading file.");
    }
    console.log("File is uploaded");
    res.send("File successfully uploaded");
  });
};
