Accounts.onCreateUser(function(options,user){
    _.extend(user,{
        anonymous: options.anonymous,
        balance: 10
    });


    return user;
});

Accounts.validateNewUser(function(user){
    if(Meteor.users.find({username: user.username}).count()){
        throw new Meteor.Error(409, "Username is in use");
    }

    if(user.username === undefined || user.username.length < 1){
        throw new Meteor.Error(400, "Empty username");
    }
    /*
    if(user.email && Meteor.users.find({emails: {$elemMatch: {address: user.email}}}).count()){
        throw new Meteor.Error(412, "Email already exists");
    }

    if(!validEmail(user.emails[0].address)){
        throw new Meteor.Error(417, "Inavalid email address")
    }
      */
    
    return true;
});

function validEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
}

