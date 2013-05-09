Template.navbar.helpers({
  username: function(){
    return Meteor.user().username;
  },
  anonymous: function(){
    return Meteor.user().anonymous;
  },
  balance: function(){
    return intToBtc(Meteor.user().balance);
  }
});

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
    Meteor.logout(function(){
        Auth.playAnonymously();
    });
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


Template.withdraw_dialog.rendered = function(){
  $(".withdraw-dialog input").first().focus();
}





