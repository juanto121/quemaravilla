'use strict'
const Bot = require('messenger-bot');
const conversation = require('./conversation');
const sender = require('./sender-api');
const request = require('request');
const tradeoff = require('./tradeoff');

let bot = new Bot({
	token: 'EAAPH7WFMNukBALug5SsH84GnZCdZAhjBc5sl5GIjJZAPMRBDscZCrVwxna9Yc2teL9iOrH1ierh5WWNoeZBLSLdOvlI2h1JWRwIgLlkXNEjxPVY97qYHZBz7B052obZCsPqyFraclv2fqTBwm58uubjhUViuuxazVyrJRhYdlV4zwZDZD',
	verify: 'verification_token'
});

bot.on('message', (payload, reply) =>{
	let message = payload.message;
	var recipient = payload.recipient;
	var sender = payload.sender;

	var cmd = conversation.reply(message.text, function(err, context, payload){
		if(!err && context){
			var executable = filterCommand(context);
            if(executable) {
                bot.getProfile(sender.id, function(err, profile){
                	if(!err)
                		context.userProfile = profile;

                    var result = executable(sender.id, context, payload);
                    if(result){
                        bot.sendMessage(sender.id, result.message, function (err, info) {
                            if (!err && info) {
                                console.log('Message sent to fb', info);
                            }else{
                                console.log(err);
                            }
                        });
                    }
				});
            }
		}
	});
});

bot.on('error', (err) => {
	console.log(err.message);
});

bot.on('postback', (payload, reply, actions) => {
	console.log('POSTBACK', payload);
});


function filterCommand(context){
	var executable = null;
	switch (context.command){
		case 'greeting':
			executable = greeting;
			break;
		case 'duration':
			executable = duration;
			break;
		case 'location':
			executable = location;
			break;
		case 'restart':
			executable = restart;
			break;
		case 'party':
			executable = party;
			break;
		case 'time':
			executable = time;
			break;

	}
	return executable;
}

function greeting(user, context){
	var userName = context.userProfile;
	var content = sender.plainText("Hola "+ userName.first_name + "!, contame cuánto tiempo 📅 tenés y te diré que podes hacer!");
	var message = sender.headerMessage(user,content);
	return message;
}

function party(user, context){
	var content = sender.plainText("Fiesta? donde?");
	var message = sender.headerMessage(user, content);
	return message;
}

function time(user, context){
	var content = sender.plainText("ok");
	var message = sender.headerMessage(user,content);
	return message;
}

function duration(user, context, payload){
	var content = sender.plainText("Y donde te estas hospedando?");
	var message = sender.headerMessage(user,content);
	return message;
}

function location(user, context, payload){
	var content = sender.plainText("Voy a buscar los mejores sitios para ir en estos " + context.duration + " dias.");
	var message = sender.headerMessage(user, content);
	console.log('CONTEXT:' + JSON.stringify(conversation.getContext()));

	//Personality Insights call
	const url = 'http://personality-insights-nodejs-promo-1810.mybluemix.net/api/profile/twitter';
	var data = {"source_type":"twitter","accept_language":"en","include_raw":false,"language":"ja","userId":"faridyu"};
	bot.sendSenderAction(Number(user), "typing_on", function(err, info){console.log(err,info)});

    request({
        url: url,
        method:'POST',
        json: data
    }, function(err, res, body){
        if(err){
            console.log('error','Error while using personality insights', err);
        }else{
            bot.sendSenderAction(Number(user), "typing_off", function(err, info){console.log(err,info)});
        	var big5 = body.raw_v3_response.personality;
        	var personality = [];
        	for(var i = 0; i < big5.length; i++){
				personality.push(big5[i].percentile);
			}
        	var location = context["location"];
        	tradeoff.pareto(location, personality, function(err, results){
        		var elements = [];
        		for(var i = 0; i < results.length;i++){
                    var button = sender.button({title:'Ver más información',payload:results[i]});
                    var element = sender.element({title:results[i],buttons:[button]});
					elements.push(element);
                }
                var generic = sender.genericTemplate({elements:elements});
                bot.sendMessage(user, generic, function (err, info) {
                    if (!err && info) {
                        console.log('Message sent to fb', info);
                    }else{
                        console.log(err);
                    }
                });
			});
        }
    });

	return message;
}

module.exports = bot;
