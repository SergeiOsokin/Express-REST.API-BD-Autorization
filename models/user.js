/* eslint-disable no-shadow */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { NotFoundUser, BrokenPassword } = require('../errors/errors');

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
    },
  },
  email: {
    type: String,
    index: {
      unique: true,
    },
    required: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    select: false, // не работает, хэш возвращается при создании юзера
    type: String,
    minlength: 6,
    required: true,

  },
},
{ versionKey: false });

user.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password') // добавляем, чтобы был хэш, если аторизация норм.
    .then((user) => {
      if (!user) {
        throw new NotFoundUser('Не удалось найти пользователя с таким email');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BrokenPassword('Не правильный логин или пароль');
          }
          return user;
        });
    });
};


module.exports = mongoose.model('user', user);
