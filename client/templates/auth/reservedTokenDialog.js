Template.reservedTokenDialog.events({
  "click #confirm": function(e,tmpl){
    TemplateHelpers.removeDialog(tmpl,function(){
      $("body").append(Meteor.render(Template.signin_dialog));
      Session.set("signin_error");
    });
  },
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    document.location.href = '/';
  }
});
