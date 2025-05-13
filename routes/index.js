const router = require("express").Router();

const userRouter = require("./users");

const itemRouter = require("./clothingItems");

const { createUser, login } = require("../controllers/users");

const {
  validateUserBody,
  validateLoginBody,
} = require("../middleware/validation");

const { NotFoundError } = require("../utils/errors/NotFoundError");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.post("/signin", validateLoginBody, login);
router.post("/signup", validateUserBody, createUser);

router.use(() => {
  throw new NotFoundError("Path Not Found");
});

module.exports = router;
