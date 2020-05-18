const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) { // проверяем что заголовок есть
    return res.status(401).send({ message: 'Нет заголовка. Требуется авторизация' });
  }
  const token = cookie.replace('jwt=', ''); // тут извлекаем токен
  let payload;// так сделали из-за области видимости

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secretik');
  } catch (err) {
    return res.status(401).send({ message: 'Проблема с токеном' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next();
};

module.exports = { auth };
