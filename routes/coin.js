module.exports = init;
function init(app, Coin, randomString){
    var poloniex_api = require('poloniex-api-node');
    var poloniex = new poloniex_api('KIR1UZCY-AZ8K2TET-BCGD5C6W-HQ4KU5A4','824a2e3e1b276079ea3f625609f033f0dd92104f7fac0b797ea01874827793e20d50d435dc87e4ef7ce878b3b99f70c33b0a4b355ad91bc64fe48bf8147f7213');
    var BFX = require('bitfinex-api-node');
    var bfx_opts = {
        version : 2,
        transform : true
    }
    var bws = new BFX("R6lTOMl9RZBwQp6ERDLDioyNphYNc51YUqR7kDMvNJb", "34r9YdMXYD0zoMIjWavMQfXLUJ3CfznazcpjLcXhMht", bfx_opts).ws;
    bws.on('open', function(){
        bws.subscribeTicker('BTCUSD');
        bws.subscribeOrderBook('BTCUSD');
        bws.subscribeTrades('BTCUSD');
    });
    bws.on('ticker', function(pair, ticker){
        console.log('Ticker : ' + ticker);
    });
    poloniex.returnTicker(function(err, ticker){
        //needs Promise
            if(err){
                throw err;  
            }
            var temp_array = Object.keys(ticker);
            for (i=0; i<temp_array.length; i++){
                console.log(ticker[temp_array[i]].id);
                var coin = new Coin({
                    _id : randomString.generate(13),
                    name : temp_array[i],
                    company : "Poloniex",
                    price : ticker[temp_array[i]].last,
                    volume : ticker[temp_array[i]].baseVolume,
                    dailyLow : ticker[temp_array[i]].low24hr,
                    dailyHigh : ticker[temp_array[i]].high24hr,
                    like : 0,
                    dislike : 0,
                    comments : [],
                    change : ticker[temp_array[i]].percentChange
                });

                coin.save(function(err){
                    if(err){
                        console.log("Coin Data Setting Error!");
                        throw err;
                    }
                    console.log(coin.name);
                    // console.log("Coin "+ ticker[temp_array[i]].id + " Saved!");
                });
            } 
        });
    setInterval(function(){
        poloniex.returnTicker(function(err, ticker){
            if(err){
                throw err;
            }
            var temp_array = Object.keys(ticker);
            for (i=0; i<temp_array.length; i++){
                Coin.findOneAndUpdate({name : temp_array},
            {
                price : ticker[temp_array[i].last],
                volume : ticker[temp_array[i]].baseVolume,
                dailyLow : ticker[temp_array[i]].low24hr,
                dailyHigh : ticker[temp_array[i]].high24hr,
                change : ticker[temp_array[i]].percentChange
        }).exec(function(err, result){
                if(err){
                    console.log("Coin Data Updating Error!");
                    throw err;
                }
                console.log("Coin "+ticker[temp_array[i]].id + " Updated!");
        });
            }
        });
    }, 10000);
    app.post('/coin/like', function(req, res){
        Coin.findOneAndUpdate({id : req.param('id')}, {$inc : {like : 1}}, function(err, result){
            if(err){
                console.log("/coin/like failed");
                res.send(401, result);
                throw err;
            }
            res.send(200, result);
        });
    });

    app.post('/coin/dislike', function(req, res){
        Coin.findOneAndUpdate({id : req.param('id')}, {$inc : {like :1}}, function(err, result){
            if(err){
                console.log("/coin/dislike failed");
                res.send(401, result);
                throw err;
            }
            res.send(200, result);
        });
    });

    //bitfinex 
    //id : R6lTOMl9RZBwQp6ERDLDioyNphYNc51YUqR7kDMvNJb
    //secret : 34r9YdMXYD0zoMIjWavMQfXLUJ3CfznazcpjLcXhMht
}