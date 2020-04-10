const express = require("express");
const router = express.Router();
// const multer = require("multer");
// //multer
// var storage = multer.diskStorage({
//   destination: function(req, file, callback) {
//     console.log("dest", req, file);
//     callback(null, "/uploads");
//   },
//   filename: function(req, file, callback) {
//     console.log("file", req, this.filename);
//     callback(null, file.fieldname + "-" + Date.now());
//   }
// });
// var imageupload = multer({ storage: storage });
const {
  getSomething,
  postCreateAdmin,
  postCreateStudent,
  getAdminLogin,
  postAdminLogin,
  getDisplayImage,
  getLogout,
  getTrack,
  postTrack,
  postimage
} = require("../controllers/adminController");

router.get("/", getSomething);
router.post("/create-admin", postCreateAdmin);
// router.post("/create-admin", (req, res) => {
//   console.log("ji");
//   res.send('ji')
// });
// router.post("/create-student", postCreateStudent);
router.get("/admin-login", getAdminLogin);
router.post("/admin-login", postAdminLogin);
router.get("/image", getDisplayImage);
router.get("/logout", getLogout);
router.get("/track/:trackID", getTrack);
router.post("/track", postTrack);
router.post("/image", postimage);
// router.post("/image", imageupload.single("photo"), (req, res, err) => {
// if (err) {
//   console.log(err);
//   return res.send("Error uploading file.");
// }
//   console.log(req.file);
//   console.log("File is uploaded");
//   res.send("File successfully uploaded");
// });
// var upload = multer({ storage: storage }).single("photo");
// upload(req, res, err => {
//   if (err) {
//     console.log(err);
//     res.send("Error uploading file.");
//   }
//   console.log("File is uploaded");
//   res.send("File successfully uploaded");
// });
// var express = require("express");
// var multer = require("multer");
// var storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, "/tmp/my-uploads");
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now());
//   }
// });

// var upload = multer({ storage: storage });

// var app = express();

// app.post("/uploadImage", upload.single("image"), function(req, res, next) {
//   console.log("success");
//   console.log(req.file);
//   res.status(204).end();
// });

module.exports = router;
