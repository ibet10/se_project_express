const User = require("../models/user");

// POST /user

const createUser = (req, res) => {
  console.log("Create user");
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        return res.status(400).send({ message: e.message });
      }
      return res.status(500).send({ message: e.message });
    });
};

// GET /users

const getUsers = (req, res) => {
  console.log("GET users");
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => {
      console.error(e);
      return res.status(500).send({ message: e.message });
    });
};

// GET /:userId

const getUser = (req, res) => {
  console.log("GET user by Id");
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: e.message });
      }
      if (e.name === "CastError") {
        return res.status(400).send({ message: e.message });
      }
      return res.status(500).send({ message: e.message });
    });
};

module.exports = { getUsers, getUser, createUser };
