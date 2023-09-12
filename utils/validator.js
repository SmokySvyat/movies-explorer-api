const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
const regex = /^(http|https):\/\/(www\.)?[a-zA-Z0-9\-._~:\/?#[\]@!$&'()*+,;=]{2,256}\.[a-zA-Z0-9.\/?#-]{2,}$/;

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateMovieID = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(regex).required(),
    trailerLink: Joi.string().pattern(regex).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(regex).required(),
    movieId: Joi.number().required(),
  }),
});

const validateUserCreate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

const validateUserAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  validateUser,
  validateMovieID,
  validateMovie,
  validateUserCreate,
  validateUserAuth,
};
