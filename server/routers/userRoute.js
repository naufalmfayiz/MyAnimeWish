const express = require("express");
const UserController = require("../controllers/userController");
const router = express.Router();

router.post("/add-user", UserController.registerUser);

router.post("/login", UserController.loginUser);

router.post("/google-login", UserController.googleLogin);

router.get("/github-login", UserController.githubLogin);

module.exports = router;
