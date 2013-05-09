Template.reservedTokenDialog.events({
  "click .js-sign-in": function(e,tmpl){
    e.preventDefault();
    TemplateHelpers.removeDialog(tmpl,function(){
      $("body").append(Meteor.render(Template.signin_dialog));
      Session.set("signin_error");
    });
  },
  "click .js-cancel, click .shroud": function(){
    document.location.href = '/';
  }
});
