const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Helper function for URL validation
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// Helper function for ID validation

const validateID = (value, helpers) => {
  if (value.length === 24 && validator.isHexadecimal(value)) {
    return value;
  }
  return helpers.error("any.invalid");
};

// Clothing Item validation
module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "Avatar URL" field must be filled in',
      "string.uri": 'the "Avatar URL" field must be a valid url',
    }),
  }),
});

// User Registration validation
module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": "The email address is not valid",
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "Avatar URL" field must be filled in',
      "string.uri": 'the "Avatar URL" field must be a valid url',
    }),
  }),
});

//Login Authentication validation
module.exports.validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": "The email address is not valid",
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// User ID validation -- DELETE?
module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom(validateID).messages({
      "string.empty": 'The "User ID" field must be filled in',
      "any.invalid": 'The "User ID" is not valid',
    }),
  }),
});

// Clothing Item ID validation
module.exports.validateClothingItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().custom(validateID).messages({
      "string.empty": 'The "Card Item ID" field must be filled in',
      "any.invalid": 'The "Card Item ID" is not valid',
    }),
  }),
});
