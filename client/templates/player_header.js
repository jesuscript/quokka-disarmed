Template.playerHeader.events({
  "click .signup-btn": function(e){
    e.preventDefault();
    Auth.showSignupDialog();
  },
  "click .signin-btn": function(e){
    e.preventDefault();
    Auth.showSigninDialog();
  }
});


Template.playerHeader.helpers({
  username: function(){
    return Meteor.user().username;
  },
  balance: function(){
    return intToBtc(Meteor.user().balance);
  }
});

