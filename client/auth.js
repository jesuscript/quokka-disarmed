Auth = {
    playAnonymously: function(){
        var self = this;
        var token = this.getToken();

        Meteor.loginWithPassword(token, token, function(err){
            if(err && err.error == 403){
                Accounts.createUser({
                    username: token,
                    password: token,
                    anonymous: true,
                    token: token
                },function(err){
                    if(err && err.error == 401){
                        console.log("signup error: ", err);
                    }
                });
            }
            console.log("signin err: ", err);
        });
    },
    getToken: function(){
        var re = re = /[^/]*$/;
        var url = document.URL;
        return url.match(re)[0].substr(0,64);
    },
    showPlayAnonymouslyDialog: function(){
        console.log("TODO: showPlayAnonymouslyDialog");
    },
    showReservedUrlDialog: function(){
        console.log("TODO: showReservedUrlDialog ");
    }
};

Meteor.startup(function(){
    Deps.autorun(function(){
        if(Session.get("auth_lock") || Meteor.loggingIn()) return;

        Session.set("auth_lock", true);
        
        var user = Meteor.user();

        if(user){
            if(user.token == Auth.getToken()) return;

            if(user.anonymous){
                $("body").append(Meteor.render( Template.switchAnonymousAccDialog ));
            }else{
                $("body").append(Meteor.render( Template.switchProtectedAccDialog ))
            }
        }else{
            Auth.playAnonymously();
        }
    });
});

