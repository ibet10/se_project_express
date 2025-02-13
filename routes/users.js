const router = require("express").Router();

const auth = require("../middleware/auth");

const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateCurrentUser);

module.exports = router;

/*
const { createUser, getUsers, getUser } = require("../controllers/users");


router.post("/", createUser);
router.get("/", getUsers);
router.get("/:userId", getUser);
*/
