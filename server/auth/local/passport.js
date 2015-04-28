'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User) {
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function (username, password, done) {
      User.findOne({
        username: username
      }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { msg: 'username not found' }); }
        if (!user.authenticate(password)) {
          return done(null, false, { msg: 'incorrect password' });
        }
        return done(null, user);
      });
    }
  ));
};
