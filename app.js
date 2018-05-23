var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var routes = require('./routes');
var user = require('./routes/user');
var dashboard = require('./routes/dashboard');
var pdftest = require('./routes/pdfgen');

var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var connection = mysql.createConnection({
  host:'localhost',
  user:'kianluke3202',
  password: 'pass123',
  database:'swapsiedb'
});

connection.connect();
global.db = connection;

//Initialize session
var session = require('express-session');
app.use(session({
  secret: 'lukesmells',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 60000}
}));

// create reusable transport method (opens pool of SMTP connections)
let smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
      user: "stinge3202@gmail.com",
      pass: "infs3202"
  }
});

global.smtp = smtpTransport;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080);

//------ROUTING ----// 
app.get('/', routes.index);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', user.login);//call for login page
app.post('/login', user.login);//call for login post
app.get('/dashboard', dashboard.dashboard);//call for dashboard page after login
app.get('/logout', user.logout);//call for logout
app.get('/pdf', pdfgen.pdfgen);


//BELOW CURRENTLY USED FOR DEBUGGING... CHANGE TO A NICE 404 PAGE WHEN FINISHED
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
