const { celebrate, Joi } = require('celebrate');

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }).unknown(true),
});

const validationMoveCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string(),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
    cookie: Joi.string().required(),
  }).unknown(true),
});

module.exports = {
  validationCreateCard,
  validationMoveCard,
};
