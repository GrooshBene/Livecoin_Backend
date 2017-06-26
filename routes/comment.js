module.exports = init;
function init(app, User, Text, randomString, Coin){
    app.post('/comment/add', function(req, res){
        var text = new Text({
            _id : randomString.generate(13),
            writer : req.param('id'),
            like : 0,
            content : req.param('content')
        });
        Coin.findOneAndUpdate({id : req.param('id')}, {$push : {comments : text._id}}, function(err, result){
            if(err){
                console.log('/comment/add Coin Update Error');
                res.send(401, '/comment/add Coin Update Error');
            }
        });
        text.save(function(err){
            if(err){
                console.log('/comment/add Save Error');
                res.send(401, '/comment/add Save Error');
            }
            res.send(200, text);
        });

    });

    app.post('/comment/:company/:coin', function(req, res){
        Coin.findOne({company : req.param('company'), name : req.param('name')}, function(err, result){
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
        Coin.findOneAndUpdate({_id : req.param('id')}, {$inc : {like : 1}}, function(req, res){
            if(err){
                console.log('/comment/:id/like Update DB Error');
                res.send(401, '/comment/:id/:like Update Error');
            }
            res.send(200, result);
        });
    });

    app.post('/comment/:id/scrap', function(req, res){
        User.findOneAndUpdate({_id : req.param('user_id')}, {$push : {scrap : req.param(id)}}, function(req,res){
            if(err){
                console.log('/comment/:id/scrap Update DB Error');
                res.send(401, '/comment/:id/scrap Update DB Error');
            }
            res.send(200, result);
        });
    });

    app.post('/comment/:id/report', function(req, res){
        //adminpage
    });
}