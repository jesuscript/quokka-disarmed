Accounts.onCreateUser(function(options,user){
    user.balance = 10;
    return user;
});

Accounts.validateNewUser(function(user){
    //TODO: validate the user
    return true;
});


