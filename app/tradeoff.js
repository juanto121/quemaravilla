var TradeoffAnalyticsV1 = require('watson-developer-cloud/tradeoff-analytics/v1');
const ibis = require('./data/TOA_ibis.json');
const hotel_10 = require('./data/TOA_hotel_10.json');

var tradeoff_analytics = new TradeoffAnalyticsV1({
    username: 'e53df93c-3480-4a44-8e88-d71d9b338ed0',
    password: 'fsnAqVJMn4Ls'
});

exports.pareto = function(origin, personality, callback){
    var params = ibis;
    if (origin === 'hotel_ibis'){
        params = ibis;
        params[0] = ibis.options[0].values.distance;
        params[1] = ibis.options[0].values.time;
    } else{
        params = hotel_10;
        params[0] = hotel_10.options[0].distance;
        params[1] = hotel_10.options[1].time;
    }
    console.log(params);

    var result = linearTransformation(personality, params);

    tradeoff_analytics.dilemmas(result, function(err, res) {
        if (err) {
            console.log(err);
            callback(err);
        }else{
            var recommended = filter(res);
            callback(null, recommended);
        }
    });
};

exports.getOptionDetails = function(origin, name){
    var options = ibis.options;
    var details = null;
    if(origin === 'ibis'){
        options = ibis.options;
    }else{
        options = hotel_10.options;
    }
    var option = null;
    for(var i = 0; i < options.length; i++){
        option = options[i];
        if(option.name === name){
            details = {
                name:option.name,
                url:option.url,
                image:option.image?option.image:''
            };
        }
    }
    return details;
};

function linearTransformation(a,b){
    var lena = a.length;
    var lenb = b.length;
    if(lena === lenb) {
        for (var i = 0; i < lena; i++) {
            b[i] *= a[i];
        }
    }
    return b;
}

function filter(res){
    var resols = res.resolution.solutions;
    var j=resols.length;
    var recommended = [];

    var k;
    for(var i = 0; i < j; i++){
        var s = resols[i];
        if (s.status ==='FRONT'){
            recommended.push(res.problem.options[i]);
        }
    }
    return recommended;
}