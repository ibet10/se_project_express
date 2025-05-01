const router = require("express").Router();

const userRouter = require("./users");

const itemRouter = require("./clothingItems");

const { createUser, login } = require("../controllers/users");

const {
  validateUserBody,
  validateLoginBody,
} = require("../middleware/validation");

const { NOT_FOUND } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.post("/signin", validateLoginBody, login);
router.post("/signup", validateUserBody, createUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
