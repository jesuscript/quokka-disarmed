Template.bankDeposit.helpers({
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
