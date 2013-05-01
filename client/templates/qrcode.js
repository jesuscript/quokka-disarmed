Template.qrCode.helpers({
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

Template.qrCode.events({
	'click #dia-close-btn, click .close, click .shroud': function(e, tmpl){
		e.preventDefault();
		TemplateHelpers.removeDialog(tmpl);
	}
});

