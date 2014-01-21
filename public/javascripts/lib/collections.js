define(['backbone', 'lib/models'], function(Backbone, Models) {

  'use strict';

  var Mavens = Backbone.Collection.extend({
    model: Models.Maven,
    url: '/api/mavens'
  });

  var RecentMavens = Backbone.Collection.extend({
    model: Models.Maven,
    url: '/api/mavens/recent'
  });

  return {
    Mavens: Mavens,
    RecentMavens: RecentMavens
  };

});
