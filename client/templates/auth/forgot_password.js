Template.forgot_password.rendered = function(){
  this.find("input").focus();
  //should use TemplateHelpers.bindKeyboard, but it's currently broken'
};

Template.forgot_password.events({
  "click #confirm": function(e, tmpl){ //TODO keypress Enter submits
    var email = $(tmpl.find("[name=email]")).val();
    Accounts.forgotPassword({email: email}, function(err){
      if(err){
        console.dir(err);
        Session.set("forgot_error", err);
      }else{
        TemplateHelpers.removeDialog(tmpl, function(){
          Session.set("forgot_error");
          $("body").append(Meteor.render(Template.forgot_password_confirmation));
        });
      }
    });
  },
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    TemplateHelpers.removeDialog(tmpl, function(){
      Session.set("forgot_error");
    });
  }
});

Template.forgot_password.helpers({
  error: function(){
    var err = Session.get("forgot_error");
    if(err){
      return Session.get("forgot_error").reason;
    }
  }
});





Template.forgot_password_confirmation.events({
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    TemplateHelpers.removeDialog(tmpl);
  }
});