define(['backbone'], function(Backbone) {

  'use strict';

  var Maven = Backbone.Model.extend({
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

  return {
    Maven: Maven
  };

});
