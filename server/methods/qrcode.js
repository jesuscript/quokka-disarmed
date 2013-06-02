Meteor.methods({
  getQrImg: function(){
    var qr = QRCODE.qrcode(5, 'M');
    qr.addData('bitcoin:' + Meteor.user().depositAddress + '?label=bittheodds.com');
    qr.make();

    return qr.createImgTag(9);
  }
});
