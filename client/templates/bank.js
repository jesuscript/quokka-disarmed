Template.bank.helpers({
  isOpen: function(){
    return Session.get("bank_tmp_open");
  } 
});

Template.bank.events({
  "click .bank-btn, click .shroud, click .close-dialog": function(e){
    e.preventDefault();
    Session.set("bank_tmp_open", !Session.get("bank_tmp_open"));
  },
});

Template.bank.preserve(["#bank .pull-down"]);
