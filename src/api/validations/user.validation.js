const Joi = require('joi');

const User = require('../models/user.model');

module.exports = {

  // GET /api/v1/users
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(User.roles),
    },
  },

  // POST /api/v1/users
  createUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
  },

  // PUT /api/v1/users/:userId
  replaceUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /api/v1/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /api/v1/users/:userId
  changePassword: {
    body: {
      password: Joi.string().min(6).max(128),
      password_confirmation: Joi.string().min(6).max(128),
    },
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
