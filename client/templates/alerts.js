Template.alerts.helpers({
  alert: function() {
    var alertMsg = Collections.Flags.findOne({type: 'alert'});
    return alertMsg && alertMsg.message.length;
  },
  message: function() {
    return Collections.Flags.findOne({type: 'alert'}).message;
  },
  emailNotVerified: function() {
    return !Meteor.user().emails[0].verified;
  }
});


Template.alerts.events({
  "click .resendVerificationEmail-btn": function(e){
    e.preventDefault();
    Auth.resendVerificationEmail();
  }  
});
