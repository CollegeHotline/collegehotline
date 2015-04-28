'use strict';

var _ = require('lodash');
var Profile = require('./profile.model');

function handleError (res, err) {
  return res.status(500).send(err);
}

/**
 * Get list of Profile
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  Profile.find(function (err, profiles) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(profiles);
  });
};

/**
 * Get a single Profile
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
  Profile.findById(req.params.id, function (err, profile) {
    if (err) { return handleError(res, err); }
    if (!profile) { return res.status(404).end(); }
    return res.status(200).json(profile);
  });
};

/**
 * Creates a new Profile in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  Profile.create(req.body, function (err, profile) {
    if (err) { return handleError(res, err); }
    return res.status(201).json(profile);
  });
};

/**
 * Updates an existing Profile in the DB.
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  Profile.findById(req.params.id, function (err, profile) {
    if (err) { return handleError(res, err); }
    if (!profile) { return res.status(404).end(); }
    var updated = _.merge(profile, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(profile);
    });
  });
};

/**
 * Deletes a Profile from the DB.
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
  Profile.findById(req.params.id, function (err, profile) {
    if (err) { return handleError(res, err); }
    if (!profile) { return res.status(404).end(); }
    profile.remove(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(204).end();
    });
  });
};
