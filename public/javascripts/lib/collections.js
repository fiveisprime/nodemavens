define(['backbone', 'lib/models'], function(Backbone, Models) {

  var Mavens = Backbone.Collection.extend({
    model: Models.Maven,
    url: '/api/mavens'
  });

  return {
    Mavens: Mavens
  };

});
