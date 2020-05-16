/* eslint-disable no-shadow */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { NotYourProfile, NotFoundUser } = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secretik',
        { expiresIn: '7d' });
      res
        .cookie('jwt', token, { httpOnly: true, sameSite: true })
        .end();
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(new NotFoundUser('Нет пользователей'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundUser('Нет такого юзера'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => User.findById({ _id: user._id }))
        .then((user) => res.send({ data: user }))
        .catch(next);
    })
    .catch(next);
};

const changeUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findById(req.params.me)
    .orFail(new NotFoundUser('Пользователь не найден'))
    .then((user) => {
      // eslint-disable-next-line eqeqeq
      if (!(req.user._id == user._id)) {
        throw new NotYourProfile('Не ваш профиль');
      }
      return User.findByIdAndUpdate(req.params.me,
        { name, about },
        {
          new: true,
          runValidators: true,
        });
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findById(req.params.me)
    .orFail(new NotFoundUser('Пользователь не найден'))
    .then((user) => {
      // eslint-disable-next-line eqeqeq
      if (!(req.user._id == user._id)) {
        throw new NotYourProfile('Не ваш профиль');
      }
      return User.findByIdAndUpdate(req.params.me,
        { avatar },
        {
          new: true,
          runValidators: true,
        });
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports = {
  getUsers, getUser, createUser, changeUser, changeUserAvatar, login,
};
