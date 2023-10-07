const { ValidationError, CastError } = require('mongoose').Error;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  ERROR_CODE_UNIQUE, CREATED, JWT_SECRET,
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
              email: user.email,
            });
          } else {
            next(new ErrorAccess('Неверный логин или пароль'));
          }
        });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      next(error);
    });
};

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

// eslint-disable-next-line consistent-return
const updateUserInfo = async (req, res, next) => {
  const { name, email } = req.body;
  const { _id } = req.user;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser._id.toString() !== _id) {
      return next(new NotUnique('Пользователь с таким email уже зарегистрирован'));
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id },
      { name, email },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return next(new NotFound('Указанный пользователь не найден.'));
    }

    res.send(updatedUser);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof CastError) {
      next(new BadRequest('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  login,
  createUser,
  getUserInfo,
  updateUserInfo,
};
