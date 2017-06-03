var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var randomString = require('randomstring');
var schema = mongoose.Schema;

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var UserSchema = new schema({
  _id : String,
  firstName : String,
  lastName : String,
  nickname : String,
  email : String,
  password : String,
  alertType : Number,
  alertSound : String,
  refreshType : Number,
  refreshRate : Number,
  authToken : String,
  verifyingToken : String,
  favorite : [{
    type : String,
    ref : 'coins'
  }],
  scrap : [{
    type : String,
    ref : 'texts'
  }],
});

var TextSchema = new schema({
  _id : String,
  writer : {
    type : String,
    ref : 'users'
  },
  like : Number,
  content : String
});

var CoinSchema = new schema({
  _id : String,
  name : String,
  company : String,
  price : String,
  volume : String,
  dailyLow : String,
  dailyHigh : String,
  comments : [{
    type : String,
    ref : 'texts'
  }],
  change : String
});


mongoose.connect("mongodb://localhost:27017/livecoin", function(err){
  if(err){
    throw err;
  }
  console.log("DB Server Start Success!");
});

var User = mongoose.model('users', UserSchema);
var Text = mongoose.model('texts', TextSchema);
var Coin = mongoose.model('coins', CoinSchema);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//Load Modules
require('./routes/auth.js')(app, User, randomString);
require('./routes/coin.js')(app, Coin, Text, randomString);
require('./routes/comment.js')(app, User, Text);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
