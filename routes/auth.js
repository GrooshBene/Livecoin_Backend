module.exports = init;
function init(app, User, randomString){
    var passport = require('passport');
    var FacebookTkenStrategy = require('passport-facebook-token');
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function(user, done){
        done(null, user);
    });
    passport.deserializeUser(function(obj, done){
        done(null, obj);
    });

    passport.use(FacebookTkenStrategy({
        clientID : "",
        clientSecret : ""
    }, function(accessToken, refreshToken, profile, done){
        console.log(profile);
        User.findOne({
            _id : profile.id
        }, function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                user = new User({
                    _id : profile.id,
                    firstName : profile.name[1],
                    lastName : profile.name[0],
                    email : profile.email,
                    nickname : profile.username,
                    password : "null",
                    alertType : 0,
                    alertSound : "Basic",
                    refreshType : 0,
                    refreshRate : 0,
                    authToken : ""
                });
                user.save(function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        done(null, profile);
                    }
                });
            }
            else if(user){
                done(null, profile);
            }
        });
    }));

    app.get('/auth/facebook/token', passport.authenticate('facebook-token'), function(req, res){
        console.log("User Token : "+ req.param('access_token'));
        if(req.user){
            User.findOne({_id : req.user.id}, function(err, result){
                if(err){
                    console.log("/auth/facebook/token User Finding Error : " + err);
                    res.send(404, "User Finding DB Error");
                }
                res.send(200, result);
            });
        }
        else if(!req.user){
            res.send(404, "Can't find User On Facebook. It May Be Unusable User Data.");
        }
    });

    app.get('/auth/facebook/callback', passport.authenticate('facebook-token', {
        successRedirect : "/",
        failureRedirect : "/"
    }));

    app.post('/auth/local/register', function(req, res){
        user = new User({
            _id : randomString.generate(13),
            firstName : req.param('firstName'),
            lastName : req.param('lastName'),
            email : req.param('email'),
            password : req.param('password'),
            nickname : req.param('nickname'),
            alertType : 0,
             alertSound : "Basic",
            refreshType : 0,
            refreshRate : 0,
            authToken : randomString.generate(15)
        });
        User.find({email : req.param('email')}.exec(function(err, result){
            if(err){
                console.log('/auth/local/register DB Error');
                res.send(403, "/auth/loca/register DB Error");
            }
            if(result.length != 0){
                console.log("User Data Exists!");
                res.send(401, "User Data Exists!");
            }
            else if(result.length == 0){
                user.save(function(err){
                    if(err){
                        console.log("/auth/local/register Failed");
                        res.send(403, "/auth/local/register DB Error");
                    }
                    else{
                        console.log("User Added : " + user);
                        res.send(200, user);
                    }
                });
            }
        }));
    });

    app.post("")
}