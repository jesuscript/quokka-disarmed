Meteor.startup(function(){
  Meteor.subscribe("activity");
  Meteor.subscribe("allTimeStats");

  var betsHandle;
  Deps.autorun(function(){
    betsHandle && betsHandle.stop();
    Collections.Games.find({completed: false}).fetch(); // for reactivity
    betsHandle = Meteor.subscribe("bets");  
  });

  Meteor.subscribe("chatMsgs");
  Meteor.subscribe("connections");
  Meteor.subscribe("connectionsMonitor");
  Meteor.subscribe("flags");
  Meteor.subscribe("games");
  Meteor.subscribe("news");
  Meteor.subscribe("payouts");
  Meteor.subscribe("userData");
  Meteor.subscribe("users");
});

