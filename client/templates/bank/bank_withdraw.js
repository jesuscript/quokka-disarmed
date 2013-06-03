Template.bankWithdraw.rendered = function(){
    Meteor.call('areDepositsConfirmed', function(err, depositsConfirmed) {
      if (err) console.log(err);
      Session.set('depositsConfirmed', depositsConfirmed);
    }); 
    Meteor.call('getOutstandingDeposits', function(err, outstandingDeposits) {
      if (err) console.log(err);
      Session.set('outstandingDeposits', outstandingDeposits);
    }); 
    Meteor.call('getTimeToValidateDeposits', function(err, timeToValidateDeposits) {
      if (err) console.log(err);
      Session.set('timeToValidateDeposits', timeToValidateDeposits);
    }); 
};

Template.bankWithdraw.helpers({
  depositsConfirmed: function(){
    return Session.get('depositsConfirmed');
  },
  outstandingDeposits: function(){
    var outDeposits = Session.get('outstandingDeposits');
    return outDeposits && intToBtc(outDeposits);
  },
  timeToValidateDeposits: function(){
    if (Session.get('timeToValidateDeposits'))
      return Session.get('timeToValidateDeposits');
  },
  error: function(){
    var err = Session.get("withdraw_error");
    if(err) return err.reason;
  }
});
