// 'use strict';

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var NoteSchema = new Schema({
//   name: String
// });

// module.exports = mongoose.model('Note', NotesSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	phoneNumber 	: Number,
	studentName		: 
					{
					    first: String,
					    last: String
 				 	},
 	schoolName		: String,
 	currentYear 	: String,
 	studentAddress 	: String, 
 	goals 			: [{
 						body : String,
 						checked: Boolean
 					}],
 	question1		: [{
 						body : String,
 						timeStamp : {type : Date, default: Date.now()}
 					}],
 	question2		: [{
 						body : String,
 						timeStamp : {type : Date, default: Date.now()}
 					}]
});

module.exports = mongoose.model('Note', NoteSchema);