//
//     nodemavens
//     Copyright(c) 2014 Matt Hernandez <matt@modulus.io>
//     MIT Licensed
//

module.exports = function(app, controller) {
  var blacklist = JSON.parse(process.env.BLACKLIST || '[]');

  //
  // Disallow blacklisted IPs and verify the session count.
  //
  app.all('/*', function(req, res, next) {
    if ('POST' === req.method) {

      if (!req.headers['x-forwarded-for']) {
        // This occurs when running locally.
        return next();
      }

      var ips = req.headers['x-forwarded-for'].split(',')
        , ua  = req.headers['user-agent'];

      console.log(new Date().toString(), ips);

      var blocked = blacklist.some(function(ip) {
        return ips.indexOf(ip) >= 0;
      });

      if (blocked || !ua || ua.indexOf('curl') >= 0) {
        res.statusCode = 403;
        return res.json();
      }

      if (req.session.count) {
        if (req.session.count === 5) {
          return res.json({
            error: 'Whoa! That\'s a little too much love... you\'re making people uncomfortable...'
          });
        } else {
          req.session.count++;
        }
      } else {
        req.session.count = 1;
      }
    }

    next();
  });

  //
  // GET index.
  //
  app.get('/', function(req, res) {
    res.sendfile('./server/views/index.html');
  });

  //
  // API routes.
  // ===========
  //

  //
  // GET the most recent mavens.
  //
  app.get('/api/mavens/recent', function(req, res) {
    controller.getRecent()
      .then(function(mavens) {
        res.json(mavens);
      })
      .fail(function(err) {
        res.json({ error: err.message });
      })
      .done();
  });

  //
  // GET mavens.
  //
  app.get('/api/mavens/:username?', function(req, res) {
    controller.get(req.params.username)
      .then(function(mavens) {
        res.json(mavens);
      })
      .fail(function(err) {
        res.json({ error: err.message });
      })
      .done();
  });

  //
  // Create/POST a maven.
  //
  app.post('/api/mavens', function(req, res) {
    controller.create(req.body.username)
      .then(function(maven) {
        res.json(maven);
      })
      .fail(function(err) {
        res.json({ error: err.message });
      })
      .done();
  });

  //
  // Vote for a maven.
  //
  app.post('/api/mavens/:username/love', function(req, res) {
    controller.love(req.params.username)
      .then(function(maven) {
        res.json(maven);
      })
      .fail(function(err) {
        res.json({ error: err.message });
      })
      .done();
  });
};
