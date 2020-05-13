/* eslint-disable no-shadow */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res) => {
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
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
};
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then(((user) => {
      if (user) {
        return res.send({ user });
      }
      return next();
    }))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (password.length > 6) {
    return bcrypt.hash(password, 10).then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => User.findById({ _id: user._id }))
        .then((user) => res.send({ data: user }))
        .catch((err) => next(err));
    });
  }
  return res.status(400).send({ message: 'Проблема с паролем. А body точно есть?' });
};

const changeUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findById(req.params.me)
    .then((user) => {
      // прежде чем изменить, проверим, что можно это делать
      // eslint-disable-next-line eqeqeq
      if (!(user && (req.user._id == user._id))) {
        return Promise.reject(new Error('Не ваш профиль'));
      }
      return User.findByIdAndUpdate(req.params.me,
        { name, about },
        {
          new: true,
          runValidators: true,
        });
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

const changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findById(req.params.me)
    .then((user) => {
      // прежде чем изменить, проверим, что можно это делать
      // eslint-disable-next-line eqeqeq
      if (!(user && (req.user._id == user._id))) {
        return Promise.reject(new Error('Не ваш профиль'));
      }
      return User.findByIdAndUpdate(req.params.me,
        { avatar },
        {
          new: true,
          runValidators: true,
        });
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports = {
  getUsers, getUser, createUser, changeUser, changeUserAvatar, login,
};
