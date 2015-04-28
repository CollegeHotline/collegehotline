'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhoneSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Phone', PhoneSchema);
