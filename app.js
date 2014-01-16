//
//     nodemavens
//     Copyright(c) 2014 Matt Hernandez <matt@modulus.io>
//     MIT Licensed
//

var express = require('express')
  , http    = require('http')
  , path    = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');
app.set('title', 'Node Mavens');

app.disable('x-powered-by');

app.use(express.favicon('public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

var models = require('./server/models')()
  , controllers = require('./server/controllers')(models);

require('./server/routes')(app, controllers);

http.createServer(app).listen(app.get('port'));
