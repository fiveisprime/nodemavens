//
//     nodemavens
//     Copyright(c) 2013 Matt Hernandez <matt@modulus.io>
//     MIT Licensed
//

module.exports = function(app, controllers) {
  var mavensController = controllers.mavens;

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
  app.get('/api/mavens/:id?', function(req, res) {
    mavensController.getAll(function(err, mavens) {
      if (err) {
        return res.json({ error: err.message });
      }

      res.json(mavens);
    });
  });

  //
  // Update/PUT a maven.
  //
  app.put('/api/mavens/:id', function(req, res) {
    mavensController.update(req.params.id, req.body, function(err, maven) {
      if (err) {
        return res.json({ error: err.message });
      }

      res.json(maven);
    });
  });

  //
  // Create/POST a maven.
  //
  app.post('/api/mavens', function(req, res) {
    mavensController.create(req.body, function(err, maven) {
      if (err) {
        res.json({ error: err.message });
      }

      res.json(maven);
    });
  });

  //
  // Vote for a maven.
  //
  app.post('/api/mavens/:id/vote', function(req, res) {
    mavensController.vote(req.params.id, function(err, maven) {
      if (err) {
        res.json({ error: err.message });
      }

      res.json(maven);
    });
  });
};
