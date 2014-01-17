define([
  'jquery',
  'backbone',
  'underscore',
  'lib/collections',
  'templates'
],
function($, Backbone, _, Collections) {

  'use strict';

  var Love = Backbone.View.extend({
    template: Handlebars.templates.love,
    el: '#love-form',
    events: {
      'click [type=submit]': 'submit',
      'click .close': 'hide'
    },
    initialize: function(options) {
      this.mavenCollection = options.mavenCollection;
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
      this.mavenCollection.fetch({ reset: true });
    },
    error: function(msg) {
      this.$el.find('.error').hide().empty().text(msg).fadeIn(100);
    }
  });

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

  var Maven = Backbone.View.extend({
    tagName: 'div',
    template: Handlebars.templates.maven,
    events: {
      'click .send-love': 'love'
    },
    initialize: function(options) {
      this.mavenCollection = options.mavenCollection;
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.attr('class', 'card grid_6');
      return this;
    },
    love: function() {
      var url = '/api/mavens/' + this.model.get('username') + '/love';

      $.post(url, _.bind(function() {
        this.mavenCollection.fetch({ reset: true });
      }, this));

      return false;
    }
  });

  var Mavens = Backbone.View.extend({
    el: '.cards',
    initialize: function(options) {
      this.collection.bind('change reset add remove', this.render, this);
      this.collection.fetch();
    },
    render: function() {
      this.$el.html('');
      this.collection.each(function(maven) {
        var mavenView = new Maven({
          model: maven,
          mavenCollection: this.collection
        });
        this.$el.append(mavenView.render().el);
      }, this);
    }
  });

  var Index = Backbone.View.extend({
    template: Handlebars.templates.index,
    el: 'section#main',
    initialize: function() {
      $('#love').on('click', _.bind(this.spreadLove, this));
      $('#about').on('click', _.bind(this.showAbout, this));

      this.render();
    },
    initializeChildren: function() {
      var mavenCollection = new Collections.Mavens();

      this.aboutForm = new About();
      this.loveForm  = new Love({
        mavenCollection: mavenCollection
      });
      this.mavenList = new Mavens({
        collection: mavenCollection
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

  return {
    Index: Index
  }

});