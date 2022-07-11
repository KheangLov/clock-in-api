const httpStatus = require('http-status');
const { omit, pick } = require('lodash');

const User = require('../models/user.model');
const APIError = require('../utils/APIError');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);

    return res.json({
      message: 'User created successfully!',
      success: true,
      data: savedUser.transform(),
    });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

exports.uploadProfile = (req, res, next) => {
  const user = Object.assign(req.locals.user, { picture: `/profiles/${req.file.filename}` });
  user.save()
    .then(savedUser => res.json(savedUser.transform()))
    .catch(e => next(e));
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    return res.json(savedUser.transform());
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
    const updatedUser = omit(req.body, ommitRole);
    const user = Object.assign(req.locals.user, updatedUser);

    const savedUser = await user.save();
    const data = savedUser.transform();

    return res.json({
      message: 'User updated successfully!',
      success: true,
      data,
    });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update user password
 * @public
 */
exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.find(req.params.id).exec();
    const passwordData = pick(req.body, ['password', 'password_confirmation']);

    if (passwordData.password !== passwordData.password_confirmation) {
      throw new APIError({
        message: 'Passwords not matched!',
        status: httpStatus[422],
      });
    }

    await user.updateOne(passwordData, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    return res.json(savedUser.transform());
  } catch (err) {
    return next(err);
  }
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const userCount = await User.count(req.query);
    const transformedUsers = users.map(user => user.transform());
    const { page, perPage } = req.query;
    return res.json({
      data: transformedUsers,
      meta: {
        total: userCount,
        current: page,
        perPage,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const { user } = req.locals;

    if (user._id.toString() === req.user._id.toString()) {
      res.status(httpStatus.FORBIDDEN);

      throw new APIError({ message: 'Can not remove current user!' });
    }

    await user.remove();
    res.status(httpStatus.NO_CONTENT);

    return res.json({
      message: 'User have been removed successfully!',
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
