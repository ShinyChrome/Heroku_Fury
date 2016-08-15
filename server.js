// server.js

// Initialize
//=============================================================================================

// Package calls
var express = require( "express" );
var bodyParser = require( "body-parser" );
var app = express();

//app.use( express.static(_dirname + "/public" ) ); <---- Unsure if necessary
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

// Set up the port for listening
var port = process.env.PORT || 8080;

// Get an instance of the Express Router
var router = express.Router();


// Generic error handler used by all endpoints.
function handleError( res, reason, message, code ) {
  console.log( "ERROR: " + reason );
  res.status( code || 500 ).json( { "error": message } );
}

// API routes
//=============================================================================================

// End-point for all routes
router.use( function( request, response, next ) {
	console.log('Loading........');
	next();
});

// TEST API ROUTE
router.get( '/', function(request, response ) {
	// Test connection message
	response.json( { 'message' :'Howdy pardner, Test sucessful! Good job pal!' } );
});

// USER API ROUTES
//=============================================================================================

// *****Main Route for /users*****
router.route('/users')

// get all users
.get( function( request, response ) {
	// Test function
	response.json( { 'message':'get all users' } );
})

// create a user
.post( function( request, response ) {
	// Test function
	response.json( { 'message':'create user' } );
});

// *****Main Route for /users:user_id******
router.route('/users:user_id')

// get a user for user_id
.get( function( request, response ) {
	// Test function
	response.json( { 'message':'get user for user_id' } );
})

// update a user for user_id
.put( function( request, response ) {
	// Test function
	response.json( { 'message':'update a user for user_id' } );
})

// delete a user for user_id
.delete( function( request, response ) {
	// Test function
	response.json( { 'message':'delete user for user_id' } );
});


//=============================================================================================

app.use( '/api', router );

// Sets the port to listen on
app.listen( port );
console.log( 'App now running on port' + port );