const httpStatus = require('http-status');
const { omit } = require('lodash');
const Case = require('../models/case.model');

/**
 * Get case
 * @public
 */
exports.get = async (req, res) => {
  const { id } = req.params;
  const caseData = await Case.get(id);
  res.json(caseData);
};

/**
 * Create new case
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const caseData = new Case(req.body);
    const savedCase = await caseData.save();
    res.status(httpStatus.CREATED);
    res.json(savedCase.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing case
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { id } = req.params;
    const caseData = await Case.get(id);
    const newCase = new Case(req.body);
    const newCaseObject = omit(newCase.toObject(), '_id', '');

    await caseData.updateOne(newCaseObject, { override: true, upsert: true });
    const savedCase = await Case.findById(caseData._id);

    res.json(savedCase.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing case
 * @public
 */
exports.update = async (req, res, next) => {
  const caseData = await Case.get(req.params.id);
  const updatedCase = omit(req.body, '');
  const caseUpdate = Object.assign(caseData, updatedCase);

  caseUpdate.save()
    .then(savedCase => res.json(savedCase))
    .catch(e => next(e));
};

/**
 * Get case list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const caseData = await Case.list(req.query);
    res.json(caseData);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete case
 * @public
 */
exports.remove = async (req, res, next) => {
  const caseData = await Case.get(req.params.id);

  caseData.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
