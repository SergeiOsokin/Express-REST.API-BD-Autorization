/* eslint-disable no-shadow */
const card = require('../models/card');
const { PermissionError, CardNotExist } = require('../errors/errors');

const getCards = (req, res, next) => {
  card.find({})
    .populate('owner')
    .orFail(new CardNotExist('Получить все карточки не удалось'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  card.findByIdAndDelete(req.params.cardId)
    .orFail(new CardNotExist('Карточка не нашлась'))
    .then((card) => {
      // eslint-disable-next-line eqeqeq
      if (req.user._id == card.owner) {
        return res.send({ message: 'Карточка удалена', data: card });
      }
      throw new PermissionError('Не ваша карточка');
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new CardNotExist('Карточка не нашлась'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(new CardNotExist('Карточка не нашлась'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
