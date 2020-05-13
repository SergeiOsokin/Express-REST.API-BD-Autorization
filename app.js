const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet'); // автоматическая простановка нужны заголовков для безопасности
const rateLimit = require('express-rate-limit'); // для ограничения кол-ва запросов
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

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

app.post('/signin', login);
app.post('/signup', createUser);
// app.use(auth);
app.use('/users', auth, routerUsers);
app.use('/cards', auth, routerCards);
app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.status !== 500) {
    const mes = (err.name === 'ValidationError') ? `Ошибка валидаци: ${err.message}` : `Ошибка: ${err.message}`;
    return res.status(404).send({ message: mes });
  }
  return res.status(500).send({ message: 'Произошла ошибка на сервере' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Begin listening');
});
