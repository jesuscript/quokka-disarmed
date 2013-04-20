Auth = {};

_.extend(Auth,{
    signupAnonymously: function(){
        var token = this.getToken();
        
        Accounts.createUser({
            username: token,
            password: token,
            anonymous: true
        });
    },
    signinAnonymously: function(){
        var token = this.getToken();

        Meteor.loginWithPassword(token, token,function(err){
            console.log(err);
        });
    },
    getToken: function(){
        var url = document.URL;
        return url.slice(url.length - 64, url.length);
    }
});

Meteor.startup(function(){
    //Deps.autorun(function(){
        if(!Meteor.loggingIn()){
            Auth.signinAnonymously();
        }
        console.log("huy");
    //});
});
