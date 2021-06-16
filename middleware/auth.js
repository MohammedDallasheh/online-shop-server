const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/user');

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Verify token
  try {
    // Check if not token
    if (!token) throw { code: 451 };

    jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
      if (error) throw { code: 452 };

      req.user = decoded.user;
      next();
    });
  } catch (err) {
    next(err);
  }
};
const auth2 = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Verify token
  try {
    // Check if not token
    if (!token) return next();

    jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
      if (error) throw { code: 452 };

      req.user = decoded.user;
      next();
    });
  } catch (err) {
    next(err);
  }
};

const role = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id });
    req.user.role = user.role;
    next();
  } catch (err) {
    res.status(500).json({ msg: 'server error - admin auth' });
  }
};

const roleAuth = (role) => async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id });
    if (user.role == 'super-admin') user.role = 'admin';

    if (user.role === role) next();
    else res.status(401).json({ msg: `Not Authrized as - ${role}` });
  } catch (err) {
    res.status(500).json({ msg: 'server error - admin auth' });
  }
};

exports.auth = auth;
exports.auth2 = auth2;
exports.role = role;
exports.adminAuth = roleAuth('admin');
exports.sellerAuth = roleAuth('seller');
exports.subscriberAuth = roleAuth('subscriber');
