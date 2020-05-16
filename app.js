const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet'); // автоматическая простановка нужны заголовков для безопасности
const rateLimit = require('express-rate-limit'); // для ограничения кол-ва запросов
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { validationLogin, validationCreateUser } = require('./middlewares/validationUser');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(limiter);
app.use(bodyParser.json());
app.use(helmet());
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);
app.use('/users', auth, routerUsers);
app.use('/cards', auth, routerCards);
app.use(errorLogger);
app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.statusCode || err.name === 'ValidationError') {
    return res.status(err.statusCode || 400).send(`Ошибка: ${err.message}`);
  }
  return res.status(500).send(`Ошибка на сервере: ${err.message}`);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Begin listening');
});
