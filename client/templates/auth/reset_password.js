Template.reset_password.rendered = function(){
  this.find("input").focus();
};

Template.reset_password.events({
  "submit form": function(e, tmpl){
    e.preventDefault();
    var password = $(tmpl.find("[name=newPassword]")).val();
    if(password.length < 6){
      Session.set("reset_error", {
        error: 406,
        reason: "Password is too short"
      });
    } else {
      Accounts.resetPassword(Accounts._resetPasswordToken, password, function(err){
        if(err){
          Session.set("reset_error", err);
        }else{
          TemplateHelpers.removeDialog({ tmpl:tmpl, fadeOut:false }, function(){
            Accounts._enableAutoLogin();
            Session.set("reset_error");
            $("body").append(Meteor.render(Template.reset_password_confirmation));
          });
        }
      });
    }
  },
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    TemplateHelpers.removeDialog({ tmpl:tmpl }, function(){
      Session.set("reset_error");
    });
  }
});

Template.reset_password.helpers({
  error: function(){
    var err = Session.get("reset_error");
    if(err){
      return Session.get("reset_error").reason;
    }
  }
});





Template.reset_password_confirmation.events({
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    TemplateHelpers.removeDialog({ tmpl:tmpl });
  }
});