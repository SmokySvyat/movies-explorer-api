const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateMovie, validateMovieID } = require('../utils/validator');

router.get('/', getMovies);
router.post('/', validateMovie, createMovie);
router.delete('/:movieId', validateMovieID, deleteMovie);

module.exports = router;
