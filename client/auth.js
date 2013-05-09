var tokenRegex = /[^/]*$/; // moved up here to prevent this shit from fucking up my indentation

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
                self.showReservedTokenDialog();
                
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
    var url = document.URL;
    return url.match(tokenRegex)[0].substr(0,64);
  },

  showSignupDialog: function(){
    $("body").append(Meteor.render( Template.signup_dialog ));
    Session.set("signup_error");
  },

  showSigninDialog: function(){
    $("body").append(Meteor.render(Template.signin_dialog));
    Session.set("signin_error");
  },

  showSwitchAccDialog: function(){
    $("body").append(Meteor.render( Template.switchAccDialog ));
  },

  showReservedTokenDialog: function(){
    $("body").append(Meteor.render( Template.reservedTokenDialog ));
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

      Auth.showSwitchAccDialog();
    }else{
      Auth.playAnonymously();
    }
  });
});

