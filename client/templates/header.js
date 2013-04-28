
Template.header.helpers({
    depositAddress: function(){
        return Meteor.user().depositAddress;
    },
});