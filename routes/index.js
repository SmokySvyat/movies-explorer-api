const router = require('express').Router();
const NotFound = require('../utils/errors/NotFound');
const { validateUserAuth, validateUserCreate } = require('../utils/validator');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', validateUserCreate, createUser);
router.post('/signin', validateUserAuth, login);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

module.exports = router;
