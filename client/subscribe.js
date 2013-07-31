Meteor.startup(function(){
  Meteor.subscribe("activity");
  // Meteor.subscribe("allTimeNumbersStats");
  Meteor.subscribe("allTimeStats");
  Meteor.subscribe("allTimeWinners");

  var betsHandle, gameResultsHandle;
    
  Collections.Games.find({completed: false}).observeChanges({
    added: function(){
      betsHandle && betsHandle.stop();
      betsHandle =  Meteor.subscribe("bets");
      gameResultsHandle && gameResultsHandle.stop();
      gameResultsHandle = Meteor.subscribe("gameResults");
    }
  });

  Meteor.subscribe("chatMsgs");
  Meteor.subscribe("connections");
  Meteor.subscribe("connectionsMonitor");
  Meteor.subscribe("flags");
  Meteor.subscribe("games");
  Meteor.subscribe("hotColdStats");
  Meteor.subscribe("news");
  Meteor.subscribe("userData");
});

