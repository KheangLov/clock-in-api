const express = require('express');
const validate = require('express-validation');

const controller = require('../../controllers/attendance.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listAttendances,
  createAttendance,
  replaceAttendance,
  updateAttendance,
} = require('../../validations/attendance.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} api/v1/attendances List Attendances
   * @apiDescription Get a list of attendances
   * @apiVersion 1.0.0
   * @apiName ListAttendances
   * @apiGroup Attendance
   * @apiPermission public
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Attendances per page
   * @apiParam  {String}             [location]   Attendance's location
   * @apiParam  {Date}               [date]       Attendance's date
   *
   * @apiSuccess {Object[]} List of attendances.
   *
   */
  .get(validate(listAttendances), controller.list)
  /**
   * @api {post} api/v1/attendances Create Attendance
   * @apiDescription Create a new attendance
   * @apiVersion 1.0.0
   * @apiName CreateAttendance
   * @apiGroup Attendance
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Date}  clockIn         Attendance's clockIn
   * @apiParam  {Date}  clockOut        Attendance's clockOut
   * @apiParam  {String}    reason      Attendance's reason
   *
   * @apiSuccess (Created 201) {Date}  clockIn         Attendance's clockIn
   * @apiSuccess (Created 201) {Date}  clockOut        Attendance's clockOut
   * @apiSuccess (Created 201) {Number}  workingHour    Attendance's workingHour
   * @apiSuccess (Created 201) {Boolean}  isLate             Attendance's isLate
   * @apiSuccess (Created 201) {String}    reason                 Attendance's reason
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createAttendance), controller.create);

router
  .route('/:id')
  /**
   * @api {get} api/v1/attendances/:id Get Attendance
   * @apiDescription Get attendance information
   * @apiVersion 1.0.0
   * @apiName GetAttendance
   * @apiGroup Attendance
   * @apiPermission public
   *
   * @apiSuccess {Date}  clockIn         Attendance's clockIn
   * @apiSuccess {Date}  clockOut        Attendance's clockOut
   * @apiSuccess {Number}  workingHour    Attendance's workingHour
   * @apiSuccess {Boolean}  isLate             Attendance's isLate
   * @apiSuccess {String}    reason                 Attendance's reason
   *
   * @apiError (Forbidden 403)    Forbidden    Only attendance with same id
   * @apiError (Not Found 404)    NotFound     Attendance does not exist
   */
  .get(controller.get)
  /**
   * @api {put} api/v1/attendances/:id Replace Attendance
   * @apiDescription Replace the whole attendance document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceAttendance
   * @apiGroup Attendance
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Date}  clockIn         Attendance's clockIn
   * @apiParam  {Date}  clockOut        Attendance's clockOut
   * @apiParam  {Number}  workingHour   Attendance's workingHour
   * @apiParam  {Boolean}  isLate       Attendance's isLate
   * @apiParam  {String}    reason      Attendance's reason
   *
   * @apiSuccess {Date}  clockIn         Attendance's clockIn
   * @apiSuccess {Date}  clockOut        Attendance's clockOut
   * @apiSuccess {Number}  workingHour    Attendance's workingHour
   * @apiSuccess {Boolean}  isLate             Attendance's isLate
   * @apiSuccess {String}    reason                 Attendance's reason
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden
   *            Only attendance with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Attendance does not exist
   */
  .put(authorize(LOGGED_USER), validate(replaceAttendance), controller.replace)
  /**
   * @api {patch} api/v1/attendances/:id Update Attendance
   * @apiDescription Update some fields of a attendance document
   * @apiVersion 1.0.0
   * @apiName UpdateAttendance
   * @apiGroup Attendance
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Date}  clockIn         Attendance's clockIn
   * @apiParam  {Date}  clockOut        Attendance's clockOut
   * @apiParam  {Number}  workingHour   Attendance's workingHour
   * @apiParam  {Boolean}  isLate       Attendance's isLate
   * @apiParam  {String}    reason      Attendance's reason
   *
   * @apiSuccess {Date}  clockIn         Attendance's clockIn
   * @apiSuccess {Date}  clockOut        Attendance's clockOut
   * @apiSuccess {Number}  workingHour    Attendance's workingHour
   * @apiSuccess {Boolean}  isLate             Attendance's isLate
   * @apiSuccess {String}    reason                 Attendance's reason
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden
   *            Only attendance with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Attendance does not exist
   */
  .patch(authorize(LOGGED_USER), validate(updateAttendance), controller.update)
  /**
   * @api {patch} api/v1/attendances/:id Delete Attendance
   * @apiDescription Delete a attendance
   * @apiVersion 1.0.0
   * @apiName DeleteAttendance
   * @apiGroup Attendance
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden
   *            Only attendance with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Attendance does not exist
   */
  .delete(authorize(LOGGED_USER), controller.remove);

router
  .route('/clock-in')
  /**
   * @api {post} api/v1/attendances/clock-in Create Attendance
   * @apiDescription Create a new attendance
   * @apiVersion 1.0.0
   * @apiName CreateAttendance
   * @apiGroup Attendance
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Date}  clockIn         Attendance's clockIn
   * @apiParam  {Date}  clockOut        Attendance's clockOut
   * @apiParam  {String}    reason      Attendance's reason
   * @apiParam  {Boolean}    isLate      Attendance's late
   *
   * @apiSuccess (Created 201) {Date}  clockIn         Attendance's clockIn
   * @apiSuccess (Created 201) {Date}  clockOut        Attendance's clockOut
   * @apiSuccess (Created 201) {Number}  workingHour    Attendance's workingHour
   * @apiSuccess (Created 201) {Boolean}  isLate             Attendance's isLate
   * @apiSuccess (Created 201) {String}    reason                 Attendance's reason
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(validate(createAttendance), controller.clockIn);

module.exports = router;
