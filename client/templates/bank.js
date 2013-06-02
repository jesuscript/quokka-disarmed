Template.bank.helpers({
  isOpen: function(){
    return Session.get("bank_tmp_open");
  },
  qrCode: function(){
    Meteor.call('getQrImg', function(err, qrCode) {
      if (err) console.log(err);
      Session.set('qrCodeImg', qrCode);
    }); 
    if (Session.get('qrCodeImg'))
      return Session.get('qrCodeImg');
  },
  depositAddress: function(){
    return Meteor.user() && Meteor.user().depositAddress;
  }
});

Template.bank.events({
  "click .bank-btn, click .shroud, click .close-dialog": function(e){
    e.preventDefault();
    Session.set("bank_tmp_open", !Session.get("bank_tmp_open"));
  },
});

Template.bank.preserve(["#bank .pull-down"]);
