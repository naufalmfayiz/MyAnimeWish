const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

const authentication = async (req, res, next) => {
  try {
    // console.log(req.headers.authorization);
    let access_token = req.headers.authorization;
    if (!access_token) {
      throw { name: "InvalidToken" };
    }

    let split_token = access_token.split(" ");
    let [bearer, token] = split_token;
    if (bearer !== "Bearer") {
      throw { name: "InvalidToken" };
    }

    let payload = verifyToken(token);
    let user = await User.findByPk(payload.id);
    // console.log(user)
    if (!user) {
      throw { name: "InvalidToken" };
    }

    req.user = {
      id: user.id,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
