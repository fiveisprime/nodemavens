//
//     nodemavens
//     Copyright(c) 2014 Matt Hernandez <matt@modulus.io>
//     MIT Licensed
//

var request = require('request')
  , Q       = require('q');

const GITHUB_ROOT_URL = 'https://api.github.com/users/';
const UA_STRING       = 'fiveisprime/nodemavens';

//
// Helper for getting user data from GitHub.
//
var getGitHubUser = function(username) {
  var deferred = Q.defer(), retryCount = 1;
  var opts = {
    method: 'GET'
  , url: GITHUB_ROOT_URL + username
  , json: true
  , headers: {
      'User-Agent': UA_STRING
    }
  , qs: {
      client_id: process.env.CLIENT_ID || ''
    , client_secret: process.env.CLIENT_SECRET || ''
    }
  };

  if (!username) return deferred.reject(new Error('Invalid user.'));

  !function sendRequest() {
    request(opts, function(err, response, body) {
      if (err) {
        return deferred.reject(err);
      }

      // Incomplete response, try up to 5 times.
      if (response.statusCode === 202 && retryCount++ <= 5) {
        return setTimeout(sendRequest, 300);
      }

      if (response.statusCode === 404) {
        return deferred.reject(new Error('GitHub user not found.'));
      }

      if (response.statusCode !== 200) {
        console.log('GitHub request failed', opts, response.statusCode, body);
        return deferred.reject(new Error(body));
      }

      deferred.resolve(body);
    });
  }();

  return deferred.promise;
};

//
// Exposed controllers.
// ====================
//
module.exports = function(models) {
  var internals = {};

  //
  // Create or update a maven.
  //
  internals.create = function(username) {
    var deferred = Q.defer();

    if (!username) {
      return deferred.reject(new Error('Invalid user.'));
    }

    getGitHubUser(username)
      .then(models.create)
      .then(deferred.resolve)
      .fail(deferred.reject)
      .done();

    return deferred.promise;
  };

  //
  // Get most resent mavens.
  //
  internals.getRecent = function() {
    var deferred = Q.defer();

    models.getRecent()
      .then(deferred.resolve)
      .fail(deferred.reject)
      .done();

    return deferred.promise;
  };

  //
  // Get a maven.
  //
  internals.get = function(username) {
    var deferred = Q.defer();

    models.get(username)
      .then(deferred.resolve)
      .fail(deferred.reject)
      .done();

    return deferred.promise;
  };

  //
  // Add some love to the specified user.
  //
  // If the username isn't found, a new user (maven) will be created.
  //
  internals.love = function(username) {
    var deferred = Q.defer();

    models.addLove(username)
      .then(deferred.resolve)
      .fail(deferred.reject)
      .done();

    return deferred.promise;
  };

  return internals;
};
