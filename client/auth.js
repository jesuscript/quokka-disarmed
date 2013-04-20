Auth = {};

_.extend(Auth,{
    createUser: function(options,callback){
        
    },
    signupAnonymously: function(){
        var token = this.getToken();
        
        Accounts.createUser({
            username: token,
            password: token,
            anonymous: true,
            token: token
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
    Deps.autorun(function(){
        var user =Meteor.user()
            
        if(!Meteor.loggingIn() && (!user || user.token != Auth.getToken())){
            //Auth.signinAnonymously();
        }
    });
});
