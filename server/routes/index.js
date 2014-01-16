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
