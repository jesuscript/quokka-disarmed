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
