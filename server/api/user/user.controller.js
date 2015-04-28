'use strict';

var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var User = require('./user.model');

function handleError (res, err) {
  return res.status(500).send(err);
}

/**
 * Creates a new user in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  User.create(req.body, function (err, user) {
    if (err) { return handleError(res, err); }
    var token = jwt.sign(
      { _id: user._id },
      config.secrets.session,
      { expiresInMinutes: 60 * 5 }
    );
    res.status(201).json({ token: token, user: user });
  });
};

/**
 * Return the current logged user.
 *
 * @param req
 * @param res
 */
exports.getMe = function (req, res) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -passwordHash', function (err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { return res.json(401); }
    var userInfo = new User();
    userInfo._id = user._id;
    userInfo.username = user.username;
    userInfo.available = user.available;
    userInfo.online = user.online;
    res.status(200).json(userInfo);
  });
};

/**
 * Set Database entry as logged out
 *
 * @param req
 * @param res
 */
exports.logout = function (req, res) {
  var userId = req.body._id;
  var updateUser = {};
  updateUser.online = false;
  updateUser.available = false;
  User.update(
    { _id: userId }, 
    {$set : updateUser},
    function(err, result) {
      console.log("user is logged out");
      if (err){
        console.log(err);
        throw err;
      }
      res.status(200).json(result);
    }
  );
};