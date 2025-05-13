const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const { CREATED } = require("../utils/statusCodes");

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} = require("../utils/errors");

// POST /user -- UPDATED
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return next(new BadRequestError("Invalid data provided."));
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new ConflictError("Email already exists."));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const createdUser = user.toObject();
      delete createdUser.password;
      return res.status(CREATED).send(createdUser);
    })
    .catch((e) => {
      if (e.code === 11000) {
        next(new ConflictError("Email already exists."));
        return;
      }
      if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided."));
        return;
      }
      next(new InternalServerError("An error has occurred on the server."));
    });
};

// LOGIN
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Invalid data provided."));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((e) => {
      if (e.message === "Incorrect email or password") {
        next(new UnauthorizedError(e.message));
        return;
      }
      next(new InternalServerError("An error has occurred on the server."));
    });
};

// GET /:userId
const getCurrentUser = (req, res, next) => {
  console.log("GET current user");
  const { _id: userId } = req.user;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found."));
        return;
      }
      if (e.name === "CastError") {
        next(new BadRequestError("Invalid data provided."));
        return;
      }
      next(new InternalServerError("An error has occurred on the server."));
    });
};

// PATCH /users/me — update profile
const updateCurrentUser = (req, res, next) => {
  console.log("UPDATE current user");
  const { name, avatar } = req.body;
  const { _id: userId } = req.user;

  if (!name && !avatar) {
    return next(new BadRequestError("At least one field must be updated."));
  }

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found."));
        return;
      }
      res.send(user);
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided."));
        return;
      }
      next(new InternalServerError("An error has occurred on the server."));
    });
};

module.exports = { getCurrentUser, updateCurrentUser, login, createUser };
