Template.navbar.events({
  "click .signup-btn": function(e){
    e.preventDefault();
    Auth.showSignupDialog();
  },
  "click .signin-btn": function(e){
    e.preventDefault();
    Auth.showSigninDialog();
  },
  "click .signout-btn": function(e){
    e.preventDefault();
    Auth.logout();
  },
  "click .news-btn": function(e){
    e.preventDefault();
    $("body").append(Meteor.render( Template.news_dialog ));
  },
  "click .howto-btn": function(e){
    e.preventDefault();
    $("body").append(Meteor.render( Template.howto_dialog ));
  },
  "click .volume-switch": function(e){
    e.preventDefault();
    
  }  
});


Template.navbar.rendered = function(){
  var uv=document.createElement('script');
  uv.type='text/javascript';
  uv.async=true;
  uv.src='//widget.uservoice.com/9ZCCMSCPqP7NR9ZWuQzteQ.js';
  var s=document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(uv,s);
}

// TODO
// Template.navbar.created = function (){
//   Audio.play('startup');
// }

// TODO
// Template.navbar.helpers({
//   volumeClass: function(){
//     if (Meteor.user()) return Meteor.user().profile.soundOn
//     return Meteor.user() && Collections.Bets.findOne({playerId: Meteor.user()._id});
//   }
// });