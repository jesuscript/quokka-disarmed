/*global Accounts, Meteor, Npm, btcdClient, AddressPool, Log, validEmail, _ */

Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false}); 

Accounts.onCreateUser(function(options,user){
  _.extend(user,{
    balance: 0, // 0
    depositAddress: getNewBitcoinAddress()
  });
  return user;
});


Accounts.validateNewUser(function(user){
  if(Meteor.users.find({username: user.username}).count()){
    throw new Meteor.Error(409, 'Username is in use');
  }

  if(user.username === undefined || user.username.length < 1){
    throw new Meteor.Error(400, 'Empty username');
  }

  if(user.username.length > 12){
    throw new Meteor.Error(406, 'Username too long');
  }

  if(!validEmail(user.emails[0].address)){
    throw new Meteor.Error(417, 'Invalid email address');
  }

  Meteor.users.remove({_id: user._id});

  return true;
});



function getNewBitcoinAddress() {
  var Future = Npm.require('fibers/future');
  var fut = new Future();
  btcdClient.getNewAddress(function(err, data) {
    if (err) Log.error(err);
    fut.return(data);
  });
  var address = fut.wait();
  if (address === undefined) {
    // if going live under load, this needs to be replaced with a call to findAndRemove()
    var addr = AddressPool.findOne();
    AddressPool.remove({'_id': addr._id});
    address = addr.address;
  }
  return address;
}


Meteor.methods({
  resendVerificationEmail: function(){
    if(Meteor.userId()) {
      Accounts.sendVerificationEmail(Meteor.userId());
    }
  }
});

