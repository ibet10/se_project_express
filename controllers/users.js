const User = require("../models/user");

const {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// POST /user

const createUser = (req, res) => {
  console.log("Create user");
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Failed Request: Invalid data provided." });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Failed Request: An error has occurred on the server.",
      });
    });
};

// GET /users

const getUsers = (req, res) => {
  console.log("GET users");
  User.find({})
    .then((users) => res.send(users))
    .catch((e) => {
      console.error(e);
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Failed Request: An error has occurred on the server.",
      });
    });
};

// GET /:userId

const getUser = (req, res) => {
  console.log("GET user by Id");
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Failed Request: User not found." });
      }
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Failed Request: Invalid data provided." });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Failed Request: An error has occurred on the server.",
      });
    });
};

module.exports = { getUsers, getUser, createUser };
