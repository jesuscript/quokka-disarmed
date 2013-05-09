Template.switchAccDialog.helpers({
  "anonymous": function(){
    return Meteor.user() && Meteor.user().anonymous
  }
});

Template.switchAccDialog.events({
  "click .js-cancel, click .shroud": function(e,tmpl){
    e.preventDefault();
    
    if(Meteor.user()){
      document.location.href = '/' + Meteor.user().token;
    }
    
    TemplateHelpers.removeDialog(tmpl);
  },
  "click .js-confirm": function(e, tmpl){
    e.preventDefault();
    
    Auth.playAnonymously();

    TemplateHelpers.removeDialog(tmpl);
  }
});
