collections = {};

collections.Bets = new Meteor.Collection("bets");
collections.Games = new Meteor.Collection("games");

if(Meteor.isServer){
    Meteor.publish("bets", function(current_game_id){
        return collections.Bets.find({}, {sort: {timestamp: -1}, limit: 1});
    });
    Meteor.publish("games", function(){
        return collections.Games.find({},{sort: {timestamp: -1}, limit: 100}); //TODO sort by date
    });
    Meteor.publish("userData", function(){
        return Meteor.users.find({_id: this.userId},
                                 {fields: {'balance': 1, 'anonymous': 1, 'token': 1}});
    });
}

if(Meteor.isClient){
    Meteor.subscribe("bets");
    Meteor.subscribe("games");
    Meteor.subscribe("userData");
}
