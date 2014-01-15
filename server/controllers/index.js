//
//     nodemavens
//     Copyright(c) 2013 Matt Hernandez <matt@modulus.io>
//     MIT Licensed
//

module.exports = function() {
  var internals = {};

  internals.mavens = require('./mavens')();

  return internals;
};
