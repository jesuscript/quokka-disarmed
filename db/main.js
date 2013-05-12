collections.Bets = new Meteor.Collection("bets");
collections.Games = new Meteor.Collection("games");
collections.GameStats = new Meteor.Collection("gameStats");
collections.Flags = new Meteor.Collection("flags");

if(Meteor.isServer){
  AddressPool = new Meteor.Collection("addressPool"); // server only

  Meteor.publish("flags", function(){
    return collections.Flags.find({});
  });
  Meteor.publish("gameStats", publishModels.gameStats);
  
  Meteor.publish("games", function(){
    return collections.Games.find({},{sort: {timestamp: -1}, limit: 100});
  });
  
  Meteor.publish("userData", function(){  // built-in meteor collection
    return Meteor.users.find({_id: this.userId},
                             {fields: {
                               'balance': 1,
                               'anonymous': 1,
                               'token': 1,
                               'depositAddress': 1
                             }});
  });
}

if(Meteor.isClient){
  Meteor.subscribe("games");
  Meteor.subscribe("gameStats");
  Meteor.subscribe("flags");
  Meteor.subscribe("userData");
}

// the user shouldn't have the right to modify anything within their user profiles
Meteor.users.deny({update: function () { return true; }});
