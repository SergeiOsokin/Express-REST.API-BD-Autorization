const { celebrate, Joi } = require('celebrate');

const urlValidation = Joi.string().required()
  .regex(/(https?:\/\/)(www\.)?((\w+\.\w{2,})|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d{2,5})?.*#?/i);

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: urlValidation,
  }).unknown(true),
});

const validationMoveCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().max(30),
  }).unknown(true),
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
});

module.exports = {
  validationCreateCard,
  validationMoveCard,
};
