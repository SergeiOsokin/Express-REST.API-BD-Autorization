/* eslint-disable no-console */
const routerUsers = require('express').Router();

const { validationChangeAvatar, validationChangeNameAbout } = require('../middlewares/validationUser');

const {
  getUsers, getUser, changeUser, changeUserAvatar,
} = require('../controllers/users');

routerUsers.get('/', getUsers);

routerUsers.get('/:userId', getUser);

routerUsers.patch('/:me', validationChangeNameAbout, changeUser);

routerUsers.patch('/:me/avatar', validationChangeAvatar, changeUserAvatar);

module.exports = routerUsers;
