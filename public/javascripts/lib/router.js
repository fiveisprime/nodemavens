define(['backbone', 'lib/views'], function(Backbone, Views) {

  'use strict';

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
