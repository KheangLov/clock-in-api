const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/case.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listCases,
  createCase,
  replaceCase,
  updateCase,
} = require('../../validations/case.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/cases List Cases
   * @apiDescription Get a list of cases
   * @apiVersion 1.0.0
   * @apiName ListCases
   * @apiGroup Case
   * @apiPermission public
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Cases per page
   * @apiParam  {String}             [location]   Case's location
   * @apiParam  {Date}               [date]       Case's email
   *
   * @apiSuccess {Object[]} cases List of cases.
   *
   */
  .get(validate(listCases), controller.list)
  /**
   * @api {post} v1/cases Create Case
   * @apiDescription Create a new case
   * @apiVersion 1.0.0
   * @apiName CreateCase
   * @apiGroup Case
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number}  numberOfCase         Case's numberOfCase
   * @apiParam  {Number}  numberOfDeath        Case's numberOfDeath
   * @apiParam  {Number}  numberOfRecovered    Case's numberOfDeath
   * @apiParam  {Number}  location             Case's location
   * @apiParam  {Date}    date                 Case's date
   *
   * @apiSuccess (Created 201) {String}  numberOfCase         Case's numberOfCase
   * @apiSuccess (Created 201) {String}  numberOfDeath        Case's numberOfDeath
   * @apiSuccess (Created 201) {String}  numberOfRecovered    Case's numberOfRecovered
   * @apiSuccess (Created 201) {String}  location             Case's location
   * @apiSuccess (Created 201) {Date}    date                 Case's date
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createCase), controller.create);

router
  .route('/:id')
  /**
   * @api {get} v1/cases/:id Get Case
   * @apiDescription Get case information
   * @apiVersion 1.0.0
   * @apiName GetCase
   * @apiGroup Case
   * @apiPermission public
   *
   * @apiSuccess {String}  numberOfCase         Case's numberOfCase
   * @apiSuccess {String}  numberOfDeath        Case's numberOfDeath
   * @apiSuccess {String}  numberOfRecovered    Case's numberOfRecovered
   * @apiSuccess {String}  location             Case's location
   * @apiSuccess {Date}    date                 Case's date
   *
   * @apiError (Forbidden 403)    Forbidden    Only case with same id
   * @apiError (Not Found 404)    NotFound     Case does not exist
   */
  .get(controller.get)
  /**
   * @api {put} v1/cases/:id Replace Case
   * @apiDescription Replace the whole case document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceCase
   * @apiGroup Case
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number}  numberOfCase         Case's numberOfCase
   * @apiParam  {Number}  numberOfDeath        Case's numberOfDeath
   * @apiParam  {Number}  numberOfRecovered    Case's numberOfDeath
   * @apiParam  {Number}  location             Case's location
   * @apiParam  {Date}    date                 Case's date
   *
   * @apiSuccess {String}  numberOfCase         Case's numberOfCase
   * @apiSuccess {String}  numberOfDeath        Case's numberOfDeath
   * @apiSuccess {String}  numberOfRecovered    Case's numberOfRecovered
   * @apiSuccess {String}  location             Case's location
   * @apiSuccess {Date}    date                 Case's date
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only case with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Case does not exist
   */
  .put(authorize(LOGGED_USER), validate(replaceCase), controller.replace)
  /**
   * @api {patch} v1/cases/:id Update Case
   * @apiDescription Update some fields of a case document
   * @apiVersion 1.0.0
   * @apiName UpdateCase
   * @apiGroup Case
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number}  numberOfCase         Case's numberOfCase
   * @apiParam  {Number}  numberOfDeath        Case's numberOfDeath
   * @apiParam  {Number}  numberOfRecovered    Case's numberOfDeath
   * @apiParam  {Number}  location             Case's location
   * @apiParam  {Date}    date                 Case's date
   *
   * @apiSuccess {String}  numberOfCase         Case's numberOfCase
   * @apiSuccess {String}  numberOfDeath        Case's numberOfDeath
   * @apiSuccess {String}  numberOfRecovered    Case's numberOfRecovered
   * @apiSuccess {String}  location             Case's location
   * @apiSuccess {Date}    date                 Case's date
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only case with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Case does not exist
   */
  .patch(authorize(LOGGED_USER), validate(updateCase), controller.update)
  /**
   * @api {patch} v1/cases/:id Delete Case
   * @apiDescription Delete a case
   * @apiVersion 1.0.0
   * @apiName DeleteCase
   * @apiGroup Case
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only case with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Case does not exist
   */
  .delete(authorize(LOGGED_USER), controller.remove);


module.exports = router;
