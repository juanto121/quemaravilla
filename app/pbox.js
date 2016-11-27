/**
 * Created by Prestamo on 27/11/16.
 */
var request = require('request');

const led18 = 'http://hello-zetta.herokuapp.com/servers/Things%20-%20IoT%20Demo%20rPi/devices/d7fe4d38-d3ad-4820-adb7-3f3088cdbf88';
const led23 = 'http://hello-zetta.herokuapp.com/servers/Things%20-%20IoT%20Demo%20rPi/devices/a17c9d82-7cd7-47a0-acfd-216e74b0c71f';

exports.startParty = function(){
    makeRequest(led18, 'action=turn-on-pulse');
    makeRequest(led23, 'action=turn-on-pulse');
};

exports.stopParty = function(){
    makeRequest(led18, 'action=turn-off');
    makeRequest(led23, 'action=turn-off');
};

function makeRequest(thingUrl, action){
    request({url:thingUrl,method:'POST',headers:[{name:'content-type',value:'application/json'}],body:action}, function(err, res, body){
        if(!err){
            console.log('req to zetta', res.statusCode);
        }
        else console.log('Err zetta' + err);
    });
}