const router = require('express').Router();
const NotFound = require('../utils/errors/NotFound');
const { validateUserAuth, validateUserCreate } = require('../utils/validator');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRout = require('./users');
const moviesRout = require('./movies');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signup', validateUserCreate, createUser);
router.post('/signin', validateUserAuth, login);

router.use(auth);

router.use('/users', usersRout);
router.use('/movies', moviesRout);

router.use('*', (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

module.exports = router;
