//
//     nodemavens
//     Copyright(c) 2014 Matt Hernandez <matt@modulus.io>
//     MIT Licensed
//

var express    = require('express')
  , MongoStore = require('connect-mongo')(express)
  , http       = require('http')
  , path       = require('path');

var app = express();

app.use(express.cookieParser(process.env.SECRET || 'cats'));
app.use(express.session({
  secret: process.env.SECRET || 'cats'
, cookie: { maxAge: 24 * 60 * 60 * 1000 }
, store: new MongoStore({
    url: process.env.MONGO_URL || 'mongodb://localhost/test'
  })
}));

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');
app.set('title', 'Node Mavens - Sharing Node Love');

app.disable('x-powered-by');

app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
// app.use(express.logger('dev'));
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
