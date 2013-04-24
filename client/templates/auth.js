Template.switchAccDialog.helpers({
    "anonymous": function(){
        return Meteor.user() && Meteor.user().anonymous
    }
});

Template.switchAccDialog.events({
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
});

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
