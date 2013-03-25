collections = {};

collections.Players = new Meteor.Collection("Players");
collections.Games = new Meteor.Collection("Games");

if(Meteor.isServer){
  Meteor.publish("current_player", function(player_id){
    return collections.Players.find(player_id);
  });
  Meteor.publish("games", function(){
    return collections.Games.find({},{sort: {timestamp: -1}, limit: 100}); //TODO sort by date
  });
}

if(Meteor.isClient){
  Meteor.subscribe("games");
}
