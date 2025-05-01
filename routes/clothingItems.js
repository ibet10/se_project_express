const router = require("express").Router();

const auth = require("../middleware/auth");

const {
  validateCardBody,
  validateClothingItemId,
} = require("../middleware/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.post("/", auth, validateCardBody, createItem);
router.get("/", getItems);
router.delete("/:itemId", auth, validateClothingItemId, deleteItem);

router.put("/:itemId/likes", auth, validateClothingItemId, likeItem);
router.delete("/:itemId/likes", auth, validateClothingItemId, dislikeItem);

module.exports = router;
