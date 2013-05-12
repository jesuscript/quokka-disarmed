Collections.Bets = new Meteor.Collection("bets");
Collections.Games = new Meteor.Collection("games");
Collections.GameStats = new Meteor.Collection("gameStats");
Collections.Flags = new Meteor.Collection("flags");

if(Meteor.isServer){
  AddressPool = new Meteor.Collection("addressPool"); // server only

  Meteor.publish("flags", function(){
    return Collections.Flags.find({});
  });
  Meteor.publish("gameStats", PublishModels.gameStats);
  
  Meteor.publish("games", function(){
    return Collections.Games.find({},{sort: {timestamp: -1}, limit: 100});
  });

  Meteor.publish("userBets", function(){
    console.log(this.userId);
    return Collections.Bets.find({playerId: this.userId});
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
  Deps.autorun(function(){
    Meteor.user(); // to set the dependency
    Meteor.subscribe("userBets");
  });
}

// the user shouldn't have the right to modify anything within their user profiles
Meteor.users.deny({update: function () { return true; }});
