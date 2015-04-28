'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  email: String,
  phoneNumber: String,
  firstName: String,
  lastName: String,
  available: Boolean,
  online: Boolean,
  passwordHash: String,
  salt: String
});

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.passwordHash = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

/**
 * Validations
 */

UserSchema
  .path('email')
  .validate(function (value, respond) {
    var self = this;
    value = value.toLowerCase();
    this.constructor.findOne({ email: value }, function (err, user) {
      if (err) { throw err; }
      if (user) {
        if (self.id === user.id) { return respond(true); }
        return respond(false);
      }
      respond(true);
    });
  }, 'email already used');


UserSchema
  .path('phoneNumber')
  .validate(function (value, respond) {
    var self = this;
    value = this.validatePhoneNumber(value);
    if(value.length != 11){
      console.log(value.length);
      respond(false);
    }
    else{
      this.constructor.findOne({ phoneNumber: value }, function (err, user) {
        if (err) { throw err; }
        if (user) {
          if (self.id === user.id) { return respond(true); }
          return respond(false);
        }
        respond(true);
      });
    }
  }, 'phoneNumber already used or incorrect');

UserSchema
  .path('username')
  .validate(function (value, respond) {
    var self = this;
    value = value.toLowerCase();
    this.constructor.findOne({ username: value }, function (err, user) {
      if (err) { throw err; }
      if (user) {
        if (self.id === user.id) { return respond(true); }
        return respond(false);
      }
      respond(true);
    });
  }, 'username already used');

UserSchema.pre('save', function(next) {
  this.phoneNumber = this.validatePhoneNumber(this.phoneNumber);
  this.username = this.username.toLowerCase();
  this.email = this.email.toLowerCase();
  this.firstName = this.firstName.toLowerCase();
  this.lastName = this.lastName.toLowerCase();
  this.available = true;
  this.online = true;
  next();
});
/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate
   *
   * @param {String} password
   * @return {Boolean}
   */
  authenticate: function (password) {
    return this.encryptPassword(password) === this.passwordHash;
  },

  /**
   * Make salt
   *
   * @return {String}
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   */
  encryptPassword: function (password) {
    if (!password || !this.salt) { return ''; }
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },

  /**
   * validate phone number
   *
   * @param {String} phone number
   * @return {String}
   */
  validatePhoneNumber: function (phoneNumber) {
    var validNums = this.numsOnly(phoneNumber.toString());
    var one = "1";
    if( validNums.length === 10 ){
        validNums = one.concat(validNums);
    }else if( validNums.length === 11){
        if(validNums.charAt(0) !== '1'){
            return "";
        }
    }else{
        return "";
    }
    return validNums;
  },

  isValidNumber: function (phoneNumber) {
    var validNums = this.numsOnly(phoneNumber.toString());
    var one = "1";
    if( validNums.length === 10 ){
        return true;
    }else if( validNums.length === 11){
        if(validNums.charAt(0) !== '1'){
            return false;
        }else{
          return true;
        }
    }else{
        return false;
    }
    return false;
  },

  numsOnly: function (input) {
    return input.replace(/\D/g, '');
  }
    


};

module.exports = mongoose.model('User', UserSchema);
