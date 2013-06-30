Template.navbar.events({
  "click .withdraw-btn": function(e){
    e.preventDefault();
    $("body").append(Meteor.render( Template.withdraw_dialog ));
    Session.set("withdraw_error");
  },
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
    Meteor.logout();
  },
  "click .news-btn": function(e){
    e.preventDefault();
    $("body").append(Meteor.render( Template.news_dialog ));
  },
  "click .howto-btn": function(e){
    e.preventDefault();
    $("body").append(Meteor.render( Template.howto_dialog ));
  }
});


Template.navbar.helpers({
  hasBalance: function(){
    return Meteor.user().balance;
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

