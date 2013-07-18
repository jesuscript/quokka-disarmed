Template.logout_dialog.events({
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    window.location.reload();
  }
});