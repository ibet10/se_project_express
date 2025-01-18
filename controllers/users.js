const User = require("../models/user");

const getUsers = (req, res) => {
  console.log("GET users");
};

const getUser = (req, res) => {
  console.log("GET user by Id");
};

const createUser = (req, res) => {
  console.log("Create user");
};

module.exports = { getUsers, getUser, createUser };
