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

  $.fn.center = function () {
    this.css('left', Math.max(
      0,
      (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + 'px');
    return this;
  };

  var App = {};
  App.Views = {};
  App.Models = {};
  App.Collections = {};

  App.Models.Maven = Backbone.Model.extend({
    defaults: {}
  });

  App.Collections.Mavens = Backbone.Collection.extend({
    model: App.Models.Maven
  });

  App.Views.Love = Backbone.View.extend({
    template: Handlebars.templates.love,
    el: '#love-form',
    events: {
      'click [type=submit]': 'submit'
    },
    render: function() {
      this.$el.html(this.template()).center().fadeIn(150);
      this.$el.find('[name=username]').focus();
    },
    submit: function() {
      this.$el.fadeOut(200, _.bind(function() {
        this.$el.html('');
      }, this));

      // TODO: POST to submit.
      return false;
    }
  });

  App.Views.About = Backbone.View.extend({
    template: Handlebars.templates.about,
    el: '#about-modal',
    events: {
      'click': 'hide'
    },
    render: function() {
      this.$el.html(this.template());
      this.$el.center().fadeIn(100);
    },
    hide: function() {
      this.$el.fadeOut(200);
    }
  });

  App.Views.Index = Backbone.View.extend({
    template: Handlebars.templates.index,
    el: document.body,
    events: {
      'click #love': 'spreadLove',
      'click #about': 'showAbout'
    },
    initialize: function() {
      this.render();
    },
    initializeChildren: function() {
      this.aboutForm = new App.Views.About();
      this.loveForm = new App.Views.Love();
    },
    render: function() {
      this.$el.html(this.template());
      _.defer(_.bind(this.initializeChildren, this));
    },
    showAbout: function() {
      this.aboutForm.render();
      return false;
    },
    spreadLove: function() {
      this.loveForm.render();
      return false;
    }
  });

  App.Router = Backbone.Router.extend({
    routes: {
      '': 'index'
    },
    index: function() {
      new App.Views.Index();
    }
  });

  new App.Router();
  Backbone.history.start();
});
