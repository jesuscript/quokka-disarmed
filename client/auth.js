Auth = {
    playAnonymously: function(){
        var self = this;
        var token = this.getToken();

        Meteor.loginWithPassword(token, token, function(err){
            if(err){
                if(err.error == 403){
                    Accounts.createUser({
                        username: token,
                        password: token,
                        anonymous: true,
                        token: token
                    },function(err){
                        if(err){
                            if(err.error == 401){
                                $("body").append(Meteor.render( Template.reservedTokenDialog ))
                            }else{
                                console.log("unhandled signup error ", err);
                            }
                        }
                    });
                }else{
                    console.log("unhandled signin error: ", err);
                }
            }
            
        });
    },

    getToken: function(){
        var re = /[^/]*$/;
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

        //TODO: good for now, but should find a better way of handling that motherfuck
        Session.set("auth_lock", true); 
        
        var user = Meteor.user();

        if(user){
            if(user.token == Auth.getToken()) return;

            if(user.anonymous){
                $("body").append(Meteor.render( Template.switchAccDialog ));
            }else{
                $("body").append(Meteor.render( Template.switchAccDialog ))
            }
        }else{
            Auth.playAnonymously();
        }
    });
});

