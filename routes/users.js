const router = require('express').Router();
const { getCurrentUser, updateProfileInfo } = require('../controllers/users');
const { validateUser } = require('../utils/validator');

router.get('/me', getCurrentUser);
router.patch('/users/me', validateUser, updateProfileInfo);

module.exports = router;
