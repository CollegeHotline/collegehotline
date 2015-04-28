// 'use strict';

// var _ = require('lodash');
// var Conversation = require('./conversation.model');

// function handleError (res, err) {
//   return res.status(500).send(err);
// }

// /**
//  * Get list of Conversation
//  *
//  * @param req
//  * @param res
//  */
// exports.index = function (req, res) {
//   Conversation.find(function (err, conversations) {
//     if (err) { return handleError(res, err); }
//     return res.status(200).json(conversations);
//   });
// };

// /**
//  * Get a single Conversation
//  *
//  * @param req
//  * @param res
//  */
// exports.show = function (req, res) {
//   Conversation.findById(req.params.id, function (err, conversation) {
//     if (err) { return handleError(res, err); }
//     if (!conversation) { return res.status(404).end(); }
//     return res.status(200).json(conversation);
//   });
// };

// /**
//  * Creates a new Conversation in the DB.
//  *
//  * @param req
//  * @param res
//  */
// exports.create = function (req, res) {
//   Conversation.create(req.body, function (err, conversation) {
//     if (err) { return handleError(res, err); }
//     return res.status(201).json(conversation);
//   });
// };

// *
//  * Updates an existing Conversation in the DB.
//  *
//  * @param req
//  * @param res
 
// exports.update = function (req, res) {
//   if (req.body._id) { delete req.body._id; }
//   Conversation.findById(req.params.id, function (err, conversation) {
//     if (err) { return handleError(res, err); }
//     if (!conversation) { return res.status(404).end(); }
//     var updated = _.merge(conversation, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.status(200).json(conversation);
//     });
//   });
// };

// /**
//  * Deletes a Conversation from the DB.
//  *
//  * @param req
//  * @param res
//  */
// exports.destroy = function (req, res) {
//   Conversation.findById(req.params.id, function (err, conversation) {
//     if (err) { return handleError(res, err); }
//     if (!conversation) { return res.status(404).end(); }
//     conversation.remove(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.status(204).end();
//     });
//   });
// };

var Conversation  = require('./conversation.model')


exports.createConversation = function(req, res){
  if (req.body.From){
    req.body.phoneNumber = req.body.From;
  }
  if (req.body.Text){
    req.body.text = req.body.Text;    
  }

  d = new Date();
  year = d.getFullYear();
  month = d.getMonth();
  day = d.getDate();
  hour = d.getHours();
  minute = d.getMinutes();
  
  if(hour < 12)
    label = "AM"
  else
    label = "PM"

  if(hour > 12)
    hour = hour % 12;

  if(day < 10)
    day = "0"+day;

  if(minute < 10)
    minute = "0"+minute;

  if(hour == 0)
    hour = 12;

  stamp = month+"/"+day+"/"+year+" at "+hour+":"+minute+label;
  Conversation.find({phoneNumber: req.body.phoneNumber}, function (err, result){
    if(result.length == 0){

      var conversation = new Conversation();
      var newMessage = {
                text      : req.body.text,
                timeStamp   : Date(),
                timeStampString : stamp,
                isVolunteer   : false,
                volunteerID   : "none",
               };
      conversation.messages.push(newMessage);
      conversation.phoneNumber = req.body.phoneNumber;
      conversation.save(function (err, result){
        res.json(result);
      });
    }

    else{
      if(!req.body.isVolunteer){
        Conversation.update({phoneNumber: req.body.phoneNumber}, 
                  {$push: {"messages": 
                        {
                          text      : req.body.text,
                          timeStamp   : Date(),
                          timeStampString : stamp,
                          isVolunteer   : false,
                          volunteerID   : "none",
                        }
                      },
                  $inc: {messageCount : 1, unreadMessageCount : 1, unansweredMessageCount : 1}
                  }, 
                  function (err, result){
                    res.json(result);
                  });
      }
      else{
        Conversation.update({phoneNumber: req.body.phoneNumber}, 
                  {$push: {"messages": 
                        {
                          text      : req.body.text,
                          timeStamp   : Date(),
                          timeStampString : stamp,
                          isVolunteer   : true,
                          volunteerID   : req.user[0].id,
                          volunteerName : req.user[0].username
                        }
                      },
                  $inc: {messageCount : 1},
                  $set: {unansweredMessageCount: 0, unreadMessageCount: 0}
                  }, 
                  function (err, result){
                    res.json(result);
                  });
      }
    }
  });
}

exports.activateConversation = function(req, res){
  //console.log(req.user);
  Conversation.update(req.params, {$set: {active : true, currentVolunteerID: req.user[0].id}}, function (err, result){
  });
  Conversation.find(req.params, function (err, conversation){
    res.json(conversation);
  });
}

exports.deactivateConversation = function(req, res){
  Conversation.update(req.params, {$set: {active : false, currentVolunteerID: "none"}}, function (err, conversation){
  });
  Conversation.find(req.params, function (err, conversation){
    res.json(conversation);
  });
}

exports.listInactiveConversations = function(req, res){
  Conversation.find({$and: [{active: false}, {unansweredMessageCount : {$gt: 0}}]}, function (err, results){
    res.json(results);
  });
}

exports.listActiveConversations = function(req, res){
  Conversation.find({currentVolunteerID: req.user[0].id}, function (err, results){
    res.json(results);
  });
}


exports.openConversation = function (req, res){
  Conversation.update(req.params, {$set: {unreadMessageCount : 0}}, function (err, conversation){
  });
  Conversation.find(req.params, function (err, conversation){
    res.json(conversation);
  });
}
