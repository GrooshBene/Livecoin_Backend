module.exports = init;
function init(app, Coin, randomString){
    var poloniex_api = require('poloniex-api-node');
    var poloniex = new poloniex_api('KIR1UZCY-AZ8K2TET-BCGD5C6W-HQ4KU5A4','824a2e3e1b276079ea3f625609f033f0dd92104f7fac0b797ea01874827793e20d50d435dc87e4ef7ce878b3b99f70c33b0a4b355ad91bc64fe48bf8147f7213');
    poloniex.returnTicker(function(err, ticker){
            if(err){
                throw err;
            }
            console.log(ticker);
        });
    setInterval(function(){
        poloniex.returnTicker(function(err, ticker){
            if(err){
                throw err;
            }
            console.log(ticker);
        });
    }, 10000);
    app.post('/coin/like', function(req, res){
        Coin.find({id : req.param('id')}, function(err, result){
            
        });
    });

    app.post('/coin/dislike', function(req, res){
        Coin.find({id : req.param('id')}, function(err, result){

        });
    });

}