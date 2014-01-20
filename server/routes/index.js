//
//     nodemavens
//     Copyright(c) 2014 Matt Hernandez <matt@modulus.io>
//     MIT Licensed
//

module.exports = function(app, controller) {

  //
  // GET index.
  //
  app.get('/', function(req, res) {
    res.render('index');
  });

  //
  // API routes.
  // ===========
  //

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
    if (req.session.count) {
      if (req.session.count === 5) {
        return res.json({ error: 'Whoa! That\'s a little too much love.. you are making people uncomfortable.' });
      } else {
        req.session.count++;
      }
    } else {
      req.session.count = 1;
    }

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
    if (req.session.count) {
      if (req.session.count === 5) {
        return res.json({ error: 'Whoa! That\'s a little too much love.. you are making people uncomfortable.' });
      } else {
        req.session.count++;
      }
    } else {
      req.session.count = 1;
    }

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
