'use strict'
const Bot = require('messenger-bot');
const conversation = require('./conversation');
const sender = require('./sender-api');
const request = require('request');
const tradeoff = require('./tradeoff');
const pbox = require('./pbox');

let bot = new Bot({
	token: 'EAAPH7WFMNukBALug5SsH84GnZCdZAhjBc5sl5GIjJZAPMRBDscZCrVwxna9Yc2teL9iOrH1ierh5WWNoeZBLSLdOvlI2h1JWRwIgLlkXNEjxPVY97qYHZBz7B052obZCsPqyFraclv2fqTBwm58uubjhUViuuxazVyrJRhYdlV4zwZDZD',
	verify: 'verification_token'
});

bot.on('message', (payload, reply) =>{
	let message = payload.message;
	var recipient = payload.recipient;
	var sender = payload.sender;

	var cmd = conversation.reply(message.text, function(err, context, payload){
		console.log(JSON.stringify(payload,null,2));
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
		case 'thanks':
			executable = bye;
			break;
	}
	return executable;
}

function greeting(user, context){
	var userName = context.userProfile;
	var content = sender.plainText("Hola "+ userName.first_name + "!, decime cuánto tiempo tenés y te diré que podés hacer!  📅 ");
	var message = sender.headerMessage(user,content);
	return message;
}

function party(user, context){
	var content = sender.plainText("Fiesta? donde?");
	bot.sendMessage(user, content, function(err, info){if(!err){}else{}
		var gif = sender.image('https://media.giphy.com/media/CndhbyVs2BLTW/giphy.gif');
		bot.sendMessage(user, gif, function(err, info){
			if(!err){
                pbox.startParty();
                bot.sendMessage(user, sender.plainText("Misión cumplida!"));
			}
		});
	});
}

function bye(user, context){
	var content = sender.plainText("PUMM!");
	bot.sendMessage(user, content, function(err, info){
		if(!err){
			pbox.stopParty();
			console.log("Sent", info);
		}
	});
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
	var data = {"source_type":"twitter","accept_language":"en","include_raw":false,"language":"en","userId":"KingJames"};

    request({
        url: url,
        method:'POST',
        json: data
    }, function(err, res, body) {
        if (err && body) {
            console.log('error','Error while using personality insights', err);
        } else {
        	var big5 = body.raw_v3_response.personality;
        	var personality = [];
        	var duration = Number(context.duration);

        	personality.push(1);
        	personality.push(1/duration);

        	for(var i = 0; i < big5.length; i++){
				personality.push(big5[i].percentile/duration);
			}
        	var location = context["location"];
        	tradeoff.pareto(location, personality, function(err, results){
        		console.log('PARETO:', results.length, JSON.stringify(results));

        		var elements = [];
        		for(var k = 0; k < results.length; k++){
                    var placeName = results[k].name;
                    var details = tradeoff.getOptionDetails(location,placeName);

                    var postButton = sender.postButton({title:'Más información',payload:placeName});
                    //var urlButton = sender.urlButton({title:'Ir a la página.',web_url:details.site});
                    var element = sender.element({title:placeName,buttons:[postButton], imageUrl:details.url});
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
