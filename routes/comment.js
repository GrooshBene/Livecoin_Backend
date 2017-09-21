module.exports = init;
function init(app, User, Text, randomString, Coin){
    var mongoose = require('mongoose');
    app.post('/comment/add', function(req, res){
        var text = new Text({
            _id : randomString.generate(13),
            writer : req.body.user_id,
            like : [],
            content : req.body.content
        });
        text.save(function(err){
            if(err){
                console.log('/comment/add Save Error');
                res.send(401, '/comment/add Save Error');
            }
            Coin.findOneAndUpdate({id : mongoose.Schema.Types.ObjectId(req.body.coin_id)}, {$push : {comments : text._id}}, function(err, result){
                if(err){
                    console.log('/comment/add Coin Update Error');
                    res.send(401, '/comment/add Coin Update Error');
                }
            });
            res.send(200, text);
        });

    });

    app.post('/comment/:company/:coin', function(req, res){
        Coin.findOne({company : req.body.company, name : req.body.coin}, function(err, result){
            if(err){
                console.log('/comment/:company/:coin Find DB Error');
                res.send(401, '/comment/:company/:coin Find Error');
                }
            console.log(result.comments);
            res.send(200, result.comments);
        });
    });

    app.post('/comment/:id/block', function(req, res){
        //adminpage
    });

    app.post('/comment/:id/like', function(req, res){
        Text.findOneAndUpdate({_id : req.param('id')}, {$push : {like : req.body.user_id}}, function(req, res){
            if(err){
                console.log('/comment/:id/like Update DB Error');
                res.send(401, '/comment/:id/:like Update Error');
            }
            res.send(200, result);
        });
    });
 
    app.post('/comment/:id/scrap', function(req, res){
        User.findOneAndUpdate({_id : req.body.user_id}, {$push : {scrap : req.body.id}}, function(req,res){
            if(err){
                console.log('/comment/:id/scrap Update DB Error');
                res.send(401, '/comment/:id/scrap Update DB Error');
            }
            res.send(200, result);
        });
    });

    app.post('/comment/:id/report', function(req, res){
        User.findOneAndUpdate
    });
}
