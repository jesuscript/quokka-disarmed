Meteor.methods({
  submitChatMsg: function(msg){
    check(msg, String);
    
    if (!validMsg(msg)) return;
    Collections.ChatMsgs.insert({
      userId: this.userId,
      username: this.userId ? Meteor.user().username : "Anonymous",
      message: msg,
      timestamp: (new Date()).getTime()
    });
  }
});



function validMsg(msg){
  var isValidMsg = true;
  var reason = '';

  if (msg.length === 0) {
    reason = 'Message blank'; 
    isValidMsg = false;
  }

  if (msg.length > 130) {
    reason = 'Message length > 130 chars'; 
    isValidMsg = false;
  }

  if (!isValidMsg) console.warn('SECWARN: Attempt to pass invalid chat message detected. Reason: ' + reason);

  return isValidMsg;
}

