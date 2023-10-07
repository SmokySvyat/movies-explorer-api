const jwt = require('jsonwebtoken');
const ErrorAccess = require('../utils/errors/ErrorAccess');

// const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET } = require('../utils/constants');

const handleAuthError = (req, res, next) => next(new ErrorAccess('Необходима авторизация'));

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (!token) {
      return handleAuthError(req, res, next);
    }
    const payload = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return handleAuthError(req, res, next);
  }
  return auth;
};

module.exports = auth;
