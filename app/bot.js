'use strict'
const Bot = require('messenger-bot');
const conversation = require('./conversation');
const sender = require('./sender-api');

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
                var result = executable(sender.id, context, payload);
                bot.sendMessage(sender.id, result.message, function (err, info) {
                    if (!err && info) {
                        console.log('Message sent to fb', info);
                    }else{
                    	console.log(err);
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
	console.log(payload);
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
	var content = sender.plainText("Contame cuánto tiempo tenes y te diré pa' dónde vas!");
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
	var content = sender.plainText("Voy a buscar los mejores destinos para tu visita.");
	var message = sender.headerMessage(user, content);
	console.log(conversation.getContext());
	return message;
}

module.exports = bot;
