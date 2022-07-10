const Joi = require('joi');

module.exports = {
  // POST /api/v1/register
  register: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(6)
        .max(128),
    },
  },

  // POST /api/v1/login
  login: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(6)
        .max(128),
    },
  },

  // POST /api/v1/facebook
  // POST /api/v1/google
  oAuth: {
    body: {
      access_token: Joi.string().required(),
    },
  },

  // POST /api/v1/refresh
  refresh: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      refreshToken: Joi.string().required(),
    },
  },

  // POST /api/v1/refresh
  sendPasswordReset: {
    body: {
      email: Joi.string()
        .email()
        .required(),
    },
  },

  // POST /api/v1/password-reset
  passwordReset: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(6)
        .max(128),
      resetToken: Joi.string().required(),
    },
  },
};
