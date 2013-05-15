Meteor.startup(function(){
  Meteor.subscribe("games");
  Meteor.subscribe("gameStats");
  Meteor.subscribe("flags");
  Meteor.subscribe("userData");
  Deps.autorun(function(){
    Meteor.user(); // to set the dependency
    Meteor.subscribe("userBets");
  });

});
