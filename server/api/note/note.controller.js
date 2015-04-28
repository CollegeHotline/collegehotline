// 'use strict';

// var _ = require('lodash');
// var Notes = require('./notes.model');

// function handleError (res, err) {
//   return res.status(500).send(err);
// }

// /**
//  * Get list of Notes
//  *
//  * @param req
//  * @param res
//  */
// exports.index = function (req, res) {
//   Notes.find(function (err, notess) {
//     if (err) { return handleError(res, err); }
//     return res.status(200).json(notess);
//   });
// };

// /**
//  * Get a single Notes
//  *
//  * @param req
//  * @param res
//  */
// exports.show = function (req, res) {
//   Notes.findById(req.params.id, function (err, notes) {
//     if (err) { return handleError(res, err); }
//     if (!notes) { return res.status(404).end(); }
//     return res.status(200).json(notes);
//   });
// };

// /**
//  * Creates a new Notes in the DB.
//  *
//  * @param req
//  * @param res
//  */
// exports.create = function (req, res) {
//   Notes.create(req.body, function (err, notes) {
//     if (err) { return handleError(res, err); }
//     return res.status(201).json(notes);
//   });
// };

// /**
//  * Updates an existing Notes in the DB.
//  *
//  * @param req
//  * @param res
//  */
// exports.update = function (req, res) {
//   if (req.body._id) { delete req.body._id; }
//   Notes.findById(req.params.id, function (err, notes) {
//     if (err) { return handleError(res, err); }
//     if (!notes) { return res.status(404).end(); }
//     var updated = _.merge(notes, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.status(200).json(notes);
//     });
//   });
// };

// /**
//  * Deletes a Notes from the DB.
//  *
//  * @param req
//  * @param res
//  */
// exports.destroy = function (req, res) {
//   Notes.findById(req.params.id, function (err, notes) {
//     if (err) { return handleError(res, err); }
//     if (!notes) { return res.status(404).end(); }
//     notes.remove(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.status(204).end();
//     });
//   });
// };



var NotesBasic = require('./note.model');
var Volunteer = require('../user/user.model');

exports.list = function(req, res){
  NotesBasic.find(req.query, function (err, results){
    res.json(results);
  });
}

exports.create = function(req, res){
  var newNote = new NotesBasic();
    
  newNote.phoneNumber = req.body.phoneNumber;
  newNote.studentName = req.body.studentName;
  newNote.schoolName = req.body.schoolName;
  newNote.currentYear = req.body.currentYear;
  newNote.studentAddress = req.body.studentAddress;
  
  newNote.save(function (err, result){
    res.json(result);
  });
}

exports.update = function(req, res){
  NotesBasic.update(
      {phoneNumber : req.body.phoneNumber},
      {$set: 
          {studentName : req.body.studentName, 
          schoolName : req.body.schoolName, 
          currentYear : req.body.currentYear,
          studentAddress : req.body.studentAddress
          } 
      },
      function (err, results)
      {
        res.json(results);
      }
  );
}

exports.updateShortGoals = function(req, res){
  NotesBasic.update(
      {phoneNumber : req.body.phoneNumber}, 
      {$push: 
          {
            goals : {body : req.body.goals, checked: req.body.checked}
          } 
      },
      function (err, results)
      {
        res.json(results);
      }
  );
}

exports.saveQuestion1 = function(req, res){
  NotesBasic.update(
      {phoneNumber : req.body.phoneNumber}, 
      {$push: 
          {
            question1 : {body : req.body.question1}
          } 
      },
      function (err, results)
      {
        res.json(results);
      }
  );
}

exports.saveQuestion2 = function(req, res){
  NotesBasic.update(
      {phoneNumber : req.body.phoneNumber}, 
      {$push: 
          {
            question2 : {body : req.body.question2}
          } 
      },
      function (err, results)
      {
        res.json(results);
      }
  );
}

exports.load = function(req, res){
  Volunteer.find({phoneNumber: req.user[0].phoneNumber}, function(err, results){
    res.json(results);
  });
}