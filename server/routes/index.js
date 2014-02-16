//
//     nodemavens
//     Copyright(c) 2014 Matt Hernandez <matt@modulus.io>
//     MIT Licensed
//

var blacklist = JSON.parse(process.env.BLACKLIST || '[]');
var ips = {};

module.exports = function(app, controller) {

  //
  // Disallow blacklisted IPs and verify the session count.
  //
  app.all('/*', function(req, res, next) {
    if ('POST' === req.method) {

      var ip = req.ip
        , ua = req.headers['user-agent'];
      
      if (!ips[ip]) {
        ips[ip] = 1;
      } else {
        ips[ip]++;
      }
        
      if (ips[ip] >= 5) {
        blacklist.push(ip);
        console.error('[%s] add %s to blacklist', new Date().toString(), ip);
      }
      
      console.log(new Date().toString(), ip);

      if (blacklist.indexOf(ip) >= 0 || !ua || ua.indexOf('curl') >= 0) {
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
