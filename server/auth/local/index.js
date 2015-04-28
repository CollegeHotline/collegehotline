'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var User = require('../../api/user/user.model');

var router = express.Router();

router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) { return res.status(401).json(error); }
    if (!user) { return res.status(401).json({ msg: 'login failed' }); }

    //Set User as Online and Available
    var userId = user._id;
    var updateUser = {};
	updateUser.online = true;
	updateUser.available = true;
	User.update(
		{ _id: userId }, 
		{$set : updateUser},
		function(err, result) {
		  console.log("user is logged in");
		  if (err){
		    console.log(err);
		    throw err;
		  }
		}
	);

	//set token and send to user
    var token = auth.signToken(user._id);
    res.json({ token: token, user: user });
  })(req, res, next);
});

module.exports = router;
