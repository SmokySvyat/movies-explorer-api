const { ValidationError } = require('mongoose').Error;
const { STATUS_OK, CREATED } = require('../utils/constants');
const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const Forbidden = require('../utils/errors/Forbiden');
const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res
        .status(STATUS_OK)
        .send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const { _id } = req.user;

  Movie.create({ owner: _id, ...req.body })
    .then((movie) => {
      res
        .status(CREATED)
        .send(movie);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const { _id } = req.user;
  Movie.findById(movieId)
    .orFail(new NotFound('Карточка с указанным id не найдена'))
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (movie.owner.toString() !== _id) {
        return Promise.reject(new Forbidden('У пользователя нет возможности удалять карточки других пользователей'));
      }
      return Movie.deleteOne(movie)
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
