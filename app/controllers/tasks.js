// app/controllers/tasks.js
// Controller for Task routes

var mongoose = require( 'mongoose' );
var Task = require( '../models/task.js' );
var Column = require( '../models/column.js' );

module.exports.createTask = function( req, res ){
	if ( !req.payload._id ){
		res.status( 401 ).json({ message: "Unauthorised access." });
	}
	else{
		if ( !req.body.name || !req.params.project ){
			res.status( 400 ).json({ message: "All fields required." });
		}
		else{
			
			Column.findOne( { projectParent:req.params.project, name:'new' }, function( err, column ){
				if( err ){
					res.status( 500 ).json({ message: "Server error." });
					console.error( new Error( err.message ) );
				}
				else{
					if( column ){
						var task = new Task({
							name: req.body.name,
							description: req.body.description,
							userAssigned: req.body.user,
							projectParent: req.params.project,
							columnIn: column._id
						});
			
			
						task.save( function( err ){
							if( err ){
								res.status( 500 ).json({ message: "Server error." });
								console.error( new Error( err.message ) );
							}
							else{
								res.status( 201 ).json({ message: "Task creation successful." });
							}
						});
					}
					else{
						res.status( 500 ).json({ message: "Server error." });
						console.error( new Error( "New Column not found" ) );
					}
				}
			});
		}
	}
};

module.exports.findAllProjectTasks = function( req, res ){
	if ( !req.payload._id ){
		res.status( 401 ).json({ message: "Unauthorised access." });
	}
	else{
		var query = { projectParent:req.params.project };
		
		Task.find( query, 'name description userAssigned projectParent priority columnIn', function( err, tasks ) {
			if( err ){
				res.status( 500 ).json({ message: "Server error." });
				console.error( new Error( err.message ) );
			}
			else{
				if( tasks ) {
					res.status( 200 ).json( tasks );	
				}
				else{
					res.status( 400 ).json({ message: "No matches found." });
				}	
			}
		});
	}
};

module.exports.findAllUserTasks = function( req, res ){
	if ( !req.payload._id ){
		res.status( 401 ).json({ message: "Unauthorised access." });
	}
	else{
		var query = { userAssigned:req.payload.username };
		
		Task.find( query, 'name description userAssigned projectParent priority columnIn', function( err, tasks ) {
			if( err ){
				res.status( 500 ).json({ message: "Server error." });
				console.error( new Error( err.message ) );
			}
			else{
				if( tasks ) {
					res.status( 200 ).json( tasks );	
				}
				else{
					res.status( 400 ).json({ message: "No matches found." });
				}	
			}
		});
	}
};

module.exports.findAllColumnTasks = function( req, res ){
	if ( !req.payload._id ){
		res.status( 401 ).json({ message: "Unauthorised access." });
	}
	else{
		var query = { columnIn:req.params.column };
		
		Task.find( query, 'name description userAssigned projectParent priority columnIn', function( err, tasks ) {
			if( err ){
				res.status( 500 ).json({ message: "Server error." });
				console.error( new Error( err.message ) );
			}
			else{
				if( tasks ) {
					res.status( 200 ).json( tasks );	
				}
				else{
					res.status( 400 ).json({ message: "No matches found." });
				}	
			}
		});
	}
};

module.exports.findTask = function( req, res ){
	if ( !req.payload._id ){
		res.status( 401 ).json({ message: "Unauthorised access." });
	}
	else{
		Task.findById( req.params.task, 'name description userAssigned projectParent priority columnIn', function( err, task ) {
			if( err ){
				res.status( 500 ).json({ message: "Server error." });
				console.error( new Error( err.message ) );
			}
			else{
				if( task ) {
					res.status( 200 ).json( [ task ] );	
				}
				else{
					res.status( 400 ).json({ message: "No matches found." });
				}	
			}
		});
	}
};

module.exports.updateTask = function( req, res ){
	
	if ( !req.payload._id ){
		res.status( 401 ).json({ message: "Unauthorised access." });
	}
	else{	
		Task.findById( req.params.task, function( err, task ) {
			if( err ){
				res.status( 500 ).json({ message: "Server error." });
				console.error( new Error( err.message ) );
			}
			else{
				if( task ) {
					if( req.body.name )
						task.name = req.body.name;
				
					if( req.body.description )
						task.description = req.body.description;
					
					if( req.body.user )
						task.userAssigned = req.body.user;
					
					if( req.body.priority )
						task.priority = req.body.priority;
					
					if( req.body.columnIn )
						task.columnIn = req.body.columnIn;
					
					task.updated_at = Date.now();
					
					task.save( function( err ) {
						if( err ){
							res.status( 500 ).json({ message: "Server error." });
							console.error( new Error( err.message ) );
						}
						else{
							res.status( 200 ).json({ message: "Update successful." });
						}	
					});
				}
				else{
					res.status( 400 ).json({ message: "No matches found." });
				}	
			}
		});
	}
};

module.exports.deleteTask = function( req, res ){
	if ( !req.payload._id ){
		res.status( 401 ).json({ message: "Unauthorised access." });
	}
	else{
		Task.findByIdAndRemove( req.params.task, function( err, task ) {
			if( err ){
				res.status( 500 ).json({ message: "Server error." });
				console.error( new Error( err.message ) );
			}
			else{
				if( task ) {
					res.status( 200 ).json({ message: "Delete successful." });
				}
				else{
					res.status( 400 ).json({ message: "No matches found." });
				}
			}
		});
	}
};
