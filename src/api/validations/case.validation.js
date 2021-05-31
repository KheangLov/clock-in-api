const Joi = require('joi');

module.exports = {

  // GET /v1/users
  listCases: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().max(100),
      location: Joi.string(),
    },
  },

  // POST /v1/users
  createCase: {
    body: {
      numberOfCase: Joi.number().required(),
      numberOfDeath: Joi.number().required(),
      numberOfRecovered: Joi.number().required(),
      location: Joi.string().required(),
      date: Joi.date().required(),
    },
  },

  // PUT /v1/users/:userId
  replaceCase: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/users/:userId
  updateCase: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
