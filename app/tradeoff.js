var TradeoffAnalyticsV1 = require('watson-developer-cloud/tradeoff-analytics/v1');

var tradeoff_analytics = new TradeoffAnalyticsV1({
    username: 'e53df93c-3480-4a44-8e88-d71d9b338ed0',
    password: 'fsnAqVJMn4Ls'
});

exports.pareto = function(origin, personality, callback) {
    if (origin === 'ibis') {
        var params = require('./data/TOA_ibis.json');
    } else{
        var params = require('./data/TOA_hotel_10.json');
    }

    linearCombination(personality, params);

    tradeoff_analytics.dilemmas(params, function(err, res) {
        if (err) {
            console.log(err);
            callback(err);
        }else{
            var recommended = filter(res);
            callback(null, recommended);
        }
    });
};

function filter(res){
    var resols = res.resolution.solutions;
    var j=resols.length;
    var recommended = [];

    var k;
    for(var i = 0; i < j; i++){
        var s = resols[i];
        if (s.status ==='FRONT'){
            recommended.push(res.problem.options[i].name);
        }
    }
    return recommended;
}