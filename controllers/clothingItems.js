const ClothingItem = require("../models/clothingItems");

const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// POST /item

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.status(CREATED).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: e.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: e.message });
    });
};

// GET /item

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(OK).send(items);
    })
    .catch((e) => {
      console.error(e);

      return res.status(INTERNAL_SERVER_ERROR).send({ message: e.message });
    });
};

// DELETE /item

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(OK).send({ data: item }))
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: e.message });
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: e.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: e.message });
    });
};

// UPDATE / like item

const likeItem = (req, res) => {
  console.log(req.user._id);

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: e.message });
      }
      if (e.name === "CastError") {
        return res.status(400).send({ message: e.message });
      }
      return res.status(500).send({ message: e.message });
    });
};

// UPDATE /dislike item
const dislikeItem = (req, res) => {
  console.log(req.user._id);

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: e.message });
      }
      if (e.name === "CastError") {
        return res.status(400).send({ message: e.message });
      }
      return res.status(500).send({ message: e.message });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
