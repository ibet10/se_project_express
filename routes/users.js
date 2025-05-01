const router = require("express").Router();

const auth = require("../middleware/auth");

const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

const { validateUserBody } = require("../middleware/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserBody, updateCurrentUser);

module.exports = router;
