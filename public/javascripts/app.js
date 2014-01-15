require.config({
  paths: {
    jquery: 'vendor/jquery',
    backbone: 'vendor/backbone',
    underscore: 'vendor/underscore',
    handlebars: 'vendor/handlebars',
    templates: 'templates'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    handlebars: {
      exports: 'Handlebars'
    },
    templates: {
      deps: ['handlebars']
    }
  }
});

require([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'templates'
],
function($, Backbone, _, Handlebars) {
  'use strict';

  var App = {};
  App.Models = {};
  App.Views = {};

  App.Views.Index = Backbone.View.extend({
    template: Handlebars.templates.index,
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html(this.template());
    }
  });

  App.Router = Backbone.Router.extend({
    routes: {
      '': 'index'
    },
    index: function() {
      new App.Views.Index({
        el: $('[role=main]')
      });
    }
  });

  new App.Router();
  Backbone.history.start();
});
