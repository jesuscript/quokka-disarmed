Meteor.startup(function(){
  Meteor.subscribe("activity");
  Meteor.subscribe("allTimeNumbersStats");
  Meteor.subscribe("allTimeStats");
  Meteor.subscribe("allTimeWinners");

  var betsHandle;
    
  Collections.Games.find({completed: false}).observeChanges({
    added: function(){
      betsHandle && betsHandle.stop();
      betsHandle =  Meteor.subscribe("bets");      
    }
  });

  Meteor.subscribe("betsAndGames"); 
  Meteor.subscribe("chatMsgs");
  // Meteor.subscribe("connections");
  // Meteor.subscribe("connectionsMonitor");
  Meteor.subscribe("flags");
  Meteor.subscribe("games");
  Meteor.subscribe("news");
  Meteor.subscribe("payouts");
  Meteor.subscribe("userData");

});

