// app/models/column.js
// Task schema for Fury Web Service

var mongoose = require( 'mongoose' );

var columnSchema = new mongoose.Schema({
	name: { type: String, required:true },
	projectParent: { type:String, required:true },
	created_at: { type:Date, default:Date.now },
	updated_at: { type:Date, default:Date.now },
	userDeletable: { type:Boolean, default:true },
	position: { type:Number, required:true }
});


module.exports = mongoose.model( 'Column', columnSchema );