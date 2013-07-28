Meteor.publish("activity", function(){
  return Collections.Activity.find({},{sort: {timestamp: -1}, limit: 100});
});

AddressPool = new Meteor.Collection('addressPool'); // server only

Meteor.publish('allTimeNumbersStats', function(){
  return Collections.AllTimeNumbersStats.find({});
});

Meteor.publish('allTimeStats', function(){
  return Collections.AllTimeStats.find({});
});

Meteor.publish('allTimeWinners', function(){
  return Collections.AllTimeWinners.find({}, {sort: {totalReceived: -1}, limit: 10}, {fields: {playerName:1, totalReceived: 1}});
});

Meteor.publish('bets', function(){ //update to publish only for the current game
  console.log('calling publish');
  var game = DB.currentGame();

  return game && Collections.Bets.find({gameId: DB.currentGame()._id});
});

Meteor.publish("chatMsgs", function(){
  return Collections.ChatMsgs.find({},{sort: {timestamp: -1}, limit: 30});
});

// Meteor.publish('connections', function(){
//   return Collections.Connections.find({});
// });

Meteor.publish('flags', function(){
  return Collections.Flags.find({});
});

Meteor.publish('games', function(){
  return Collections.Games.find({},{sort: {createdAt: -1}, limit: 50}, {fields: {luckyNum:1, completed: 1}}); // even 1080p panels can only display 4x 'previous lucky nums' at a time
});

Meteor.publish('news', function(){
  return Collections.News.find({}, {sort: {timestamp: -1}, limit: 10});
});

Meteor.publish('payouts', function(){
  return Collections.Payouts.find({},{sort: {timestamp: -1}, limit: 10});
});

Meteor.publish('userData', function(){  // userdata is a built-in meteor collection
  return Meteor.users.find({_id: this.userId}, // publishes extra fields beyond the default username, emails and profile fields
                           {fields: { 
                             'balance': 1,
                             'depositAddress': 1
                           }});
});

// the user shouldn't have the right to modify anything within their user profiles without going through our server methods first
Meteor.users.deny({update: function () { return true; }});








