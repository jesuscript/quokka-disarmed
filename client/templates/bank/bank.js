Template.bank.created = function(){
  Session.set("bank_tmpl_mode", "deposit");
};

Template.bank.helpers({
  isOpen: function(){
    return Session.get("bank_tmpl_open");
  },
  depositMode: function(){
    return Session.get("bank_tmpl_mode") == "deposit";
  },
  withdrawMode: function(){
    return Session.get("bank_tmpl_mode") == "withdraw";
  }
});

Template.bank.events({
  "click .bank-btn, click .shroud, click .close-dialog": function(e){
    e.preventDefault();
    resetWithdrawInterface();
    if (!Session.get("bank_tmpl_open")) 
    Session.set("bank_tmpl_mode", "deposit"); // deposit is default view
    Session.set("bank_tmpl_open", !Session.get("bank_tmpl_open"));
  },
  "click .signin-btn": function(e){
    e.preventDefault();
    Auth.showSigninDialog();
  },
  "click .signup-btn": function(e){
    e.preventDefault();
    Auth.showSignupDialog();
  },
  "click .deposit-btn": function(e){
    e.preventDefault();
    resetWithdrawInterface();
    Session.set("bank_tmpl_mode", "deposit");
  },
  "click .withdraw-btn": function(e){
    e.preventDefault();
    Session.set("bank_tmpl_mode", "withdraw");
    calculateWithdrawStatus();
  } 
});

Template.bank.preserve(["#bank .pull-down", ".shroud"]);

function resetWithdrawInterface() {
  Session.set("withdraw_error");
  Session.set("withdraw_bitcoindDown"); // don't show 'btcd down' dialog again as it could have gone back up
  Session.set("withdraw_tmpl_transfer"); // don't show 'transfer in progress' dialog again
}


function calculateWithdrawStatus(){
  if (Meteor.user().balance) {
    Meteor.call('areDepositsConfirmed', function(err, depositsConfirmed) {
      if (err) {
        Session.set("withdraw_bitcoindDown", {
          error: err.error,
          reason: err.reason
        });
      }
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
  }
};