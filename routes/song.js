const express = require("express");
const router = express.Router();
const {
  postMusic,
  getMusic,
  patchMusic,
} = require("../controllers/songController");

router.get("/:trackID", getMusic);
router.post("/", postMusic);
router.patch("/:trackID", patchMusic);

module.exports = router;
