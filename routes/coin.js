module.exports = init;
function init(app, User, Coin, randomString){
	var mongoose = require('mongoose');
    // var poloniex_api = require('poloniex-api-node');
    // var poloniex = new poloniex_api('KIR1UZCY-AZ8K2TET-BCGD5C6W-HQ4KU5A4','824a2e3e1b276079ea3f625609f033f0dd92104f7fac0b797ea01874827793e20d50d435dc87e4ef7ce878b3b99f70c33b0a4b355ad91bc64fe48bf8147f7213');
    // var BFX = require('bitfinex-api-node');
    // var KrakenCLient = require('kraken-api');
    // var kraken = new KrakenCLient('Lynpj91IB1SkuXqQfdlR/1r9/7FFPB15jBQquJdGJH3UO9ym3hQVx0TV', 'OYV6yFhXlTFoaNjysv3eswOVDXuOIpihPiTKPWIL7O+/4RqBeW6Q51qj/+9jMi3/H/oCDMAIN+bjUJpKire7dg==');
    // var bfx_opts = {
    //     version : 2,
    //     transform : true
    // }
    // var bws = new BFX("R6lTOMl9RZBwQp6ERDLDioyNphYNc51YUqR7kDMvNJb", "34r9YdMXYD0zoMIjWavMQfXLUJ3CfznazcpjLcXhMht", bfx_opts).ws;
    // bws.on('open', function(){
    //     bws.subscribeTicker('BTCUSD');
    //     bws.subscribeOrderBook('BTCUSD');
    //     bws.subscribeTrades('BTCUSD');
    // });
    // bws.on('ticker', function(pair, ticker){
    //     str = JSON.stringify(ticker);
    //     str = JSON.stringify(ticker, null, 4);
    //     console.log('Ticker : ' + str);
    // });
    // kraken.api('AssetPairs', {}, function(err, data){
    //     if(err){
    //         console.log(err);
    //         throw err;
    //     }
    //     console.log(data.result);
    // })
    // setInterval(function(){
		// console.log("Update Loop On!");
    //     poloniex.returnTicker(function(err, ticker){
    //         if(err){
    //             console.log(err);
    //         }
		// 	console.log(ticker);
    //         var temp_array = Object.keys(ticker);
    //         for (i=0; i<temp_array.length; i++){
    //             Coin.findOneAndUpdate({name : temp_array[i]},
    //         {
    //             price : ticker[temp_array[i]].last,
    //             volume : ticker[temp_array[i]].baseVolume,
    //             dailyLow : ticker[temp_array[i]].low24hr,
    //             dailyHigh : ticker[temp_array[i]].high24hr,
    //             change : ticker[temp_array[i]].percentChange
    //     }, {upsert : true}).exec(function(err, result){
    //             if(err){
    //                 console.log("Coin Data Updating Error!");
    //                 throw err;
    //             }
    //             //console.log("Coin "+ticker[temp_array[i]].id + " Updated!");
    //     });
    //         }
    //     });
		// console.log("Update Loop Off!");
    // }, 60000);
	app.post('/coin/user/favorite/add', function(req, res){
		User.findOneAndUpdate({_id : req.param('user_id')}, {$push : {favorite : mongoose.Types.ObjectId(req.param('coin_id'))}}, {new : true})
			.exec(function(err, result){
			if(err){
				console.log('/coin/add/user failed');
				res.send(401, err);
			}
			res.send(200, result);
		});
	});
	app.post('/coin/user/favorite', function(req, res){
		User.findOne({_id : req.param('user_id')}).populate('favorite').exec(function(err, result){
			if(err){
				console.log('/coin/user/favorite failed');
				res.send(401, err);
			}
			res.send(200, result);
		});
	});
    app.post('/coin/find/:companyName', function(req, res){
        Coin.find({company : req.param('companyName')}, function(err, result){
            if(err){
                console.log('/coin/find/:companyName failed');
                res.send(401, err);
            }
            res.send(200, result);
        })
    })
	app.post('/coin/find/:companyName/:coinName', function(req, res){
		Coin.find({company : req.param('companyName'), name : req.param('coinName')}, function(err, result){
			if(err){
				console.log('/coin/find/:companyName failed');
				res.send(401, err);
			}
			res.send(200, result);
		})
	});
    
    app.post('/coin/like/:companyName/:coinName', function(req, res){
        Coin.findOneAndUpdate({company : req.param('companyName'), name : req.param('coinName')}, {$push : {like : req.param('user_id')}}, function(err, result){
            if(err){
                console.log('/coin/dislike failed');
                res.send(401, err);
            }
			res.send(200, result);
        });
    });
    
    app.post('/coin/dislike/:companyName/:coinName', function(req, res){
        Coin.findOneAndUpdate({company : req.param('companyName'), name : req.param('coinName')}, {$push : {like : req.param('user_id')}}, function(err, result){
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
