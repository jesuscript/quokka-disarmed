var events = {
    "click .js-cancel, click .shroud": function(e,tmpl){
        e.preventDefault();
        
        if(Meteor.user()){
            console.log(Meteor.user().token);
            document.location.href = '/' + Meteor.user().token;
        }
        
        TemplateHelpers.removeDialog(tmpl);
    },
    "click .js-confirm": function(e, tmpl){
        e.preventDefault();
        
        Auth.playAnonymously();

        TemplateHelpers.removeDialog(tmpl);
    }
};

Template.switchAnonymousAccDialog.events(events);

Template.switchProtectedAccDialog.events(events);

