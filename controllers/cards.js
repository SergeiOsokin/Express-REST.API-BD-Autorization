/* eslint-disable no-shadow */
const card = require('../models/card');

const getCards = (req, res) => {
  card.find({})
    .populate('owner')
    .then((card) => res.send({ card }))
    .catch(() => res.status(500).send({ message: 'Получить все карточки не удалось' }));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      // eslint-disable-next-line eqeqeq
      if (card && (req.user._id == card.owner)) {
        return res.send({ message: 'Карточка удалена' });
      }
      return Promise.reject(new Error('Не ваша карточка'));
    })
    .catch((err) => next(err));
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
    .catch((err) => next(err));
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
    .catch((err) => next(err));
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
