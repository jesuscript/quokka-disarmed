Auth = {

  showSignupDialog: function(){
    $("body").append(Meteor.render( Template.signup_dialog ));
    Session.set("signup_error");
  },

  showSigninDialog: function(){
    $("body").append(Meteor.render(Template.signin_dialog));
    Session.set("signin_error");
  },

};


Meteor.startup(function () {

  var match;
  match = window.location.hash.match(/^\#\/reset-password\/(.*)$/);
  if (match) {
    Accounts._preventAutoLogin = true;
    Accounts._resetPasswordToken = match[1];
    window.location.hash = '';
  }

  if (Accounts._resetPasswordToken) {
    $("body").append(Meteor.render(Template.reset_password));
    Session.set("reset_error");
  }

  match = window.location.hash.match(/^\#\/verify-email\/(.*)$/);
  if (match) {
    Accounts._preventAutoLogin = true;
    Accounts._verifyEmailToken = match[1];
    window.location.hash = '';
  }

  if (Accounts._verifyEmailToken) {
    Accounts.verifyEmail(Accounts._verifyEmailToken, function(error) {
      $("body").append(Meteor.render(Template.verified_email));
      Accounts._enableAutoLogin();
    });
  }

});