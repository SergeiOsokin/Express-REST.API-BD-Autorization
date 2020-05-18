const { celebrate, Joi } = require('celebrate');

const urlValidation = Joi.string().required()
  .regex(/(https?:\/\/)(www\.)?((\w+\.\w{2,})|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d{2,5})?.*#?/i);
const emailValidation = Joi.string().required()
  .regex(/[a-zA-Z0-1\W\D]{1,}@[[a-zA-Z0-1\W\D]{1,}\.[a-zA-Z]{2,3}/i);

const validationChangeAvatar = celebrate({
  params: Joi.object().keys({
    me: Joi.string().alphanum().max(30),
  }).unknown(true),
  body: Joi.object().keys({
    avatar: urlValidation,
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

const validationChangeNameAbout = celebrate({
  params: Joi.object().keys({
    me: Joi.string().alphanum().max(30),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: emailValidation,
    password: Joi.string().required().min(6).max(30),
  }).unknown(true),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: urlValidation,
    email: emailValidation,
    password: Joi.string().required().min(6).max(30),
  }).unknown(true),
});

module.exports = {
  validationChangeAvatar,
  validationChangeNameAbout,
  validationLogin,
  validationCreateUser,
};
