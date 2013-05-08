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
  "click .withdraw-btn": function(){
    $("body").append(Meteor.render( Template.withdraw_dialog ));
    Session.set("withdraw_error");
  },
  "click .signup-btn": function(){
    $("body").append(Meteor.render( Template.signup_dialog ));
    Session.set("signup_error");
  },
  "click .signin-btn": function(){
    $("body").append(Meteor.render(Template.signin_dialog));
    Session.set("signin_error");
  },
  "click .signout-btn": function(){
    Meteor.logout(function(){
        Auth.playAnonymously();
    });
  }
});


Template.navbar.rendered = function(){ 
  (function(){var uv=document.createElement('script');uv.type='text/javascript';uv.async=true;uv.src='//widget.uservoice.com/9ZCCMSCPqP7NR9ZWuQzteQ.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(uv,s)})()
}

Template.signin_dialog.rendered = function(){ 
  $(".auth-dialog input").first().focus();
    
};

Template.signup_dialog.rendered = function(){
  $(".auth-dialog input").first().focus();
}

Template.withdraw_dialog.rendered = function(){
  $(".withdraw-dialog input").first().focus();
}


Template.signup_dialog.helpers({
  error: function(){
    var err = Session.get("signup_error");
    if(err){
      if(err.error == 400) return "Empty username";
      return err.reason;
    }
  }
});

Template.signup_dialog.events({
  "click .cancel, click .shroud": function(e, tmpl){
    TemplateHelpers.removeDialog(tmpl,function(){
      Session.set("signup_error");
    });
  },
  "click .submit-btn": function(e, tmpl){ //TODO keypress Enter submits
    var password = $("#signup-dialog [name=password]").val();

    if(password.length < 6){
      Session.set("signup_error", {
        error: 406,
        reason: "Password is too short"
      });
    }else{
      Accounts.createUser({
        username: $("#signup-dialog [name=username]").val(),
        password: password,
        email: $("#signup-dialog [name=email]").val(),
        token: Auth.getToken()
      },function(err){
        if(err){
          Session.set("signup_error", err);
        }else{
          Session.set("signup_error");
          TemplateHelpers.removeDialog(tmpl);
        }
      });
    }
  }
});

Template.signin_dialog.helpers({
  error: function(){
    var err = Session.get("signin_error");
    if(err){
      if(err.error ==400) return "Empty username or email"; // TODO: what's this for?
      return Session.get("signin_error").reason;
    }
  }
});

Template.signin_dialog.events({
  "click .cancel, click .shroud": function(e, tmpl){
    TemplateHelpers.removeDialog(tmpl, function(){
      Session.set("signin_error");
    });
  },
  "click .submit-btn": function(e, tmpl){
    var user = $("#signin-dialog [name=user]").val();
    var password = $("#signin-dialog [name=password]").val();
    Meteor.loginWithPassword(user, password,function(err){
      if(err){
        Session.set("signin_error", err);
      }else{
        Session.set("signin_error");
        TemplateHelpers.removeDialog(tmpl);
      }
    });
  }
});



