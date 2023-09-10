const jwt = require('jsonwebtoken');
const ErrorAccess = require('../utils/errors/ErrorAccess');

const { NODE_ENV, JWT_SECRET } = process.env;
const { DEV_SECRET } = require('../utils/constants');

const handleAuthError = (req, res, next) => next(new ErrorAccess('Необходима авторизация'));
// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (!token) {
      return handleAuthError(req, res, next);
    }
    const payload = jwt.verify(token.replace('Bearer ', ''), NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return handleAuthError(req, res, next);
  }
};

module.exports = auth;
