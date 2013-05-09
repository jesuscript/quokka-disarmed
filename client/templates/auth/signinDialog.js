Template.signin_dialog.rendered = function(){
  this.find("input").focus();
  TemplateHelpers.bindKeyboard(this);
};

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
        document.location.href = '/' + Meteor.user().token;
      }
    });
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
