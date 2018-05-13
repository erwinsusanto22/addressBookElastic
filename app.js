var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var documents = require('./routes/documents');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/contact', documents);

// catch 404
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var elastic = require('./elasticsearch');

elastic.indexExists().then(function (exists) {
  if (exists) {
    return elastic.deleteIndex();
  }
}).then(function () {
  return elastic.initIndex().then(elastic.initMapping).then(function () {
  // create a list of name to test
    var promises = [
      'Bob Builder',
      'John Do',
      'Erwin Susanto',
      'Iron Man',
      'Racoon'
    ].map(function (name) {
      return elastic.addContact({
        title: name,
        phoneNumber: '123-456-7890',
        homeAddress: '100 Baker Street'
      });
    });
    return Promise.all(promises);
  });
});

module.exports = app;
