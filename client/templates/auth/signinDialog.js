Template.signin_dialog.rendered = function(){
  this.find("input").focus();
  //KK: should use TemplateHelpers.bindKeyboard, but it's currently broken'
};

Template.signin_dialog.events({
  "submit form": function(e, tmpl){ //TODO keypress Enter submits
    event.preventDefault();
    var user = $(tmpl.find("[name=user]")).val();
    var password = $(tmpl.find("[name=password]")).val();
    Meteor.loginWithPassword(user, password,function(err){
      if(err){
        Session.set("signin_error", err);
      }else{
        Session.set("signin_error");
        document.location.href = '/' + Meteor.user().token;
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
      if(err.error == 400) return "Empty username or email";
      return Session.get("signin_error").reason;
    }
  }
});
