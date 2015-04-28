// 'use strict';

// var _ = require('lodash');
// var Phone = require('./phone.model');

// function handleError (res, err) {
//   return res.status(500).send(err);
// }

// /**
//  * Get list of Phone
//  *
//  * @param req
//  * @param res
//  */
// exports.index = function (req, res) {
//   Phone.find(function (err, phones) {
//     if (err) { return handleError(res, err); }
//     return res.status(200).json(phones);
//   });
// };

// /**
//  * Get a single Phone
//  *
//  * @param req
//  * @param res
//  */
// exports.show = function (req, res) {
//   Phone.findById(req.params.id, function (err, phone) {
//     if (err) { return handleError(res, err); }
//     if (!phone) { return res.status(404).end(); }
//     return res.status(200).json(phone);
//   });
// };

// /**
//  * Creates a new Phone in the DB.
//  *
//  * @param req
//  * @param res
//  */
// exports.create = function (req, res) {
//   Phone.create(req.body, function (err, phone) {
//     if (err) { return handleError(res, err); }
//     return res.status(201).json(phone);
//   });
// };

// /**
//  * Updates an existing Phone in the DB.
//  *
//  * @param req
//  * @param res
//  */
// exports.update = function (req, res) {
//   if (req.body._id) { delete req.body._id; }
//   Phone.findById(req.params.id, function (err, phone) {
//     if (err) { return handleError(res, err); }
//     if (!phone) { return res.status(404).end(); }
//     var updated = _.merge(phone, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.status(200).json(phone);
//     });
//   });
// };

// /**
//  * Deletes a Phone from the DB.
//  *
//  * @param req
//  * @param res
//  */
// exports.destroy = function (req, res) {
//   Phone.findById(req.params.id, function (err, phone) {
//     if (err) { return handleError(res, err); }
//     if (!phone) { return res.status(404).end(); }
//     phone.remove(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.status(204).end();
//     });
//   });
// };

var config = require('../../config/environment');
var Conversation = require('../conversation/conversation.model');
var Volunteer = require('../user/user.model');
var plivo = require('plivo-node');
var p = plivo.RestAPI(require('../../config/configPlivo'));

var appNumber = config.appNumber;
var appEndPoint = config.appEndPoint;
var volunteerQueue = [];
var callerCalleeDict = {};
var unavailableText = "Thank you for calling the college hotline. Unfortunatly, all our volunteers are currently occupied. If you'd like, you could send your inquiries to us by text or you could call us at a later time. Have a nice day."

function hash(value) {
    return (typeof value) + ' ' + (value instanceof Object ?
        (value.__hash || (value.__hash = ++arguments.callee.current)) :
        value.toString());
}


exports.receiveMsg = function(req, res){
  var conversation = new Conversation();
  var newMessage = {
            text      : req.query.Text,
            timeStamp   : Date.now(),
            isVolunteer   : false,
            volunteerID   : "none",
           };
  conversation.messages.push(newMessage);
  conversation.phoneNumber = req.query.From;
  conversation.save(function (err, result){
    res.json(result);
  });
}

exports.sendMsg = function(req, res){
  //use plivo api to send the msg
  //update database to reflect said change
  //console.log(req.query);
  var params = {
     'src': appNumber, // Caller Id
     'dst' : req.query.phoneNumber, // User Number to Call
     'text' : req.query.text,
     'type' : "sms",
  };

  p.send_message(params, function (status, response) {
    //console.log(params);
    if (status == 202){
      res.json(response);
    }
  });
}

var forwardHelper = function(req, res){
  //checks the status of voluteer, still available and online
  //if so, update their status to unavailable and route them the call
  //recurse with next volunteer other wise
  if (volunteerQueue.length == 0){
      //var responseForPlivo = plivo.Response();
      //responseForPlivo.addSpeak(unavailableText);
      //res.set({'Content-Type': 'text/xml'});
      //res.end(responseForPlivo.toXML());  
    Volunteer.find({available:true, online:true}, function(err, result){
      volunteerQueue = volunteerQueue.concat(result);
      if (volunteerQueue.length == 0){
        var responseForPlivo = plivo.Response();
        responseForPlivo.addSpeak(unavailableText);
        res.set({'Content-Type': 'text/xml'});
        res.end(responseForPlivo.toXML());      
      }
      else{
        forwardHelper(req, res);
      }
    });   
  }
  else{
    Volunteer.find({phoneNumber: volunteerQueue[0].phoneNumber}, function(err, result){
      console.log(result);
      if(result[0].available && result[0].online){
        //console.log("calledfind");
        var srcNumber = appNumber;  
        var dstNumber = volunteerQueue[0].phoneNumber;
        Volunteer.update({phoneNumber: volunteerQueue[0].phoneNumber}, {
          $set:{currentCall: req.query.From, 
            available: false
          }}, 
          function (err, result){
            console.log(result);
          }
        );
        //Volunteer.update({phoneNumber: volunteerQueue[0].phoneNumber}, {$set:{available:false}})
        callerCalleeDict[hash(req.query.From)] = dstNumber;
        volunteerQueue.shift();

        var responseForPlivo = plivo.Response();
        var dial = responseForPlivo.addDial({callerId: srcNumber});
        dial.addUser(appEndPoint);
        dial.addNumber(dstNumber);

        //console.log("end");
        res.set({'Content-Type': 'text/xml'});
        res.end(responseForPlivo.toXML());  
      }
      else{
        //console.log("volunteer status changed, trying next volunteer")
        volunteerQueue.shift();
        forwardHelper(req, res);
      }
    })
  
  }
}


exports.forwardCall = function(req, res){
  //picks first volunteer from a queue to forward call to
  //if queueu empty, look in database to fill it
  //using this, construct the appropriate XML
  //console.log(req.query.From);
  if (volunteerQueue.length == 0){
    //console.log("pulling new");
    Volunteer.find({available:true, online:true}, function(err, result){
      if (volunteerQueue.length == 0){
        volunteerQueue = volunteerQueue.concat(result);
      }
      
      if (volunteerQueue.length == 0){
        var responseForPlivo = plivo.Response();
        responseForPlivo.addSpeak(unavailableText);
        res.set({'Content-Type': 'text/xml'});
        res.end(responseForPlivo.toXML());      
      }
      else{
        forwardHelper(req, res);
      }
    });
  }
  else{
    //console.log("already exists");
    forwardHelper(req, res);
  }
  

}


exports.hangUp = function(req, res){
  //not doing anything currently, this may be useful, maybe
  console.log(req.query);
  console.log(callerCalleeDict);
  var calleeNumber = callerCalleeDict[hash(req.query.From)]; 
  Volunteer.update({phoneNumber: calleeNumber}, {
    $set:{available: true}}, function (err, result){
      console.log(result);
      res.json(result);
  });
  delete callerCalleeDict[hash(req.query.From)];
}
