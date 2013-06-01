Template.signin_dialog.rendered = function(){
  this.find("input").focus();
};

Template.signin_dialog.events({
  "submit form": function(e, tmpl){
    event.preventDefault();
    var user = $(tmpl.find("[name=user]")).val();
    var password = $(tmpl.find("[name=password]")).val();
    Meteor.loginWithPassword(user, password,function(err){
      if(err){
        Session.set("signin_error", err);
      }else{
        TemplateHelpers.removeDialog(tmpl, function(){
          Session.set("signin_error");
        });
      }
    });
  },
  "click #forgot": function(e,tmpl){
    TemplateHelpers.removeDialog(tmpl, function(){
      Session.set("signin_error");
      $("body").append(Meteor.render(Template.forgot_password));
    });
  },
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    TemplateHelpers.removeDialog(tmpl, function(){
      Session.set("signin_error");
    });
  }
});

Template.signin_dialog.helpers({
  error: function(){
    var err = Session.get("signin_error");
    if(err){
      if(err.error == 400) return "Empty username or email"; // overrides default ugly meteor message
      return Session.get("signin_error").reason;
    }
  }
});
