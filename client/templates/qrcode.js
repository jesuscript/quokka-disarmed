Template.qrcode_dialog.helpers({
  qrCode: function(){
    Meteor.call('getQrImg', function(err, qrCode) {
      if (err) console.log(err);
      Session.set('qrCodeImg', qrCode);
    }); 
    if (Session.get('qrCodeImg'))
      return Session.get('qrCodeImg');
  },
  depositAddress: function(){
    return Meteor.user().depositAddress;
  }
});

Template.qrcode_dialog.events({
	'click #dia-close-btn, click .close, click .shroud': function(e, tmpl){
		TemplateHelpers.removeDialog(tmpl);
	}
});

