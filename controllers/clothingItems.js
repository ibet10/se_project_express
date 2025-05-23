const ClothingItem = require("../models/clothingItems");

const { CREATED } = require("../utils/statusCodes");

const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errors");

// POST /item
const createItem = (req, res, next) => {
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
      if (e.name === "ValidationError") {
        next(new BadRequestError("Item not found."));
        return;
      }
      next(new InternalServerError("An error has occurred on the server."));
    });
};

// GET /item
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((e) => {
      console.error(e);
      next(new InternalServerError("An error has occurred on the server."));
    });
};

// DELETE /item
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        next(new ForbiddenError("Request Not Authorized."));
        return;
      }

      ClothingItem.findByIdAndDelete(itemId).then(() => {
        res
          .status(200)
          .send({ message: "Request Successful: Item has been deleted." });
      });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found."));
        return;
      }
      if (e.name === "CastError") {
        next(new BadRequestError("Invalid data provided."));
        return;
      }
      next(new InternalServerError("An error has occurred on the server."));
    });
};

// UPDATE / like item
const likeItem = (req, res, next) => {
  console.log(req.user._id);
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(CREATED).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found."));
        return;
      }
      if (e.name === "CastError") {
        next(new BadRequestError("Invalid data provided."));
        return;
      }
      next(new InternalServerError("An error has occurred on the server."));
    });
};

// UPDATE /dislike item
const dislikeItem = (req, res, next) => {
  console.log(req.user._id);

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found."));
        return;
      }
      if (e.name === "CastError") {
        next(new BadRequestError("Invalid data provided."));
        return;
      }
      next(new InternalServerError("An error has occurred on the server."));
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };

// LEFT FOR REFERENCE -- WILL DELETE
/*
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
        return res
          .status(BAD_REQUEST)
          .send({ message: "Failed Request: Item not found." });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Failed Request: An error has occurred on the server.",
      });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((e) => {
      console.error(e);

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Failed Request: An error has occurred on the server.",
      });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        return res
          .status(FORBIDDEN)
          .send({ message: "Failed Request: Request Not Authorized." });
      }

      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res
          .status(200)
          .send({ message: "Request Successful: Item has been deleted." })
      );
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Failed Request: Item not found." });
      }
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Failed Request: Invalid data provided." });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Failed Request: An error has occurred on the server.",
      });
    });
};

const likeItem = (req, res) => {
  console.log(req.user._id);

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(CREATED).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Failed Request: Item not found." });
      }
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Failed Request: Invalid data provided." });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Failed Request: An error has occurred on the server.",
      });
    });
};

const dislikeItem = (req, res) => {
  console.log(req.user._id);

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Failed Request: Item not found." });
      }
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Failed Request: Invalid data provided." });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Failed Request: An error has occurred on the server.",
      });
    });
};
*/
