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