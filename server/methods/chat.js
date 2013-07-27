Meteor.methods({
  submitChatMsg: function(msg){
    Collections.ChatMsgs.insert({
      userId: this.userId,
      username: this.userId ? Meteor.user().username : "Anonymous",
      message: msg,
      timestamp: (new Date()).getTime()
    });
  }
});
