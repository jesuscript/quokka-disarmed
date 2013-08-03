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
  bitcoindDown: function(){
    var err = Session.get("withdraw_bitcoindDown");
    if(err) return err.reason;
    return undefined;
  },
  error: function(){
    var err = Session.get("withdraw_error");
    if(err) return err.reason;
    return undefined;
  },
  transfer: function(){
    return Session.get("withdraw_tmpl_transfer");
  },
  hasBalance: function(){
    return Meteor.user().balance;
  }
});

Template.bankWithdraw.events({
  "submit form": function(e, tmpl){
    e.preventDefault();
    var address = $(tmpl.find("[name=address]")).val();
    var amount = $(tmpl.find("[name=amount]")).val();
    var regexp = /^\d+(\.\d{1,8})?$/;
    if(address.length < 27 || address.length > 34){
      Session.set("withdraw_error", {
        error: 406,
        reason: "Address is invalid"
      });
    } else if (amount < 0.001) {
      Session.set("withdraw_error", {
        error: 406,
        reason: "Minimum withdrawal amount is ฿0.001"
      });
    } else if (!regexp.test(amount)) {
      Session.set("withdraw_error", {
        error: 406,
        reason: "Amount is invalid"
      });
    } else {
      Meteor.call(
        'requestWithdrawal',
        address,
        btcToInt(amount),
        function(err, trxInformation){
          if(err){
            Session.set("withdraw_error", err);
          }else{
            Session.set("withdraw_error");
            TemplateHelpers.removeDialog({ tmpl:tmpl });
            if (trxInformation) {
              Session.set("withdraw_tmpl_transfer", {
                instant: true,
                transaction: trxInformation
              });
            } else {
              Session.set("withdraw_tmpl_transfer", {
                instant: false
              });
            }
          }
        }
      );
    }
  }
});


Template.withdrawForm.rendered = function(){
  this.find("input").focus();
  $(this.find('#withdrawAmount')).autoNumeric('init', {mDec: '8', aPad: false, aSep: ''} );
};
