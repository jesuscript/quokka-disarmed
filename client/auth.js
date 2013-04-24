Auth = {
    signupError: null,
    signinError: null,
    signupAnonymously: function(){
        var self = this;
        var token = this.getToken();
        
        Accounts.createUser({
            username: token,
            password: token,
            anonymous: true,
            token: token
        },function(err){
            self.signupError = err;
        });
    },
    signinAnonymously: function(){
        var self = this;
        var token = this.getToken();

        Meteor.loginWithPassword(token, token,function(err){
            self.error = err;
        });
    },
    getToken: function(){
        var url = document.URL;
        return url.slice(url.length - 64, url.length);
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
        if(Meteor.loggingIn()) return;
        
        var user = Meteor.user();

        if(user){
            if(user.token == Auth.getToken()) return;

            if(user.anonymous){
                console.log("TODO: dialog You are about to switch to a different account Yes/No");
            }else{
                console.log("TODO: dialog Please sign out if you want to play anonymously");
            }

        }else{
            if(Auth.signupError){
                if(Auth.signupError.error == 401){
                    console.log("TODO dialog [sign in][play anonymously]");
                }else{
                    console.log("unhandled signup error", Auth.sinupError);
                }
            }else if (Auth.sininError){
                if(Auth.signinError.error == 403){
                    Auth.signupAnonymously();
                }else{
                    console.log("unhandled signin error", Auth.sinupError);
                }
            }else{
                Auth.signinAnonymously();
            }
        }
    });
});

