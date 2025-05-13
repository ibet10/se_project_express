const router = require("express").Router();

const auth = require("../middleware/auth");

const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

const { validateUserUpdate } = require("../middleware/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserUpdate, updateCurrentUser);

module.exports = router;
