const express = require("express");
const AnimeController = require("../controllers/animeController");
const authentication = require("../middlewares/authenticate");
const { authorization } = require("../middlewares/authorize");
const router = express.Router();

router.post("/", authentication, AnimeController.addAnime);

router.get("/", authentication, AnimeController.showUserAnime);

router.get(
  "/:id",
  authentication,
  authorization,
  AnimeController.showAnimeById
);

router.put(
  "/:id",
  authentication,
  authorization,
  AnimeController.updateAnimeById
);

router.delete(
  "/:id",
  authentication,
  authorization,
  AnimeController.deleteAnimeById
);

module.exports = router;
