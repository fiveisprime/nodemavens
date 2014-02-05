/* global Handlebars */

define([
  'jquery',
  'backbone',
  'underscore',
  'lib/collections',
  'templates'
],
function($, Backbone, _, Collections) {

  'use strict';

  //
  // Global collections.
  //
  var mavenCollection = new Collections.Mavens();
  var recentCollection = new Collections.RecentMavens();

  //
  // Error dialog view.
  //
  var Error = Backbone.View.extend({
    template: Handlebars.templates.error,
    el: '#error-modal',
    events: {
      'click .ack': 'close'
    },
    show: function(message) {
      this.$el.html(this.template({ message: message }));
      this.$el.center().fadeIn(100);
    },
    close: function() {
      this.$el.fadeOut(200);
      return false;
    }
  });

  //
  // The love dialog for adding new mavens.
  //
  var Love = Backbone.View.extend({
    template: Handlebars.templates.love,
    el: '#love-form',
    events: {
      'click [type=submit]': 'submit',
      'click .close': 'hide'
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
          this.hide();
        }
      }, this));

      return false;
    },
    hide: function() {
      this.$el.fadeOut(200, _.bind(function() {
        this.$el.html('');
      }, this));

      return false;
    },
    reset: function() {
      mavenCollection.fetch({ reset: true });
      recentCollection.fetch({ reset: true });
    },
    error: function(msg) {
      this.$el.find('.error').hide().empty().text(msg).fadeIn(100);
    }
  });

  //
  // The about dialog view.
  //
  var About = Backbone.View.extend({
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

  //
  // Maven view for rendering cards and adding hearts. There will be one of
  //    these for each maven rendered (including recent and top).
  //
  var Maven = Backbone.View.extend({
    tagName: 'div',
    template: Handlebars.templates.card,
    events: {
      'click .send-love': 'love'
    },
    initialize: function() {
      this.errorView = new Error();
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.attr('class', 'card grid_6');
      return this;
    },
    love: function() {
      var url = '/api/mavens/' + this.model.get('username') + '/love';

      $.post(url, _.bind(function(res) {
        if (res.error) {
          this.errorView.show(res.error);
        } else {
          mavenCollection.fetch({ reset: true });
        }
      }, this));

      return false;
    }
  });

  //
  // The root mavens view. The parent view that fetches and renders all maven
  //    child views.
  //
  var Mavens = Backbone.View.extend({
    el: '.cards',
    initialize: function() {
      this.$recents = this.$el.find('.recent');
      this.$top = this.$el.find('.top');

      mavenCollection.bind('change reset add', this.render, this);
      recentCollection.bind('change reset add', this.render, this);

      mavenCollection.fetch();
      recentCollection.fetch();
    },
    render: function() {
      this.$recents.html('');
      this.$top.html('');

      recentCollection.each(function(maven) {
        var mavenView = new Maven({
          model: maven
        });
        this.$recents.append(mavenView.render().el);
      }, this);
      mavenCollection.each(function(maven) {
        var mavenView = new Maven({
          model: maven
        });
        this.$top.append(mavenView.render().el);
      }, this);
    }
  });

  //
  // Index view which handles the about and love dialogs.
  //
  var Index = Backbone.View.extend({
    template: Handlebars.templates.index,
    el: 'section#main',
    initialize: function() {
      $('#love').on('click', _.bind(this.spreadLove, this));
      $('#about').on('click', _.bind(this.showAbout, this));

      this.render();
    },
    initializeChildren: function() {
      this.aboutForm = new About();
      this.loveForm  = new Love();
      this.mavenList = new Mavens();
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

  //
  // Expose the primary (index) view.
  //
  return {
    Index: Index
  };

});
