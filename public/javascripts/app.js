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
  App.data = {};
  App.Views = {};
  App.Models = {};
  App.Collections = {};

  App.Models.Maven = Backbone.Model.extend({
    url: '/api/mavens',
    defaults: {
      username: '',
      name: '',
      company: '',
      location: '',
      avatar_url: 'http://www.gravatar.com/avatar/?d=identicon',
      rep: 0
    }
  });

  App.Collections.Mavens = Backbone.Collection.extend({
    model: App.Models.Maven,
    url: '/api/mavens'
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
      var user = this.$el.find('[name=username]').val();

      if (!user) {
        this.error('Hey, you have to enter a username!');
        return false;
      }

      $.post('/api/mavens', { username: user }, _.bind(function(res) {
        if (res.error) {
          this.error(res.error);
        } else {
          this.reset();
          this.$el.fadeOut(200, _.bind(function() {
            this.$el.html('');
          }, this));
        }
      }, this));

      return false;
    },
    reset: function() {
      App.data.indexView.mavenList.collection.fetch({ reset: true });
    },
    error: function(msg) {
      this.$el.find('.error').hide().empty().text(msg).fadeIn(100);
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

  App.Views.Maven = Backbone.View.extend({
    tagName: 'div',
    template: Handlebars.templates.maven,
    events: {
      'click .send-love': 'love'
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.attr('class', 'card grid_6');
      return this;
    },
    love: function() {
      var url = '/api/mavens/' + this.model.get('username') + '/love';

      $.post(url, _.bind(function() {
        App.data.indexView.mavenList.collection.fetch({ reset: true });
      }, this));

      return false;
    }
  });

  App.Views.Mavens = Backbone.View.extend({
    el: '.cards',
    initialize: function() {
      this.collection.bind('change reset add remove', this.render, this);
      this.collection.fetch();
    },
    render: function() {
      this.$el.html('');
      this.collection.each(function(maven) {
        var mavenView = new App.Views.Maven({ model: maven });
        this.$el.append(mavenView.render().el);
      }, this);
    }
  });

  App.Views.Index = Backbone.View.extend({
    template: Handlebars.templates.index,
    el: 'section#main',
    events: {
      'click #love': 'spreadLove',
      'click #about': 'showAbout'
    },
    initialize: function() {
      this.render();
    },
    initializeChildren: function() {
      this.aboutForm = new App.Views.About();
      this.loveForm  = new App.Views.Love();
      this.mavenList = new App.Views.Mavens({
        collection: new App.Collections.Mavens()
      });
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
      App.data.indexView = new App.Views.Index();
    }
  });

  new App.Router();
  Backbone.history.start();
});
