const httpStatus = require('http-status');
const { omit } = require('lodash');

const Attendance = require('../models/attendance.model');

/**
 * Get attendance
 * @public
 */
exports.get = async (req, res) => {
  const { id } = req.params;
  const data = await Attendance.get(id);
  return res.json(data);
};

/**
 * Create new attendance
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const data = new Attendance(req.body);
    const savedAttendance = await data.save();
    res.status(httpStatus.CREATED);
    return res.json(savedAttendance);
  } catch (error) {
    return next(error);
  }
};

/**
 * Replace existing attendance
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Attendance.get(id);
    const newAttendance = new Attendance(req.body);
    const newAttendanceObject = omit(newAttendance.toObject(), '_id', '');

    await data.updateOne(newAttendanceObject, { override: true, upsert: true });
    const savedAttendance = await Attendance.findById(data._id);

    return res.json(savedAttendance.transform());
  } catch (error) {
    return next(error);
  }
};

/**
 * Update existing attendance
 * @public
 */
exports.update = async (req, res, next) => {
  const data = await Attendance.get(req.params.id);
  const updateData = Object.assign(data, req.body);

  updateData.save()
    .then(savedAttendance => res.json(savedAttendance))
    .catch(e => next(e));
};

/**
 * Get attendance list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const data = await Attendance.list(req.query);
    const totalEntries = await Attendance.count();
    const totalPages = Math.ceil(totalEntries / req.query.perPage || 10);
    return res.json({ data, totalEntries, totalPages });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete attendance
 * @public
 */
exports.remove = async (req, res, next) => {
  const data = await Attendance.get(req.params.id);

  data.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
