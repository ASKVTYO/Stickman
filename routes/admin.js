const express = require("express");
const router = express.Router();
const {
  getSomething,
  postCreateAdmin,
  postCreateStudent,
  getAdminLogin,
  postAdminLogin,
  getDisplayImage,
  getLogout
} = require("../controllers/adminController");

router.get("/", getSomething);
router.post("/create-admin", postCreateAdmin);
// router.post("/create-student", postCreateStudent);
router.get("/admin-login", getAdminLogin);
router.post("/admin-login", postAdminLogin);
router.get("/image", getDisplayImage);
router.get("/logout", getLogout);
module.exports = router;
