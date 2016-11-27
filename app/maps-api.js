/**
 * 

var googleMapsClient = require('@google/maps').createClient({
	key : 'AIzaSyBfXWyGvlk7JQDZBZTpQWoA0QQzaXWhY0Q'
}); */

var gmaputil = require('googlemapsutil');

// call api from class object
var cb = function(err, result) {
  if (err) {
    console.log(err);
  }
  console.log(result);
};

exports.calculateAndDisplayRoute = function(query, callback) {
	return gmaputil.directions(query.origin, query.destination, {mode: 'driving', key: 'AIzaSyBfXWyGvlk7JQDZBZTpQWoA0QQzaXWhY0Q'}, cb, null, true);
}