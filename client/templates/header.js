Template.header.helpers({
	depositAddress: function() {
  	return Meteor.user().depositAddress;
	},
  alert: function() {
    var alertMsg = collections.Flags.findOne({type: 'alert'});
    return alertMsg && alertMsg.message.length;
  },
  message: function() {
    return collections.Flags.findOne({type: 'alert'}).message;
  },
  wrongReferrer: function() {
    var a =  document.createElement('a');
    a.href = document.referrer;
    if (a.hostname != 'localhost' && a.hostname != 'www.bittheodds.com') { 
      return true;
    }
    return false;
  }
});

Template.header.events({
  'click img': function() {
	  $("body").append(Meteor.render(Template.qrcode_dialog))
	}
});

