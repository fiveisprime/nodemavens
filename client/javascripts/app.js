window.App = {};

!function($, Backbone, _, Handlebars, App) {
  'use strict';

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

}(window.jQuery, window.Backbone, window.underscore, window.Handlebars, window.App);
