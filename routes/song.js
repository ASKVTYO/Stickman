const express = require("express");
const router = express.Router();
const {
  postMusic,
  getMusic,
  updateMusic,
} = require("../controllers/songController");

router.get("/:trackID", getMusic);
router.post("/", postMusic);
router.patch("/:trackID", updateMusic);

module.exports = router;
