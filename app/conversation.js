'use strict'
const watson = require('watson-developer-cloud');

let conversation = watson.conversation({
 	password: "ZhuZKrSOD4UM",
  	username: "92c387a1-7d8a-434d-82c6-681922f6bee4",
	version: 'v1',
	version_date: '2016-09-20'
});

var context = {};

exports.reply = function(message, callback){
	conversation.message({
		workspace_id: 'b6a87e3d-a3b5-48d4-8414-904e9ffbaaa0',
		input: {'text':message},
		context: context
	}, function(err, res){
		if(!err){
			var cmd;
			var convContext = res.context;
			console.log(JSON.stringify(res));

			if(convContext && convContext.command){
				cmd = convContext.command;
				context = convContext;
			}else{
				cmd = "NOP";
			}

			callback(null, convContext);
		}else{
			console.log('Conversation err');
			callback(err);
		}
	});
};
