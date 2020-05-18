/* eslint-disable max-classes-per-file */
class NotFoundUser extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
class BrokenPassword extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class NotYourProfile extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class BadToken extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class CardNotExist extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = {
  NotFoundUser, BrokenPassword, NotYourProfile, BadToken, PermissionError, CardNotExist,
};
