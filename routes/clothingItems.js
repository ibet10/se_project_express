const router = require("express").Router();

router.get("/", () => console.log("GET items"));
router.delete("/:itemId", () => console.log("DELETE items by ID"));
router.post("/", () => console.log("CREATE items"));

module.exports = router;
