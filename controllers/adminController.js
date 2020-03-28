const session = require("express-session");
const crypto = require("crypto");
const fs = require("fs");
// const multer = require("multer");
var { admin } = require("../models/product");

function hash(input, salt) {
  //creating hash
  var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, "sha512");
  return ["pbkdf2", "10000", salt, hashed.toString("hex")].join("$");
}

exports.getSomething = (req, res) => {
  res.send("Welcome !!");
};

exports.postCreateAdmin = (req, res) => {
  let newAdmin = new admin(req.body);
  console.log(newAdmin);
  let password = newAdmin.password;
  console.log(password);
  let salt = crypto.randomBytes(128).toString("hex");
  let hashedPassword = hash(password, salt);
  newAdmin.password = hashedPassword;
  console.log(newAdmin.password);
  newAdmin
    .save()
    .then(newAdmin => res.redirect("/"))
    .catch(err => {
      console.log(err);
      res.status(400).send("Adding new admin failed");
    });
};

// exports.postCreateStudent = (req, res) => {
//   console.log(req.session.admin);
//   if (req.session.admin) {
//     let newStudent = new student(req.body);
//     console.log(req.body.username);
//     res.status(200).send("success");
//   } else {
//     res.send("failure");
//   }
// };

exports.getAdminLogin = (req, res) => {
  res.send("Hi Admin");
};

exports.postAdminLogin = (req, res) => {
  var admin_details = req.body;
  var user = admin.findOne(
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
          res.status(400).send("Incorrect Password");
        }
      } else {
        err => console.log(err);
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
      err => res.send(err);
    }
  });
};

exports.getLogout = (req, res) => {
  req.session.username = "";
  req.session.cookie.expire = true;
  req.session.cookie.maxAge = 0;
  res.redirect("/");
};
