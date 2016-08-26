// app/controllers/projects.js
// Controller for Project routes

var mongoose = require( 'mongoose' );
var Project = require( '../models/project.js' );

module.exports.createProject = function( req, res ) {
	
	if ( !req.payload._id ){
		res.status( 401 ).json({ message: "Unauthorised access." });
	}
	else{
		if ( !req.body.name ){
			res.status( 400 ).json({ message: "All fields required." });
		}
		else{
			var newName = req.body.name;
			var newDescription = req.body.description;
			var user = req.payload.username;
			
			var project = new Project({
				name: newName,
				description: newDescription,
				created_by: user
			});
			
			project.usersOnProject.push( user );
			
			project.save( function( err ) {
				if( err ){
					if( err.code === 11000 || err.code === 11001 ){
						res.status( 400 ).json({ message: "Project already exists." });
					}
					else{
						res.status( 500 ).json({ message: "Server error." });
					}
				}
				else{
					res.status( 204 ).end();
				}
			});
		}
	}
	
};

module.exports.findAllProjects = function( req, res ) {
	
	if ( !req.payload._id ){
		res.status( 401 ).json({ message: "Unauthorised access." });
	}
	else{
		var query = { usersOnProject:req.payload.username }
	
		Project.find( query, 'name description usersOnProject', function( err,projects ) {
			if( err ){
				res.status( 500 ).json( { message: "Server error." } );
			}
			else{
				if( projects ) {
					res.status( 200 ).json( projects );	
				}
				else{
					res.status( 400 ).json({ message: "No matches found." });
				}
			}
		});
	}
};

module.exports.findProject = function( req, res ) {
	
	if ( !req.payload._id ){
		res.status( 401 ).json({ message: "Unauthorised access." });
	}
	else{
		var query = { name:req.params.project };
		
		Project.findOne( query, function( err,project ) {
			if( err ){
				res.status( 500 ).json( { message: "Server error." } );
			}
			else{
				if( project ) {
					res.status( 200 ).json( project );	
				}
				else{
					res.status( 400 ).json({ message: "No matches found." });
				}
			}
		});
	}
};

module.exports.updateProject = function( req, res ) {
	var projectParams = req.params.project;
	
	res.status( 200 ).json({ message:'Test updateProject route for ' + projectParams });
};

module.exports.deleteProject = function( req, res ) {
	
	if ( !req.payload._id ){
		res.status( 401 ).json( { message: "Unauthorised access." } );
	}
	else{
		var query = { name:req.params.project };
		var user = req.payload.username;
		Project.findOne( query, function( err,project ) {
			if( err ){
				res.status( 500 ).json( { message: "Server error." } );
			}
			else{
				if( project.usersOnProject.length > 1 ){
					Project.findOneAndUpdate( query, { $pull:{ usersOnProject:user } }, function( err ){
						if( err ){
							res.status( 500 ).json( { message: "Server error." } );
						}
						else{
							res.status( 204 ).end();
						}
					});
				}
				else{
					Project.findOneAndRemove( query, function( err ){
						if( err ){
							res.status( 500 ).json( { message: "Server error." } );
						}
						else{
							res.status( 204 ).end();
						}
					});
				}
			}
		});
	}
};