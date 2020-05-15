const { celebrate, Joi } = require('celebrate');

const validationChangeAvatar = celebrate({
  params: Joi.object().keys({
    me: Joi.string().alphanum(),
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
    cookie: Joi.string().required(),
  }).unknown(true),
});

const validationChangeNameAbout = celebrate({
  params: Joi.object().keys({
    me: Joi.string().alphanum(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required(),
    about: Joi.string().required(),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
    cookie: Joi.string().required(),
  }).unknown(true),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(2),
  }).unknown(true),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required().min(2),
  }).unknown(true),
});

module.exports = {
  validationChangeAvatar,
  validationChangeNameAbout,
  validationLogin,
  validationCreateUser,
};
