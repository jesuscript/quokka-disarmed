Meteor.methods({
  submitChatMsg: function(msg){
    Collections.ChatMsgs.insert({
      userId: this.userId,
      username: this.userId ? Meteor.users.findOne({_id: this.userId}).username : "Anonymous",
      message: msg,
      timestamp: (new Date()).getTime()
    });
  }
});
