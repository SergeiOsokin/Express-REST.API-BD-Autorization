/* eslint-disable no-console */
const routerCards = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validationCreateCard, validationMoveCard } = require('../middlewares/validationCard');

routerCards.get('/', getCards);

routerCards.post('/', validationCreateCard, createCard);

routerCards.delete('/:cardId', validationMoveCard, deleteCard);

routerCards.put('/:cardId/likes', validationMoveCard, likeCard);

routerCards.delete('/:cardId/likes', validationMoveCard, dislikeCard);

module.exports = routerCards;
