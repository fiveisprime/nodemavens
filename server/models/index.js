var mongoose = require('mongoose')
  , Q        = require('q');

var mavenSchema = mongoose.Schema({
  username: { type: String, required: true, index: true }
, name: String
, company: String
, location: String
, avatar_url: String
, github_url: String
, blog_url: String
, rep: Number
});

var Maven = mongoose.model('Maven', mavenSchema);

module.exports = function() {
  var internals = {};

  //
  // MongoDB connection.
  //
  mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/test');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'mongoose error:'));

  //
  // Create a maven document.
  //
  internals.create = function(ghUser) {
    var deferred = Q.defer();

    if (!ghUser) {
      return deferred.reject(new Error('GitHub user not found.'));
    }

    Maven.findOne({ username: ghUser.login.toLowerCase() }, function(err, doc) {
      if (err) {
        return deferred.reject(err);
      }

      if (doc) {
        doc.rep++;
        doc.save(function(err, maven) {
          if (err) {
            return deferred.reject(err);
          }

          return deferred.resolve(maven);
        });
      } else {
        var maven = new Maven({
          username: ghUser.login
        , name: ghUser.name
        , company: ghUser.company
        , location: ghUser.location
        , avatar_url: ghUser.avatar_url
        , github_url: ghUser.html_url
        , blog_url: ghUser.blog
        , rep: 1
        });

        maven.save(function(err, maven) {
          if (err) {
            return deferred.reject(err);
          }

          deferred.resolve(maven);
        });
      }
    });

    return deferred.promise;
  };

  return internals;
};