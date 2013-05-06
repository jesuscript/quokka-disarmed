// TODO: not sure how to improve this, but it sure is ugly. See issue #15.
Template.withdraw_dialog.helpers({
  depositsConfirmed: function(){
    Meteor.call('areDepositsConfirmed', function(err, depositsConfirmed) {
      if (err) console.log(err);
      Session.set('depositsConfirmed', depositsConfirmed);
    }); 
    if (Session.get('depositsConfirmed'))
      return Session.get('depositsConfirmed');
  },
  outstandingDeposits: function(){
    Meteor.call('getOutstandingDeposits', function(err, outstandingDeposits) {
      if (err) console.log(err);
      Session.set('outstandingDeposits', outstandingDeposits);
    }); 
    if (Session.get('outstandingDeposits'))
      return intToBtc(Session.get('outstandingDeposits'));
  },
  timeToValidateDeposits: function(){
    Meteor.call('getTimeToValidateDeposits', function(err, timeToValidateDeposits) {
      if (err) console.log(err);
      Session.set('timeToValidateDeposits', timeToValidateDeposits);
    }); 
    if (Session.get('timeToValidateDeposits'))
      return Session.get('timeToValidateDeposits');
  },
  error: function(){
    var err = Session.get("withdraw_error");
    if(err) return err.reason;
  }
});


Template.withdraw_dialog.events({
  'click .cancel, click #dia-close-btn, click .close, click .shroud': function(e, tmpl){ // TODO: interface uses dia-close-btn, but also .cancel... need to streamline
    TemplateHelpers.removeDialog(tmpl, function(){
        Session.set("withdraw_error");
    });
  },
  'click .submit-btn': function(e, tmpl){
    var address = $("#withdraw-dialog [name=address]").val();
    var amount = $("#withdraw-dialog [name=amount]").val();
    // client validation very limited on purpose as most of it would be doing server calls anyway
    // ... and code would end up being duplicated
    if(address.length < 27 || address.length > 34){
      Session.set("withdraw_error", {
        error: 406,
        reason: "Address is invalid"
      });
    } else {
      Meteor.call('requestWithdrawal',
        address,
        amount,
        function(err, transfered){
          if(err){
            Session.set("withdraw_error", err);
          }else{
            Session.set("withdraw_error");
            TemplateHelpers.removeDialog(tmpl);
            Session.set("lastTrx", transfered);
            if (transfered) {
              $("body").append(Meteor.render( Template.withdraw_confirmation_instant ));
            } else {
              $("body").append(Meteor.render( Template.withdraw_confirmation_delayed ));
            }
          }
        }
      );
    }
  }
});




Template.withdraw_confirmation_instant.helpers({
  address: function(){
    var lastTrx = Session.get("lastTrx");
    return lastTrx.addr;
  },
  txId: function(){
    var lastTrx = Session.get("lastTrx");
    return lastTrx.txId;
  },
  amount: function(){
    var lastTrx = Session.get("lastTrx");
    return lastTrx.amt;
  }
});


Template.withdraw_confirmation_instant.events({
  'click .cancel, click #dia-close-btn, click .shroud': function(e, tmpl){
    TemplateHelpers.removeDialog(tmpl);
  },
});



Template.withdraw_confirmation_delayed.events({
  'click .cancel, click #dia-close-btn, click .shroud': function(e, tmpl){
    TemplateHelpers.removeDialog(tmpl);
  },
});


