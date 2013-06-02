Template.signup_dialog.rendered = function(){
  this.find("input").focus();
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
  "submit form": function(e, tmpl){
    event.preventDefault();
    var username = $("#signup-dialog [name=username]").val();
    var password = $("#signup-dialog [name=password]").val();
    var email = $("#signup-dialog [name=email]").val();
    if(username.length < 3){
      Session.set("signup_error", {
        error: 406,
        reason: "Username is too short"
      });
    }else if(password.length < 6){
      Session.set("signup_error", {
        error: 406,
        reason: "Password is too short"
      });
    }else if(!validEmail(email)){
      Session.set("signup_error", {
        error: 417,
        reason: "Email is invalid"
      });
    }else{
      Accounts.createUser({
        username: $("#signup-dialog [name=username]").val(),
        password: password,
        email: $("#signup-dialog [name=email]").val()
      },function(err){
        if(err){
          Session.set("signup_error", err);
        }else{
          TemplateHelpers.removeDialog(tmpl, function(){
            Session.set("signup_error");
          });
        }
      });
    }
  },
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    TemplateHelpers.removeDialog(tmpl,function(){
      Session.set("signup_error");
    });
  }
});
