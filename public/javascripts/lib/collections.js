define(['backbone', 'lib/models'], function(Backbone, Models) {

  'use strict';

  var Mavens = Backbone.Collection.extend({
    model: Models.Maven,
    url: '/api/mavens'
  });

  return {
    Mavens: Mavens
  };

});
