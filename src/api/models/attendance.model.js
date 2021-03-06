const mongoose = require('mongoose');
const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omitBy, isNil, pick } = require('lodash');

const APIError = require('../utils/APIError');

/**
 * Attendance Schema
 * @private
 */
const attendanceSchema = new mongoose.Schema({
  clockIn: {
    type: Date,
    required: true,
  },
  clockOut: {
    type: Date,
  },
  workingHour: {
    type: Number,
  },
  isLate: {
    type: Boolean,
  },
  reason: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * Statics
 */
attendanceSchema.statics = {
  /**
   * Get attendance
   *
   * @param {ObjectId} id - The objectId of attendance.
   * @returns {Promise<Attendance, APIError>}
   */
  async get(id) {
    try {
      let data;

      if (mongoose.Types.ObjectId.isValid(id)) {
        data = await this.findById(id).exec();
      }

      if (data) {
        return data;
      }

      throw new APIError({
        message: 'Attendance does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  async getBy(param) {
    try {
      const _param = pick(param, ['clockIn', 'userId']);
      _param.clockIn = {
        $gte: moment().utc().format('YYYY-MM-DD'),
        $lte: moment().add(1, 'day').utc().format('YYYY-MM-DD'),
      };
      const data = await this.findOne(_param).exec();

      return data;
    } catch (error) {
      throw error;
    }
  },

  countData({ clockIn, clockOut, userId }) {
    const options = omitBy({ clockIn, clockOut, userId }, isNil);

    return this.countDocuments(options).exec();
  },

  /**
   * List attendances in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of cases to be skipped.
   * @param {number} limit - Limit number of cases to be returned.
   * @returns {Promise<Case[]>}
   */
  list({
    page = 1,
    perPage = 30,
    sort = 'updatedAt',
    order = 'desc',
    clockIn,
    clockOut,
    userId,
  }) {
    const options = omitBy({ clockIn, clockOut, userId }, isNil);

    return this.find(options)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

};

attendanceSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'clockIn', 'clockOut', 'workingHour', 'isLate', 'reason', 'userId', 'updatedBy', 'createdAt', 'updatedAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * @typedef Attendance
 */
module.exports = mongoose.model('Attendance', attendanceSchema);
