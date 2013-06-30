// TODO: see git issue #16
Meteor.methods({
  areDepositsConfirmed: function() {
    console.log(Date.now() + 'call to areDepositConfirmed');
    // this block bothers me - i use it to instantiate these vars across all withdraw methods
    // however it's likely not ideal because it requires the code to flow in a certain way for things to be defined
    received = [];
    var depositAddress = Meteor.user().depositAddress
    for (var i=0; i<=6; i++) {
      received[i] = getReceivedByAddress(depositAddress, i);
      if(isNaN(received[i])) { throw new Meteor.Error(503, "Could not connect to bitcoind"); }
    };
    ret = ((received[2] - received[0]) >= 0) ? true : false; //ALERT 6
    return ret;
  },
  getOutstandingDeposits: function() {
    return received[0] - received[6];
  },
  getTimeToValidateDeposits: function() {
    var lastConfirmation = _.lastIndexOf(received, _.max(received));
    return (6 - lastConfirmation) * 10;
  },
  requestWithdrawal: function(address, intAmount) {
    validateWithdrawal(address, intAmount);
    if (1 < intAmount) { // added 100,000 satoshis (10x min fee) to cover very high trx fee (which could happen if loads of dust present in the wallet)
      alertExcessWithdrawal(address, intAmount);
      Meteor.users.update({_id: Meteor.userId()}, {$inc:{"balance": -intAmount}});
      return false;
    } else {
      var txId = sendToAddress(address, intAmount);
      if (txId.length == 64 && txId.search(/[a-fA-F0-9]{64}$/) == 0) {
        Meteor.users.update({_id: Meteor.userId()}, {$inc:{"balance": -intAmount}});
        return {
          amt: intToBtc(intAmount), // only will ever be used for display purposes
          txId: txId,
          addr: address
        };
      } else {
        throw new Meteor.Error(500, "Transaction aborted, try again later");
      }
    }
  }
});

function alertExcessWithdrawal(address, intAmount){
  Email.send({
    to: 'johandaugh@icloud.com',
    from: 'noreply@bittheodds.com',
    subject: 'Withdrawal request - ' + humanTimestamp(),
    text: 'amount (int): ' + (intAmount - process.env.TRX_FEE) + '\n' +
      'amount (flt): ' + intToBtc(intAmount - process.env.TRX_FEE) + '\n' +
      'address: ' + address + '\n\n' +
      'username: ' + Meteor.user().username + '\n' +
      'created at: ' + Meteor.user().createdAt + '\n' +
      'deposit address: ' + Meteor.user().depositAddress
  });
}

function isInt(n) {
  return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
}

function validateWithdrawal(address, intAmount){
  if (!validateAddress(address)) throw new Meteor.Error(406, "Address is invalid");
  if (intAmount > Meteor.user().balance) {
    throw new Meteor.Error(406, "You cannot withdraw more than your balance");
  }
  if (!isInt(intAmount)) {
    throw new Meteor.Error(406, "Amount is invalid");
  }
  if (intAmount < 100000) {
    throw new Meteor.Error(406, "Minimum withdrawal amount is ฿0.001");
  }
}

function getReceivedByAddress(address, numconf) {
  var Future = Npm.require("fibers/future");
  var fut = new Future();
  btcdClient.getReceivedByAddress(address, numconf, function(err, data) {
    if (err) console.log(err);
    fut.ret(btcToInt(data));
  });
  return fut.wait();
}

function validateAddress(address) {
  var Future = Npm.require("fibers/future");
  var fut = new Future();
  btcdClient.validateAddress(address, function(err, data) {
    if (err) console.log(err);
    fut.ret(data.isvalid);
  });
  return fut.wait();
}

function getWalletBalance() {
  var Future = Npm.require("fibers/future");
  var fut = new Future();
  btcdClient.getBalance('', 6, function(err, data) {
    if (err) console.log(err);
    fut.ret(btcToInt(data));
  });
  return fut.wait();
}

function sendToAddress(address, intAmount) {
  var Future = Npm.require("fibers/future");
  var fut = new Future();
  btcdClient.sendToAddress(address, intToBtc(intAmount - process.env.TRX_FEE), function(err, trxId) { // new trx fee since 0.8.2 == 10000 satoshis
    if (err) console.log(err);
    fut.ret(trxId);
  });
  return fut.wait();
}


