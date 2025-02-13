const router = require("express").Router();

const auth = require("../middleware/auth");

const { getCurrentUser } = require("../controllers/users");

/*
const { createUser, getUsers, getUser } = require("../controllers/users");


router.post("/", createUser);
router.get("/", getUsers);
router.get("/:userId", getUser);
*/
router.get("/me", auth, getCurrentUser);
// router.patch("/me", auth, updateCurrentUser);

module.exports = router;
