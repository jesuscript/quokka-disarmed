Meteor.startup(function(){
  Meteor.subscribe("games");
  Meteor.subscribe("flags");
  Meteor.subscribe("userData");
  Meteor.subscribe("users");
  Meteor.subscribe("payouts");
  Meteor.subscribe("news");

  var betsHandle;
  
  Deps.autorun(function(){
    betsHandle && betsHandle.stop();
    
    Collections.Games.find({completed: false}).fetch(); // for reactivity
    betsHandle = Meteor.subscribe("bets");  
  });
});
