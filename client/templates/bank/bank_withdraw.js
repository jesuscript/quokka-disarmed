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
    if(Session.get('timeToValidateDeposits')) return Session.get('timeToValidateDeposits');

    return undefined;
  },
  error: function(){
    var err = Session.get("withdraw_error");
    
    if(err) return err.reason;

    return undefined;
  },
  transfer: function(){
    return Session.get("withdraw_tmpl_transfer");
  }
});

Template.bankWithdraw.events({
  'click .withdraw-btn': function(e, tmpl){
    var address = $(tmpl.find(".address-input")).val();
    var amount = $(tmpl.find(".amount-input")).val();
    
    // client validation very limited on purpose as most of it would be doing server calls anyway
    // ... and code would end up being duplicated
    if(address.length < 27 || address.length > 34){
      Session.set("withdraw_error", {
        error: 406,
        reason: "Address is invalid"
      });
    } else {
      Meteor.call(
        'requestWithdrawal',
        address,
        btcToInt(amount),
        function(err, transfered){
          if(err){
            Session.set("withdraw_error", err);
          }else{
            Session.set("withdraw_error");
            
            TemplateHelpers.removeDialog(tmpl);

            if (transfered) {
              Session.set("withdraw_tmpl_transfer", {
                completed: true,
                transaction: transfered
              });
            } else {
              Session.set("withdraw_tmpl_transfer", {
                completed: false
              });
            }
          }
        }
      );
    }
  }
});
