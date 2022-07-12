const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omit, pick, map } = require('lodash');

const Attendance = require('../models/attendance.model');
const APIError = require('../utils/APIError');

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

exports.clockIn = async (req, res, next) => {
  try {
    const body = pick(req.body, ['clockIn', 'isLate', 'reason']);
    const { _id } = req.user;

    body.userId = _id;
    body.updatedBy = _id;

    const find = await Attendance.getBy(body);
    if (find) {
      throw new APIError({ message: 'Can not clocked-in, you are already clocked-in for today!' });
    }

    const attendance = new Attendance(body);
    const att = await attendance.save();
    const data = att.transform();

    res.status(httpStatus.CREATED);

    return res.json({
      message: 'You have been successfully clocked-in!',
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

exports.clockOut = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = pick(req.body, ['clockOut']);
    const { _id } = req.user;

    body.updatedBy = _id;

    const find = await Attendance.get(id);
    const _duration = moment._duration(body.clockOut.diff(find.clockIn));
    body.workingHour = _duration.asHours();
    const updateData = Object.assign(find, body);
    const att = await updateData.save();
    const data = att.transform();

    res.status(httpStatus.CREATED);

    return res.json({
      message: 'You have been successfully clocked-out!',
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

exports.checkAttendance = async (req, res, next) => {
  try {
    const body = pick(req.body, ['clockIn']);
    const { _id } = req.user;

    body.userId = _id;

    const att = await Attendance.getBy(body);
    const data = att.transform();

    return res.json({
      message: 'Data!',
      success: true,
      data,
    });
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
    const _param = pick(req.query, ['clockIn', 'clockOut']);
    const { _id } = req.user;
    _param.userId = _id;
    const attandances = await Attendance.list(_param);
    const data = map(attandances, attandance => attandance.transform());
    const total = await Attendance.countData(_param);
    const { page, perPage: size } = req.query;
    const current = page || 1;
    const perPage = size || 10;

    return res.json({
      data,
      meta: {
        total,
        current,
        perPage,
      },
    });
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
