/* eslint-disable no-shadow */
const card = require('../models/card');
const { NotYourCard, NotCards } = require('../errors/errors');

const getCards = (req, res, next) => {
  card.find({})
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotCards('Получить все карточки не удалось');
      }
      res.send({ card });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      // eslint-disable-next-line eqeqeq
      if (card && (req.user._id == card.owner)) {
        return res.send({ message: 'Карточка удалена' });
      }
      throw new NotYourCard('Не ваша карточка');
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return next();
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return next();
    })
    .catch(next);
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
