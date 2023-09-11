const router = require('express').Router();
const { updateUserInfo, getUserInfo } = require('../controllers/users');
const { validateUser } = require('../utils/validator');

router.get('/me', getUserInfo);
router.patch('/me', validateUser, updateUserInfo);

module.exports = router;
