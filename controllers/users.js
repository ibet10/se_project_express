const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const {
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// POST /user -- UPDATED

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  // check if the user exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const error = new Error("Duplicated");
        error.code = 11000;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const createNewUser = user.toObject();
      // delete the password
      delete createNewUser.password;
      return res.status(CREATED).send(createNewUsers);
    })
    .catch((e) => {
      console.error(e);
      if (e.code === 11000) {
        return res
          .status(CONFLICT)
          .send({ message: "Failed Request: Email already exists." });
      }
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
/*const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // check if the user exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const error = new Error("Duplicated");
        error.code = 11000;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })

    .then((hash) => User.create({ name, avatar, email, password: hash }))

    .then((user) => {
      const createUser = user.toObject();
      // delete the password
      delete createUser.password;
      return res.status(CREATED).send(createUser);
    })
    .catch((e) => {
      console.error(e);
      if (e.code === 11000) {
        return res
          .status(CONFLICT)
          .send({ message: "Failed Request: Email already exists." });
      }
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
*/

// LOGIN

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Failed Request: Invalid data provided." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((e) => {
      console.error(e);
      if (e.message === "Incorrect email or password") {
        res.status(UNAUTHORIZED).send({ message: e.message });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Failed Request: An error has occurred on the server.",
      });
    });
};

// GET /:userId

const getCurrentUser = (req, res) => {
  console.log("GET current user");
  const { _id: userId } = req.user;

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
/*
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
*/

// PATCH /users/me — update profile

const updateCurrentUser = (req, res) => {
  console.log("UPDATE current user");
  const { name, avatar } = req.body;
  const { _id: userId } = req.user;

  if (!name && !avatar) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Failed Request: At least one field must be updated." });
  }

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Failed Request: User not found." });
      }
      return res.send(user);
    })
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

// GET /users -- REMOVE
/*
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
*/

module.exports = { getCurrentUser, updateCurrentUser, login, createUser };
