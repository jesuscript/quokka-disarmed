Accounts.onCreateUser(function(options,user){
  _.extend(user,{
    balance: 100000000,//0,
    depositAddress: getNewBitcoinAddress()
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

  if(user.emails && user.emails.length && !validEmail(user.emails[0].address)){
    throw new Meteor.Error(417, "Invalid email address")
  }

  Meteor.users.remove({_id: user._id});

  return true;
});


function validEmail(email){
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


function getNewBitcoinAddress() {
  var Future = Npm.require("fibers/future");
  var fut = new Future();
  btcdClient.getNewAddress(function(err, data) {
    if (err) console.log(err);
    fut.ret(data);
  });
  var address = fut.wait()  
  if (address === undefined) {
    // if going live under load, this needs to be replaced with a call to findAndRemove()
    var addr = AddressPool.findOne();
    AddressPool.remove({'_id': addr._id})
    address = addr.address;
  }
  return address;
}

