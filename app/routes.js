var bot = require('./bot');
var map = require('./maps-api');

module.exports = function(app) {

	app.get('/', function(req, res){
		res.render('index.ejs');
	});

	app.get('/fb/webhook', (req, res) => {
		return bot._verify(req, res);
	});

	app.post('/fb/webhook', (req, res) => {
		bot._handleMessage(req.body);
		res.status(200).send();
	});

	app.post('/map/getDirections', (req, res) => {
		return map.calculateAndDisplayRoute(req.body, res);
	});
};