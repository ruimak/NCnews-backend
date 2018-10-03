const express = require('express');
const usersRouter = express.Router();
const { getUserInfo, getAllUsers } = require('../controllers/users');

usersRouter.route('/:username').get(getUserInfo);
usersRouter.route('/').get(getAllUsers);

module.exports = usersRouter;
