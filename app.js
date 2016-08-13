var express		= require('express'),
	app			= express(),
	port		= process.env.PORT || 3000,
	server		= require('http').createServer(app),
	flash		= require('connect-flash'),
	
	morgan		= require('morgan'),
	bodyParser	= require('body-parser'),
		
	route		= require('./app/routes.js');

// Set-up	============================================

// Logs all HTTP requests
app.use(morgan('dev'));

// Parses request bodies before handling them.
// enables: req.body
// https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Server side rendering template engine
app.set('view engine', 'ejs');

// Flash messages
app.use(flash());

// Setting static files available
app.set('views', __dirname + '/public/views');
app.use(express.static( __dirname +'/public'));

// Routes	============================================

// Route files under app/routes.js
route(app);

// Run		============================================

app.listen(port,function(){
	console.log("Listening port: " + port);
});