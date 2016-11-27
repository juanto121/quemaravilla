'use strict'
const watson = require('watson-developer-cloud');

let conversation = watson.conversation({
 	password: "ZhuZKrSOD4UM",
  	username: "92c387a1-7d8a-434d-82c6-681922f6bee4",
	version: 'v1',
	version_date: '2016-09-20'
});

var context = null;

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

			saveContextIntent(res);
			if(convContext && convContext.command){
				cmd = convContext.command;
				if(context){
                    context.system = convContext.system;
				}else{
					context = convContext;
				}

			}else{
				cmd = "NOP";
			}

			callback(null, convContext, res);
		}else{
			console.log('Conversation err');
			callback(err);
		}
	});
};

exports.getContext = function(){
	return context;
};

function saveContextIntent(res){
	var _ent = res.entities;
	if(_ent && _ent.length>0){
		var entity = _ent[0];
		context[entity.entity] = entity.value;
	}
}