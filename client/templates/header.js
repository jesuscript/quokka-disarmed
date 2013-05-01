Template.header.helpers({
	depositAddress: function () {
  	return Meteor.user().depositAddress;
	}
});


Template.header.events({
  'click img' : function () {
	  $("body").append(Meteor.render(Template.qrCode))
	}
});

