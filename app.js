var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var bluebird = require('bluebird');
var passport = require('passport');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var auth = require('./routes/auth');
var category = require('./routes/category');
var post = require('./routes/post');

var app = express();
app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/blog-cms',{
    promiseLibrary: bluebird,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(()=>{
    console.log('connection successful');
}).catch((err)=>{
    console.error(err);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', auth);
app.use('/api/category', category);
app.use('/api/post', post);

module.exports = app;
