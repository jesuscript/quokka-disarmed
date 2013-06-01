Template.signup_dialog.rendered = function(){
  $(".auth-dialog input").first().focus();
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
  "click #confirm": function(e, tmpl){ //TODO keypress Enter submits
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
        email: $("#signup-dialog [name=email]").val()
      },function(err){
        if(err){
          Session.set("signup_error", err);
        }else{
          Session.set("signup_error");
          TemplateHelpers.removeDialog(tmpl);
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
