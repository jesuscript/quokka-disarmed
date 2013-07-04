Meteor.startup(function(){
  Meteor.subscribe("games");
  Meteor.subscribe("gameStats");
  Meteor.subscribe("flags");
  Meteor.subscribe("userData");
  Meteor.subscribe("users");
  Meteor.subscribe("payouts");
  Meteor.subscribe("news");

  var betsHandle;
  Deps.autorun(function(){
    console.log("update bets", betsHandle);

    betsHandle && betsHandle.stop();
    
    Collections.Games.find({completed: false}); // for reactivity
    betsHandle = Meteor.subscribe("bets");  
  });
});
