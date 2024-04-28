"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Anime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Anime.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Anime.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "url is required" },
          notEmpty: { msg: "url is required" },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "imageUrl is required" },
          notEmpty: { msg: "imageUrl is required" },
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "title is required" },
          notEmpty: { msg: "title is required" },
        },
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: { msg: "score is required" },
          notEmpty: { msg: "score is required" },
          number(value) {
            if (value > 10 || value < 0) {
              throw new Error("score out of range");
            }
          },
        },
      },
      userScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "userScore is required" },
          notEmpty: { msg: "userScore is required" },
          number(value) {
            if (value > 10 || value < 0) {
              throw new Error("rate out of range");
            }
          },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "status is required" },
          notEmpty: { msg: "status is required" },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "UserId is required" },
          notEmpty: { msg: "UserId is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Anime",
      hooks: {
        beforeCreate(instance, options) {
          instance.status = "Plan to watch";
          instance.userScore = 0;
        },
      },
    }
  );
  return Anime;
};
