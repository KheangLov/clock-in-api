const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Case Schema
 * @private
 */
const caseSchema = new mongoose.Schema({
  numberOfCase: {
    type: Number,
    required: true,
  },
  numberOfDeath: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * Statics
 */
caseSchema.statics = {
  /**
   * Get case
   *
   * @param {ObjectId} id - The objectId of case.
   * @returns {Promise<Case, APIError>}
   */
  async get(id) {
    try {
      let caseData;

      if (mongoose.Types.ObjectId.isValid(id)) {
        caseData = await this.findById(id).exec();
      }
      if (caseData) {
        return caseData;
      }

      throw new APIError({
        message: 'Case does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List cases in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of cases to be skipped.
   * @param {number} limit - Limit number of cases to be returned.
   * @returns {Promise<Case[]>}
   */
  list({
    page = 1, perPage = 30, location,
  }) {
    const options = omitBy({ location }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

};

/**
 * @typedef Case
 */
module.exports = mongoose.model('Case', caseSchema);
