const { Anime, User } = require("../models");

const authorization = async (req, res, next) => {
  try {
    let user = await User.findByPk(req.user.id);
    // console.log(user.id)
    let anime = await Anime.findByPk(req.params.id);
    // console.log(anime.UserId)
    if (!anime) {
      throw { name: "NotFound" };
    }

    if (user.id !== anime.UserId) {
      throw { name: "Forbidden" };
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authorization };
