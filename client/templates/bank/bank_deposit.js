Template.bankDeposit.helpers({
  qrCode: function(){
    if (Session.get('qrCodeImg')) {
      return Session.get('qrCodeImg');
    } else {
      Meteor.call('getQrImg', function(err, qrCode) {
        if (err) console.error(err);
        Session.set('qrCodeImg', qrCode); // contains the img tag
      });
    }
  },
  depositAddress: function(){
    return Meteor.user() && Meteor.user().depositAddress;
  }
});
