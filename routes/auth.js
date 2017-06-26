module.exports = init;
function init(app, User, randomString){
    var passport = require('passport');
    // var mailer = require('nodemailer');
    //asdf

    // function mail_auth(reciever, id, password){
    //     var token = randomString.generate(16);
    //     var smtpTransport = mailer.createTransport("SMTP", {
    //         service : "Gmail",
    //         auth : {
    //             user : id,
    //             pass : password
    //         }
    //     });
    //     var mailOptions = {
    //         from : '회원가입 <LiveCoin>',
    //         to : receiver,
    //         subject : "LiveCoin 회원가입 인증 메일입니다.",
    //         text : token + " 을 이용하여 인증 부탁드립니다."
    //     }
    //     smtpTransport.sendMail(mailOptions, function(err, result){
    //         if(err){
    //             console.log("mail_auth error");
    //             throw err;
    //         }
    //         console.log("Mail sended : " +result);
    //     });

    //     return token;
    // }
    // function mail_send(reciever, id, password, content){
    //     var smtpTransport = mailer.createTransport("SMTP", {
    //         service : "Gmail",
    //         auth : {
    //             user : id,
    //             pass : password
    //         }
    //     });
    //     var mailOptions = {
    //         from : "아이디/비밀번호 복구 <LiveCoin>",
    //         to : reciever,
    //         subject : 'LiveCoin 아이디/비밀번호 인증 메일입니다',
    //         text : content
    //     }
    //     smtpTransport.sendMail(mailOptions, function(err, result){
    //         if(err){
    //             console.log("mail_send error");
    //             throw err;
    //         }
    //         console.log("Mail Sended : " + result);
    //     });
    // }

    var FacebookTokenStrategy = require('passport-facebook-token');
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function(user, done){
        done(null, user);
    });
    passport.deserializeUser(function(obj, done){
        done(null, obj);
    });

    passport.use(new FacebookTokenStrategy({
        clientID : "247151832435976",
        clientSecret : "62585d23d288396ee3de224af2e0d34f"
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
                    authToken : "",
                    verifyingToken : "",
                    favorite : [],
                    scrap : []
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
        // console.log("User Token : "+ req.param('access_token'));
        // if(req.user){
        //     User.findOne({_id : req.user.id}, function(err, result){
        //         if(err){
        //             console.log("/auth/facebook/token User Finding Error : " + err);
        //             res.send(404, "User Finding DB Error");
        //         }
        //         res.send(200, result)
        //     });
        // }
        // else if(!req.user){
        //     res.send(404, "Can't find User On Facebook. It May Be Unusable User Data.");
        // }
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
            authToken : randomString.generate(15),
            verifyingToken : /*mail_auth(req.param('email'), 'wltn9247', 'wltn6705')*/'',
            favorite : [],
            scrap : []
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

    app.post('/auth/local/register/mail', function(req, res){
        User.findOne({email : req.param('email'), function(err, result) {
            if(err){
                console.log('/auth/register/mail DB Error');
                res.send(403, "/auth/register/mail DB Error");
            }
            if(result.verifyingToken == req.param('token')){
                console.log('User '+ result + " Veryfied!");
                res.send(200, result);
            }
            else if(result.verifyingToken != req.param('token')){
                console.log("User "+ result + " Veryfing Failed!");
                res.send(404, "Unmatched token");
            }
        }})
    })

    app.post("/auth/local/authenticate", function(req, res){
        console.log('Auth Key : '+ req.param('token'));
        User.findOne({authToken : req.param('token')}, function(err, result){
            if(err){
                console.log("/auth/authenticate failed");
                res.send(404, "Cannnot Auth User");
            }
            console.log("User "+ result + "Logged In");
            res.send(200, result);
        });
    });

    app.post("/auth/local/login", function(req, res){
         console.log("User Login : " + req.param('email'));
        User.findOne({email : req.param('email')}, function (err, result) {
            console.log("DB Founded : "+ result);
            if(err){
                console.log("/auth/local/login failed");
                res.send(403, "/auth/local/login DB Error");
            }
            if(result) {
                if (req.param('email') == undefined) {
                    console.log("Unvalid User Infomation");
                    res.send(401, "Unvalid User Infomation");
                }
                else if (req.param('email') != undefined && result.password == req.param('password')) {
                    console.log("User " + result.name + "Logged In");
                    res.send(200, response);
                }
                else if (result.password != req.param('password')) {
                    console.log("Password Error!");
                    res.send(401, "Access Denied");
                }
            }
            else{
                console.log("Can't Find User Data");
                res.send(404, "Cant't Find User Data");
            }
        });
    })

    app.post('/auth/logout', function(req, res){
        req.session.destroy(function (err){
            if(err){
                console.log("/auth/logout session destroy error");
                res.send(403, "/auth/logout session destroy error");
            }
            res.send(200, "Logout Successfully");
        });
    });
}