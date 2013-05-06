// TODO: see git issue #16
Meteor.methods({
	areDepositsConfirmed: function() {
		// this block bothers me - i use it to instantiate these vars across all withdraw methods
		// however it's likely not ideal because it requires the code to flow in a certain way for things to be defined
		received = [];
		var depositAddress = Meteor.user().depositAddress
		for (var i=0; i<=6; i++) {
			received[i] = getReceivedByAddress(depositAddress, i);
		};
		ret = ((received[6] - received[0]) >= 0) ? true : false;
		return ret;
	},
	getOutstandingDeposits: function() {
		return received[0] - received[6];
	},
	getTimeToValidateDeposits: function() {
		var lastConfirmation = _.lastIndexOf(received, _.max(received));
		return (6 - lastConfirmation) * 10;
	},
	requestWithdrawal: function(address, amount) {
		if (!validateAddress(address)) {
			throw new Meteor.Error(406, "Address is invalid");
		}
		if (amount > Meteor.user().balance) {
			throw new Meteor.Error(406, "You cannot withdraw more than your balance");
		}
		var regexp = /^\d+(\.\d{1,3})?$/;
		if (!regexp.test(amount)) {
			throw new Meteor.Error(406, "Amount is invalid");
		}
		if (true) {
		//if (getWalletBalance() < amount) {
      Email.send({
        to: 'johandaugh@icloud.com',
        from: 'noreply@bittheodds.com',
        subject: 'Withdrawal request - ' + Date.now(),
        text: 'amount: ' + (amount - 0.0005) + '\n' + 'address: ' + address + '\n' + 'token: ' + Meteor.user().token
      });
			Meteor.users.update({_id: Meteor.userId()}, {$inc:{"balance": -btcToInt(amount)}})
			return false;
		} else {
			var txId = sendToAddress(address, amount);
			if (txId.length == 64 && txId.search(/[a-fA-F0-9]{64}$/) == 0) {
		  	Meteor.users.update({_id: Meteor.userId()}, {$inc:{"balance": -btcToInt(amount)}});
	      retVal = {
	        amt: amount,
	        txId: txId,
	        addr: address
	      };
		  	return retVal;
		  } else {
			  throw new Meteor.Error(500, "Transaction aborted, try again later");
			}
		}
	}
});


function getReceivedByAddress(address, numconf) {
  var Future = Npm.require("fibers/future");
  var fut = new Future();
  btcdClient.getReceivedByAddress(address, numconf, function(err, data) {
    if (err) return console.log(err);
    fut.ret(btcToInt(data));
  });
  return fut.wait();
}

function validateAddress(address) {
  var Future = Npm.require("fibers/future");
  var fut = new Future();
  btcdClient.validateAddress(address, function(err, data) {
    if (err) return console.log(err);
    fut.ret(data.isvalid);
  });
  return fut.wait();
}

function getWalletBalance() {
  var Future = Npm.require("fibers/future");
  var fut = new Future();
  btcdClient.getBalance('', 6, function(err, data) {
    if (err) return console.log(err);
    fut.ret(data);
  });
  return fut.wait();
}

function sendToAddress(address, amount) {
  var Future = Npm.require("fibers/future");
  var fut = new Future();
  btcdClient.sendToAddress(address, amount - 0.0005, function(err, trxId) {
    if (err) return console.log(err);
    fut.ret(trxId);
  });
  return fut.wait();
}


