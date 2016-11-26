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
	var cmd = conversation.reply(message.text, function(err, context){
		if(!err && context){
			var executable = filterCommand(context.command);
			if(executable) {
                console.log(JSON.stringify(context.command, recipient.id));

                var result = executable(sender.id);
                console.log(result);
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


function filterCommand(cmd, userid){
	var executable = null;
	switch (cmd){
		case 'greeting':
			executable = greeting;
			break;
		case 'availability':
			executable = availability;
			break;

	}
	return executable;
}

function greeting(user){
	var content = sender.plainText("Contame cuánto tiempo tenes y te diré pa' dónde vas!");
	var message = sender.headerMessage(user,content);
	return message;
}

function availability(user){
    var content = sender.plainText("AVAILABILITY!");
    var message = sender.headerMessage(user,content);
    return message;
}

module.exports = bot;
