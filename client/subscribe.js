Meteor.startup(function(){
  Meteor.subscribe("games");
  Meteor.subscribe("gameStats");
  Meteor.subscribe("flags");
  Meteor.subscribe("userData");
  Meteor.subscribe("news");
  Deps.autorun(function(){
    Collections.Games.find({completed: false}); // for reactivity
    Meteor.subscribe("bets");  
  });
});
