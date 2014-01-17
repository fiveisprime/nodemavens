define(['backbone', 'lib/views'], function(Backbone, Views) {

  var Router = Backbone.Router.extend({
    routes: {
      '': 'index'
    },
    index: function() {
      new Views.Index();
    }
  });

  return Router;

});
