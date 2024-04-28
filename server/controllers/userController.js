const { checkPassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { User } = require("../models");
const { default: axios } = require("axios");

const { OAuth2Client } = require("google-auth-library");
const sendGreetingMail = require("../utils/sendGreetingMail");
const client = new OAuth2Client();

class UserController {
  static async registerUser(req, res, next) {
    try {
      // console.log(req.body)
      let user = await User.create(req.body);

      let { id, email } = user;

      sendGreetingMail(user);
      res.status(201).json({ id, email });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async loginUser(req, res, next) {
    try {
      let { email, password } = req.body;
      if (!email || !password) {
        throw { name: "InvalidInput" };
      }

      let user = await User.findOne({ where: { email } });
      if (!user) {
        throw { name: "InvalidUser" };
      }

      let comparePassword = checkPassword(password, user.password);
      if (!comparePassword) {
        throw { name: "InvalidUser" };
      }

      let access_token = createToken({
        id: user.id,
      });

      res.status(200).json({ access_token, email });
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { google_token } = req.headers;
      // console.log(google_token);
      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      const [user, created] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          email: payload.email,
          password: String(Math.random() * 10000),
        },
      });
      // console.log(user, created);

      if (created) {
        sendGreetingMail(user);
      }

      const access_token = createToken({
        id: user.id,
      });

      res.status(200).json({ access_token, email: user.email });
    } catch (error) {
      next(error);
    }
  }

  static async githubLogin(req, res, next) {
    try {
      req.query.code;

      const params =
        "?client_id=" +
        process.env.GITHUB_CLIENT_ID +
        "&client_secret=" +
        process.env.GITHUB_CLIENT_SECRET +
        "&code=" +
        req.query.code;

      const { data } = await axios({
        url: "https://github.com/login/oauth/access_token" + params,
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
      // console.log(data);

      let payload = await axios({
        method: "get",
        url: "https://api.github.com/user",
        headers: {
          Authorization: "Bearer " + data.access_token,
        },
      });
      // console.log(payload);

      const [user, created] = await User.findOrCreate({
        where: { email: `${payload.data.login}@mail.com` },
        defaults: {
          email: `${payload.data.login}@mail.com`,
          password: String(Math.random() * 10000),
        },
      });
      // console.log(user, created);

      if (created) {
        sendGreetingMail(user);
      }

      const access_token = createToken({
        id: user.id,
      });

      res.status(200).json({ access_token, email: user.email });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = UserController;
