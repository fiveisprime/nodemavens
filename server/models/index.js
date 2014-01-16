//
//     nodemavens
//     Copyright(c) 2014 Matt Hernandez <matt@modulus.io>
//     MIT Licensed
//

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
, love: Number
});

var Maven = mongoose.model('Maven', mavenSchema);

if (!mavenSchema.options.toObject) mavenSchema.options.toObject = {};
mavenSchema.options.toObject.transform = function(doc, ret) {
  delete ret._id;
  delete ret.__v;
};

//
// Exposed models.
// ===============
//
module.exports = function() {
  var internals = {};

  //
  // MongoDB connection.
  //
  mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/test');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'mongoose error:'));

  //
  // Get by username of return all mavens.
  //
  internals.get = function(username) {
    var deferred = Q.defer();

    if (!username) {
      Maven.find({}, null, { sort: { love: -1 }, limit: 20 }, function(err, docs) {
        if (err) {
          deferred.reject(err);
        } else {
          var result = [], i = 0;

          for (; i < docs.length; i++) {
            result.push(docs[i].toObject());
          }

          deferred.resolve(result);
        }
      });
    } else {
      Maven.findOne({ username: username }, function(err, doc) {
        if (err) {
          deferred.reject(err);
        } else {
          if (doc) {
            deferred.resolve(doc.toObject());
          } else {
            deferred.resolve(null);
          }
        }
      });
    }

    return deferred.promise;
  };

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
        doc.love++;
        doc.save(function(err, maven) {
          if (err) {
            return deferred.reject(err);
          }

          return deferred.resolve(maven.toObject());
        });
      } else {
        var maven = new Maven({
          username: ghUser.login
        , name: ghUser.name
        , company: ghUser.company
        , location: ghUser.location
        , avatar_url: ghUser.avatar_url || 'http://www.gravatar.com/avatar/?d=identicon'
        , github_url: ghUser.html_url
        , blog_url: ghUser.blog
        , love: 1
        });

        maven.save(function(err, maven) {
          if (err) {
            return deferred.reject(err);
          }

          deferred.resolve(maven.toObject());
        });
      }
    });

    return deferred.promise;
  };

  //
  // Add some love - increment love by 1.
  //
  internals.addLove = function(username) {
    var deferred = Q.defer();

    Maven.update({ username: username }, { $inc: { love: 1 } }, function(err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(true);
      }
    });

    return deferred.promise;
  };

  return internals;
};
