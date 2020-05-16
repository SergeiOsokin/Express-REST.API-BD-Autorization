const { celebrate, Joi } = require('celebrate');

const validationChangeAvatar = celebrate({
  params: Joi.object().keys({
    me: Joi.string().alphanum().max(30),
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .regex(/(https?:\/\/)(www\.)?((\w+\.\w{2,})|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d{2,5})?.*#?/i),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
    cookie: Joi.string().required(),
  }).unknown(true),
});
// [a-zA-Z0-1\W\D]{1,}@[[a-zA-Z0-1\W\D]{1,}\.[a-zA-Z]{2,3}
const validationChangeNameAbout = celebrate({
  params: Joi.object().keys({
    me: Joi.string().alphanum().max(30),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
    cookie: Joi.string().required(),
  }).unknown(true),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .regex(/[a-zA-Z0-1\W\D]{1,}@[[a-zA-Z0-1\W\D]{1,}\.[a-zA-Z]{2,3}/i),
    password: Joi.string().required().min(6).max(30),
  }).unknown(true),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required()
      .regex(/(https?:\/\/)(www\.)?((\w+\.\w{2,})|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d{2,5})?.*#?/i),
    email: Joi.string().required()
      .regex(/[a-zA-Z0-1\W\D]{1,}@[[a-zA-Z0-1\W\D]{1,}\.[a-zA-Z]{2,3}/i),
    password: Joi.string().required().min(6),
  }).unknown(true),
});

module.exports = {
  validationChangeAvatar,
  validationChangeNameAbout,
  validationLogin,
  validationCreateUser,
};
