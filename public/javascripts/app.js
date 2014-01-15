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

  App.Views.Love = Backbone.View.extend({
    template: Handlebars.templates.love,
    events: {
      'click [type=submit]': 'submit'
    },
    render: function() {
      this.$el.html(this.template()).fadeIn(150);
    },
    submit: function() {
      this.$el.fadeOut(200, _.bind(function() {
        this.$el.html('');
      }, this));

      // TODO: POST to submit.
      return false;
    }
  });

  App.Views.Index = Backbone.View.extend({
    template: Handlebars.templates.index,
    el: document.body,
    events: {
      'click #love': 'spreadLove'
    },
    initialize: function() {
      this.render();
      this.loveForm = new App.Views.Love({
        el: $('#love-form')
      });
    },
    render: function() {
      this.$el.html(this.template());
    },
    spreadLove: function() {
      this.loveForm.render();
      return false;
    }
  });

  App.Views.About = Backbone.View.extend({
    template: Handlebars.templates.about,
    el: document.body,
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html(this.template());
    }
  });

  App.Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      'about': 'about'
    },
    index: function() {
      new App.Views.Index();
    },
    about: function() {
      new App.Views.About();
    }
  });

  new App.Router();
  Backbone.history.start();
});
