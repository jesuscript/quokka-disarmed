(function(){
    Template.navbar.helpers({
        username: function(){
            return Meteor.user().username;
        },
        balance: function(){
            return Meteor.user().balance;
        }
    });

    Template.navbar.events({
        "click .signup-btn": function(){
            $("body").append(Meteor.render( Template.signup_dialog ));
        },
        "click .signin-btn": function(){
        }
    });


    Template.signup_dialog.rendered = function(){
        $("#signup-dialog input").first().focus();
    };

    Template.signup_dialog.events({
        "click .cancel, click .shroud": function(e, tmpl){
            removeDialog(tmpl);
        },
        "click .submit-btn": function(e, tmpl){ //TODO keypress Enter submits
            Accounts.createUser({
                username: $("#signup-dialog [name=username]").val(),
                password: $("#signup-dialog [name=password]").val(),
                email: $("#signup-dialog [name=email]").val() //,
                //secret: "captcure the url"
            });
            
            removeDialog(tmpl);
        }
    });

    function removeDialog(tmpl){
        var node = tmpl.firstNode;

        $(node).addClass("fade-out");
        
        setTimeout(function(){
            Spark.finalize(node);
            $(node).remove();
        }, 500);
    }
})();
