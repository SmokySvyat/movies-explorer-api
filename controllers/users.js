const { ValidationError, CastError } = require('mongoose').Error;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  ERROR_CODE_UNIQUE, STATUS_OK, CREATED, JWT_SECRET,
} = require('../utils/constants');
const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const NotUnique = require('../utils/errors/NotUnique');
const ErrorAccess = require('../utils/errors/ErrorAccess');
const User = require('../models/user');

const login = (req, res, next) => {
  const { email, password } = req.body;
  // console.log(JWT_SECRET);

  User.findOne({ email })
    .select('+password')
    .orFail(new ErrorAccess('Пользователь не найден'))
    .then((user) => {
      // console.log(user);
      bcrypt.compare(password, user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const newToken = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
            res.send({
              id: user._id,
              token: newToken,
              name: user.name,
              about: user.about,
              avatar: user.avatar,
            });
          } else {
            next(new ErrorAccess('Неверный логин или пароль'));
          }
        });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => User.findById(req.user._id)
  .orFail(new NotFound('Пользователь не найден'))
  .then((user) => {
    res.status(200).send(user);
  })
  .catch((error) => {
    next(error);
  });

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  // console.log(req.body);

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => {
      res.status(CREATED).send({
        name,
        email,
      });
    })
    .catch((err) => {
      if (err.code === ERROR_CODE_UNIQUE) {
        next(new NotUnique('Пользователь с такой почтой уже зарегистрирован'));
      } else if (err instanceof ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate({ _id }, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь по указанному id не найден'));
      }
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError || err instanceof CastError) {
        next(new BadRequest('Данные введены некоректно'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login,
  createUser,
  getUserInfo,
  updateUserInfo,
};
