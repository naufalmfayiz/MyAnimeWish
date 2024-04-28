const express = require("express");
const router = express.Router();

//HOME
router.get("/", (req, res) => {
  res.status(200).json("Welcome to MyAnimeWish API");
});

//USER
router.use("/", require("./userRoute"));

//ANIME
router.use("/anime", require("./animeRoute"));

module.exports = router;
