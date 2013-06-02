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
    Session.set("bank_tmpl_open", !Session.get("bank_tmpl_open"));
  },
  "click .signin-btn": function(e){
    e.preventDefault();
    Auth.showSignupDialog();
  },
  "click .signup-btn": function(e){
    e.preventDefault();
    Auth.showSignupDialog();
  },
  "click .deposit-btn": function(e){
    e.preventDefault();
    Session.set("bank_tmpl_mode", "deposit");
  },
  "click .withdraw-btn": function(e){
    e.preventDefault();
    Session.set("bank_tmpl_mode", "withdraw");
  } 
});

Template.bank.preserve(["#bank .pull-down", ".shroud"]);
