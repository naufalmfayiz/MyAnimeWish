const { User, Anime } = require("../models");

class AnimeController {
  static async addAnime(req, res, next) {
    try {
      // console.log(req.body);
      let { url, imageUrl, title, score, userScore, status, UserId } = req.body;

      let titleFinder = await Anime.findOne({
        where: { title, UserId: req.user.id },
      });
      if (titleFinder) {
        throw { name: "ItemExist" };
      }

      let anime = await Anime.create({
        url,
        imageUrl,
        title,
        score,
        userScore: 0,
        status: "Plan to watch",
        UserId: req.user.id,
      });
      res.status(201).json({ anime });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async showUserAnime(req, res, next) {
    try {
      const anime = await Anime.findAll({
        where: {
          UserId: req.user.id,
        },
        order: [["id", "ASC"]],
      });
      res.status(200).json(anime);
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async showAnimeById(req, res, next) {
    try {
      let { id } = req.params;
      const anime = await Anime.findByPk(id, {
        include: {
          model: User,
          attributes: { exclude: ["password"] },
        },
      });

      if (!anime) throw { name: "NotFound" };

      res.status(200).json(anime);
    } catch (error) {
      next(error);
    }
  }

  static async updateAnimeById(req, res, next) {
    try {
      let { userScore, status } = req.body;
      let update = await Anime.update(
        { userScore, status },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      if (!update) throw { name: "NotFound" };

      const anime = await Anime.findByPk(req.params.id);
      if (!anime) throw { name: "NotFound" };

      res.status(200).json({ anime });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async deleteAnimeById(req, res, next) {
    try {
      const anime = await Anime.findByPk(req.params.id);
      if (!anime) throw { name: "NotFound" };

      await anime.destroy({ where: { id: req.params.id } });

      res.status(200).json({ message: `${anime.title} success to delete` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AnimeController;
