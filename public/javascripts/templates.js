!function(){var e=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a.about=e(function(e,a,n,t,s){return this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),s=s||{},'<section class="about">\n  <div class="container">\n\n    <div class="define">\n      <h4>Maven</h4>\n      <p>\n        ma·ven <em><i>noun</i> \\ˈmā-vən\\</em>\n      </p>\n      <p>one who is experienced or knowledgeable; an expert.</p>\n    </div>\n\n    <p>\n      Node Mavens is a place to show your appreciation for the experts of the\n      node community. This is not a contest, rather a way to show some\n      appreciation for people that have helped you by sharing their expertise.\n    </p>\n\n    <hr>\n\n    <p>\n      Check out the\n      <a href="https://github.com/fiveisprime/nodemavens">source</a>.\n    </p>\n    <p>\n      Built with all the love in the world by\n      <a href="https://twitter.com/fivveisprime">@fiveisprime</a> in\n      Cincinnati, OH.\n    </p>\n  </div>\n</section>\n'}),a.index=e(function(e,a,n,t,s){return this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),s=s||{},'<div id="love-form" style="display:none;"></div>\n<div id="about-modal" style="display:none;"></div>\n<section class="container cards"></section>\n'}),a.love=e(function(e,a,n,t,s){return this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),s=s||{},'<form class="cenetered">\n  <p>\n    Let\'s hear it! Who made your day today?\n  </p>\n  <p class="error" style="display:none;"></p>\n  <input type="text" name="username" value="" placeholder="GitHub Username">\n  <input type="submit" value="Send" class="btn accent">\n  <p class="centered"><a href="#" class="close accent">Nevermind</a></p>\n</form>\n'}),a.maven=e(function(e,a,n,t,s){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),s=s||{};var i,l,o="",r="function",h=this.escapeExpression;return o+='<img src="',(l=n.avatar_url)?i=l.call(a,{hash:{},data:s}):(l=a&&a.avatar_url,i=typeof l===r?l.call(a,{hash:{},data:s}):l),o+=h(i)+'" alt="',(l=n.username)?i=l.call(a,{hash:{},data:s}):(l=a&&a.username,i=typeof l===r?l.call(a,{hash:{},data:s}):l),o+=h(i)+'">\n<div class="content">\n  <p>',(l=n.name)?i=l.call(a,{hash:{},data:s}):(l=a&&a.name,i=typeof l===r?l.call(a,{hash:{},data:s}):l),o+=h(i)+" (",(l=n.username)?i=l.call(a,{hash:{},data:s}):(l=a&&a.username,i=typeof l===r?l.call(a,{hash:{},data:s}):l),o+=h(i)+")</p>\n  <p>",(l=n.company)?i=l.call(a,{hash:{},data:s}):(l=a&&a.company,i=typeof l===r?l.call(a,{hash:{},data:s}):l),o+=h(i)+"</p>\n  <p>",(l=n.location)?i=l.call(a,{hash:{},data:s}):(l=a&&a.location,i=typeof l===r?l.call(a,{hash:{},data:s}):l),o+=h(i)+'</p>\n  <div class="loves">\n    <a href="#" class="send-love">',(l=n.love)?i=l.call(a,{hash:{},data:s}):(l=a&&a.love,i=typeof l===r?l.call(a,{hash:{},data:s}):l),o+=h(i)+" ❤'s</a>\n  </div>\n</div>"})}();