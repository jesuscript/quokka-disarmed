Template.switchAccDialog.helpers({
  "anonymous": function(){
    return Meteor.user() && Meteor.user().anonymous
  }
});

Template.switchAccDialog.events({
  "click #confirm": function(e, tmpl){
    Auth.playAnonymously();
    TemplateHelpers.removeDialog(tmpl);
  },
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    if(Meteor.user()){
      document.location.href = '/' + Meteor.user().token;
    }
  }
});
