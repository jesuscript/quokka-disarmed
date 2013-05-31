Template.bank.helpers({
  isOpen: function(){
    return Session.get("bank_tmp_open");
  } 
});

Template.bank.events({
  "click .bank-btn": function(e){
    e.preventDefault();
    Session.set("bank_tmp_open", !Session.get("bank_tmp_open"));
  } 
});

Template.bank.preserve(["#bank"]);
