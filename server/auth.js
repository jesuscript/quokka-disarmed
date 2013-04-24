Accounts.onCreateUser(function(options,user){
    if(options.anonymous){
        _.extend(user,{
            balance: 0,
            token: options.token
        });
    }else if(Meteor.user()){
        user = _.extend(Meteor.user(), {
            username: user.username,
            services: user.services,
            emails: user.emails
        });
    }

    user.anonymous = !!options.anonymous;

    return user;
});

Accounts.validateNewUser(function(user){
    if(Meteor.users.find({username: user.username}).count()){
        throw new Meteor.Error(409, "Username is in use");
    }

    if(user.username === undefined || user.username.length < 1){
        throw new Meteor.Error(400, "Empty username");
    }

    if(user.emails && user.emails.length && !validEmail(user.emails[0].address)){
        throw new Meteor.Error(417, "Inavalid email address")
    }

    if(Meteor.users.findOne({token: user.token, anonymous: false})){
        throw new Meteor.Error(401, "Reserved URL");
    }

    Meteor.users.remove({_id: user._id});

    return true;
});

function validEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
}
