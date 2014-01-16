//
//     nodemavens
//     Copyright(c) 2013 Matt Hernandez <matt@modulus.io>
//     MIT Licensed
//

module.exports = function() {
  var internals = {}
    , models    = require('../models')();

  internals.mavens = require('./mavens')(models);

  return internals;
};
