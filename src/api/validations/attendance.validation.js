const Joi = require('joi');

module.exports = {

  // GET /api/v1/attendances
  listAttendances: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().max(100),
      clockIn: Joi.date(),
      clockOut: Joi.date(),
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
    },
  },

  // POST /api/v1/attendances
  createAttendance: {
    body: {
      clockIn: Joi.date().required(),
      clockOut: Joi.date(),
      isLate: Joi.boolean(),
      reason: Joi.string(),
    },
  },

  // PUT /api/v1/attendances/:id
  replaceAttendance: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /api/v1/attendances/:id
  updateAttendance: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

};
