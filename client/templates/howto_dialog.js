Template.howto_dialog.events({
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    TemplateHelpers.removeDialog(tmpl);
  }  
});
